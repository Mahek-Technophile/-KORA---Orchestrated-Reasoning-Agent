import { Citation, ConfidenceScore, ConflictReport } from '../types/enterprise';

export interface VerificationResult {
  confidence: ConfidenceScore;
  groundedClaimsCount: number;
  totalClaimsCount: number;
  unsupportedClaims: string[];
  isVerified: boolean;
}

/**
 * Computes a transparent, observable prototype confidence heuristic.
 * 
 * Note: This is an empirical prototype heuristic combining observable signals
 * (citation relevance, authority tier, temporal policy validity, conflict presence,
 * and quantitative fact extraction) — NOT a statistical LLM probability.
 */
export function computeVerificationAndConfidence(
  answerText: string,
  citations: Citation[],
  conflictReport: ConflictReport
): VerificationResult {
  if (citations.length === 0) {
    return {
      confidence: {
        level: 'LOW',
        score: 15,
        explanation: 'LOW — No accessible authoritative documents retrieved under the active role permissions.',
        factors: {
          retrievalRelevance: 0,
          authorityLevel: 0,
          temporalValidity: 0,
          uncontradictedScore: 50,
          verificationPassRate: 0
        }
      },
      groundedClaimsCount: 0,
      totalClaimsCount: 1,
      unsupportedClaims: ['Access restricted or no policy documents found'],
      isVerified: false
    };
  }

  // 1. Observable Factor: Average Retrieval Relevance
  const avgRelevance = citations.reduce((sum, c) => sum + c.relevanceScore, 0) / citations.length;

  // 2. Observable Factor: Source Authority Level (BOARD = 100, VP_LEVEL = 95, DIRECTOR = 80, DEPT = 65)
  const authorityPoints = citations.map(c => {
    if (c.authority === 'BOARD') return 100;
    if (c.authority === 'VP_LEVEL') return 95;
    if (c.authority === 'DIRECTOR') return 80;
    return 65;
  });
  const avgAuthority = authorityPoints.reduce((a, b) => a + b, 0) / authorityPoints.length;

  // 3. Observable Factor: Policy Temporal Validity (ACTIVE = 100, SUPERSEDED = 45)
  const temporalPoints = citations.map(c => c.status === 'ACTIVE' ? 100 : 45);
  const avgTemporal = temporalPoints.reduce((a, b) => a + b, 0) / temporalPoints.length;

  // 4. Observable Factor: Conflict Presence (No conflict = 100, Resolved = 90, Unresolved = 30)
  let uncontradictedScore = 100;
  if (conflictReport.detected) {
    uncontradictedScore = conflictReport.isResolved ? 90 : 30;
  }

  // 5. Observable Factor: Quantitative Clause Extraction & Matching
  const numbersInAnswer = (answerText.match(/\$\d+|\d+\s*days|\d+%/g) || []);
  let groundedNumbers = 0;
  const citationCombined = citations.map(c => c.excerpt).join(' ');

  for (const num of numbersInAnswer) {
    const rawVal = num.replace(/[^\d]/g, '');
    if (citationCombined.includes(rawVal)) {
      groundedNumbers++;
    }
  }

  const passRate = numbersInAnswer.length > 0 
    ? Math.round((groundedNumbers / numbersInAnswer.length) * 100) 
    : 95;

  // Weighted heuristic formula: (Relevance * 0.30) + (Authority * 0.25) + (Temporal * 0.20) + (Uncontradicted * 0.15) + (PassRate * 0.10)
  const finalScore = Math.round(
    (avgRelevance * 0.30) +
    (avgAuthority * 0.25) +
    (avgTemporal * 0.20) +
    (uncontradictedScore * 0.15) +
    (passRate * 0.10)
  );

  let level: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';
  let explanation = '';

  const activeCount = citations.filter(c => c.status === 'ACTIVE').length;

  if (finalScore >= 80) {
    level = 'HIGH';
    explanation = `HIGH — Supported by ${activeCount} currently effective authoritative source(s) with verified clause grounding.`;
    if (conflictReport.detected && conflictReport.isResolved) {
      explanation += ` Explicit policy version conflict resolved via active supersession metadata.`;
    }
  } else if (finalScore >= 55) {
    level = 'MEDIUM';
    explanation = `MEDIUM — Grounded in corporate policy; secondary cross-department requirements or historical references noted.`;
  } else {
    level = 'LOW';
    explanation = `LOW — Evidence is incomplete, restricted, or conflicting. Prototype heuristic recommends manual review.`;
  }

  return {
    confidence: {
      level,
      score: finalScore,
      explanation,
      factors: {
        retrievalRelevance: Math.round(avgRelevance),
        authorityLevel: Math.round(avgAuthority),
        temporalValidity: Math.round(avgTemporal),
        uncontradictedScore,
        verificationPassRate: passRate
      }
    },
    groundedClaimsCount: groundedNumbers,
    totalClaimsCount: numbersInAnswer.length || 1,
    unsupportedClaims: numbersInAnswer.filter(n => !citationCombined.includes(n.replace(/[^\d]/g, ''))),
    isVerified: finalScore >= 55
  };
}
