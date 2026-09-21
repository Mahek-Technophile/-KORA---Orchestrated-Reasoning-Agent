import { KORA_POLICIES, isRoleAuthorizedForChunk } from '../data/syntheticKnowledgeBase';
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
  const candidateDocs = KORA_POLICIES.filter(doc => 
    detectedDomains.includes(doc.domain) || detectedDomains.length === 0
  );

  const allChunks: PolicyChunk[] = [];
  candidateDocs.forEach(doc => {
    doc.chunks.forEach(chunk => {
      allChunks.push(chunk);
    });
  });

  // 2. Score candidate chunks across all domains before filtering to preserve intent and detect access barriers
  interface ScoredCandidate {
    chunk: PolicyChunk;
    score: number;
    doc: PolicyDocument;
    isAuthorized: boolean;
    distinctMatches: number;
  }

  const scoredCandidates: ScoredCandidate[] = [];

  for (const chunk of allChunks) {
    const parentDoc = KORA_POLICIES.find(d => d.id === chunk.documentId)!;
    const contentLower = chunk.content.toLowerCase();
    const sectionLower = chunk.section.toLowerCase();
    const isAuthorized = isRoleAuthorizedForChunk(userRole, chunk.accessLevel);
    
    let matchScore = 0;
    let distinctMatches = 0;

    // A. Term matching across content, section headers, and metadata keywords
    for (const term of qTerms) {
      let termMatched = false;
      if (contentLower.includes(term)) { matchScore += 3.0; termMatched = true; }
      if (sectionLower.includes(term)) { matchScore += 4.5; termMatched = true; }
      if (chunk.keywords.some(k => k.toLowerCase().includes(term))) { matchScore += 3.5; termMatched = true; }
      if (termMatched) distinctMatches++;
    }

    if (distinctMatches === 0 || matchScore < 3.0) {
      continue;
    }

    let score = matchScore;

    // Check if query mentions older historical terms or superseded figures (e.g. $50 per diem)
    const mentionsOlderFigures = /\b(50|50\.00|2024|v2|v2\.0|historical|superseded|previous|prior)\b/i.test(query);

    // B. Temporal relevance scoring:
    if (isHistoricalQuery || mentionsOlderFigures) {
      if (targetYear && parentDoc.effectiveDate.startsWith(targetYear.toString())) {
        score += 8.0;
      } else if (parentDoc.status === 'SUPERSEDED') {
        score += 5.0;
      }
    } else {
      if (parentDoc.status === 'ACTIVE') {
        score += 5.0;
      } else if (parentDoc.status === 'SUPERSEDED') {
        score -= 20.0; // Prevent obsolete versions from polluting current queries
      }
    }

    // C. Governance Authority weighting
    if (parentDoc.authorityLevel === 'BOARD') score += 2.0;
    if (parentDoc.authorityLevel === 'VP_LEVEL') score += 1.5;
    if (parentDoc.authorityLevel === 'DIRECTOR') score += 1.0;

    // D. Historical conflict relevance: boost older version if query references older values
    if (parentDoc.supersedesId && (isHistoricalQuery || mentionsOlderFigures)) {
      score += 1.0;
    }

    scoredCandidates.push({ chunk, score, doc: parentDoc, isAuthorized, distinctMatches });
  }

  // Sort descending by calculated relevance score
  scoredCandidates.sort((a, b) => b.score - a.score);

  // 3. DETERMINISTIC PRE-RETRIEVAL SECURITY FILTER (RBAC)
  // If the query specifically targets a restricted document, and the user's role lacks clearance,
  // we do NOT leak low-scoring unrelated documents as fallbacks.
  const filteredOutCount = scoredCandidates.filter(c => !c.isAuthorized).length;

  if (scoredCandidates.length > 0 && !scoredCandidates[0].isAuthorized) {
    // The top candidate answering this query is restricted for this user role
    return {
      candidateChunks: allChunks,
      authorizedChunks: [],
      filteredOutDocCount: filteredOutCount > 0 ? filteredOutCount : 1,
      detectedDomains,
      citations: []
    };
  }

  // User is authorized for the top match: retain authorized chunks matching topic threshold
  const authorizedScored = scoredCandidates.filter(s => s.isAuthorized);
  const topScore = authorizedScored.length > 0 ? authorizedScored[0].score : 0;
  
  // Prune unrelated low-scoring chunks (must be within 55% of top score and match core query terms)
  const topCandidate = authorizedScored[0];
  const relevantAuthorized = authorizedScored.filter(s => 
    s.score >= Math.max(topScore * 0.55, 8.0) && 
    (s.distinctMatches >= 2 || s.doc.id === topCandidate.doc.id || isHistoricalQuery)
  );

  const topK = relevantAuthorized.slice(0, 5);

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
