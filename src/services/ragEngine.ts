import { KOHLER_POLICIES, isRoleAuthorizedForChunk } from '../data/syntheticKnowledgeBase';
import { PolicyChunk, PolicyDocument, PolicyDomain, UserRole, Citation } from '../types/enterprise';

export interface RetrievalResult {
  candidateChunks: PolicyChunk[];
  authorizedChunks: PolicyChunk[];
  filteredOutDocCount: number;
  detectedDomains: PolicyDomain[];
  citations: Citation[];
}

const COMMON_STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'with', 'what', 'which', 'where', 'when', 'who',
  'how', 'can', 'should', 'would', 'does', 'from', 'this', 'that', 'our', 'all',
  'any', 'about', 'under', 'into', 'have', 'has', 'been', 'per', 'please', 'tell'
]);

// Multi-domain intent router based on normalized enterprise taxonomy
export function detectQueryDomains(query: string): PolicyDomain[] {
  const q = query.toLowerCase();
  const domains: Set<PolicyDomain> = new Set();

  // HR Domain
  if (/\b(leave|pto|vacation|remote|hybrid|wfh|parental|maternity|paternity|caregiver|conduct|severance|hr|holiday|retention|benefits|employee|associates?)\b/i.test(q)) {
    domains.add('HR');
  }

  // Finance Domain
  if (/\b(travel|meals?|per diem|flights?|airfare|hotel|lodging|reimburse|reimbursement|expenses?|concur|allowances?|procurement|discretionary|budgets?|spend|cost|finance|entertainment|hospitality|audit)\b/i.test(q)) {
    domains.add('FINANCE');
  }

  // Customer Support Domain
  if (/\b(warranty|warranties|toilets?|numi|veil|fixtures?|plumbing|faucets?|sinks?|defects?|replacement|repairs?|refund|support|complaints?|care|claims?)\b/i.test(q)) {
    domains.add('SUPPORT');
  }

  // Privacy Domain
  if (/\b(privacy|pii|customer data|telemetry|iot|smart home|data handling|gdpr|ccpa|dpa|dpia|retention|data sharing|konnect|pseudonym(ized)?|encryption)\b/i.test(q)) {
    domains.add('PRIVACY');
  }

  // Legal / Compliance Domain
  if (/\b(legal|vendors?|contracts?|dpa|msa|soc2|compliance|whistleblower|ethics|hotline|attorney|privilege|regulatory|laws?|subcontractors?)\b/i.test(q)) {
    domains.add('LEGAL');
  }

  // Default fallback if broad query
  if (domains.size === 0) {
    domains.add('HR');
    domains.add('FINANCE');
  }

  return Array.from(domains);
}

/**
 * Multi-domain permission-aware retrieval engine with deterministic temporal filtering.
 */
export function retrieveGroundedKnowledge(
  query: string,
  userRole: UserRole,
  explicitTargetYear?: number
): RetrievalResult {
  const detectedDomains = detectQueryDomains(query);
  
  // Extract search tokens while filtering out common English stop words
  const rawTerms = query.toLowerCase().replace(/[^a-z0-9\s$]/g, ' ').split(/\s+/);
  const qTerms = rawTerms.filter(t => t.length > 2 && !COMMON_STOP_WORDS.has(t));

  // Detect explicit historical query references (e.g. 2024 or 2025)
  const historicalYearMatch = query.match(/\b(202[0-5])\b/);
  const targetYear = explicitTargetYear || (historicalYearMatch ? parseInt(historicalYearMatch[1], 10) : undefined);
  const isHistoricalQuery = !!targetYear || /\b(historical|previous|past|superseded|prior)\b/i.test(query);

  // 1. Gather candidate documents matching identified domains (or all if broad)
  const candidateDocs = KOHLER_POLICIES.filter(doc => 
    detectedDomains.includes(doc.domain) || detectedDomains.length === 0
  );

  const allChunks: PolicyChunk[] = [];
  candidateDocs.forEach(doc => {
    doc.chunks.forEach(chunk => {
      allChunks.push(chunk);
    });
  });

  // 2. DETERMINISTIC PRE-RETRIEVAL SECURITY FILTER (RBAC)
  // Unauthorized chunks are dropped before any relevance scoring or context exposure
  const authorizedChunks: PolicyChunk[] = [];
  let filteredOutCount = 0;

  for (const chunk of allChunks) {
    if (isRoleAuthorizedForChunk(userRole, chunk.accessLevel)) {
      authorizedChunks.push(chunk);
    } else {
      filteredOutCount++;
    }
  }

  // 3. Scoring & Temporal-Aware Reranking
  interface ScoredChunk {
    chunk: PolicyChunk;
    score: number;
    doc: PolicyDocument;
  }

  const scored: ScoredChunk[] = [];

  for (const chunk of authorizedChunks) {
    const parentDoc = KOHLER_POLICIES.find(d => d.id === chunk.documentId)!;
    const contentLower = chunk.content.toLowerCase();
    const sectionLower = chunk.section.toLowerCase();
    let score = 0;

    // A. Term matching across content, section headers, and metadata keywords
    for (const term of qTerms) {
      if (contentLower.includes(term)) score += 3.0;
      if (sectionLower.includes(term)) score += 4.5;
      if (chunk.keywords.some(k => k.toLowerCase().includes(term))) score += 2.5;
    }

    // B. Temporal relevance scoring:
    // If user explicitly asks about historical years, boost the superseded policy from that timeframe
    if (isHistoricalQuery) {
      if (targetYear && parentDoc.effectiveDate.startsWith(targetYear.toString())) {
        score += 8.0;
      } else if (parentDoc.status === 'SUPERSEDED') {
        score += 4.0;
      }
    } else {
      // Default to active current policy
      if (parentDoc.status === 'ACTIVE') {
        score += 5.0;
      }
    }

    // C. Governance Authority weighting (Board / VP-level policies take precedence)
    if (parentDoc.authorityLevel === 'BOARD') score += 2.0;
    if (parentDoc.authorityLevel === 'VP_LEVEL') score += 1.5;
    if (parentDoc.authorityLevel === 'DIRECTOR') score += 1.0;

    // D. Include superseded policy alongside active if the query mentions obsolete or conflicting terms
    if (parentDoc.supersedesId && score > 0) {
      score += 1.0;
    }

    if (score > 0) {
      scored.push({ chunk, score, doc: parentDoc });
    }
  }

  // Sort descending by calculated relevance score
  scored.sort((a, b) => b.score - a.score);

  // Take top K chunks (up to 5 most relevant)
  const topK = scored.slice(0, 5);

  const citations: Citation[] = topK.map(item => ({
    docId: item.doc.id,
    title: item.doc.title,
    version: item.doc.version,
    section: item.chunk.section,
    effectiveDate: item.doc.effectiveDate,
    status: item.doc.status,
    excerpt: item.chunk.content,
    authority: item.doc.authorityLevel,
    accessLevel: item.chunk.accessLevel,
    relevanceScore: Math.min(Math.round((item.score / 25) * 100), 99)
  }));

  return {
    candidateChunks: allChunks,
    authorizedChunks: topK.map(t => t.chunk),
    filteredOutDocCount: filteredOutCount,
    detectedDomains,
    citations
  };
}
