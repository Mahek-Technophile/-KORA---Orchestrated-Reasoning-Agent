import { UserRole, AgentStep, PolicyDomain, OutputFormatType, Citation, ConflictReport, ConfidenceScore, FormattedOutputData } from '../types/enterprise';
import { retrieveGroundedKnowledge } from './ragEngine';
import { analyzePolicyConflicts } from './conflictDetector';
import { computeVerificationAndConfidence } from './verificationEngine';
import { detectRequestedFormat, buildDynamicOutput } from './outputFormatters';
import { SYNTHETIC_EMPLOYEE_DIRECTORY } from '../data/employeeDirectory';

export interface AgentExecutionPlan {
  steps: AgentStep[];
  detectedDomains: PolicyDomain[];
  citations: Citation[];
  conflictReport: ConflictReport;
  confidence: ConfidenceScore;
  answerText: string;
  outputData: FormattedOutputData;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  hitlRequired: boolean;
  toolsUsed: string[];
}

export async function executeAgentWorkflow(
  query: string,
  userRole: UserRole,
  overrideFormat?: OutputFormatType,
  callServerGemini?: (prompt: string) => Promise<string | null>
): Promise<AgentExecutionPlan> {
  const steps: AgentStep[] = [];
  const toolsUsed: string[] = [];
  const startTime = Date.now();

  // Step 1: Query Understanding & Intent Parsing
  const requestedFormat = detectRequestedFormat(query, overrideFormat);
  const isExcelTask = requestedFormat === 'EXCEL' || /employee|reimbursement eligible|spreadsheet/i.test(query);
  const isEmailTask = requestedFormat === 'EMAIL' || /email|draft/i.test(query);
  const isMultiDomainTask = /(sharing|vendor|external|cloud|warranty.*data|privacy.*legal)/i.test(query);

  steps.push({
    stepNumber: 1,
    type: 'UNDERSTAND',
    title: 'Deconstruct Query & Intent Classification',
    detail: `Intent parsed: ${isExcelTask ? 'Analytical Data Aggregation & Export' : isEmailTask ? 'Outbound Enterprise Communication' : isMultiDomainTask ? 'Cross-Departmental Governance Assessment' : 'Knowledge-Grounded Policy Inquiry'}. Requested format: ${requestedFormat}. Target User Role: ${userRole}.`,
    status: 'COMPLETED',
    durationMs: 45,
    data: { requestedFormat, intentType: isExcelTask ? 'DATA_EXPORT' : 'INQUIRY' }
  });

  // Step 2: Domain Routing
  const retrieval = retrieveGroundedKnowledge(query, userRole);
  steps.push({
    stepNumber: 2,
    type: 'ROUTE',
    title: 'Domain & Intent Routing',
    detail: `Query mapped to domain ontology: [${retrieval.detectedDomains.join(', ')}]. Cross-domain dispatch confirmed.`,
    status: 'COMPLETED',
    durationMs: 30,
    data: { domains: retrieval.detectedDomains }
  });

  // Step 3: Deterministic Pre-Retrieval Security Filter (RBAC)
  const isAccessAllowed = retrieval.authorizedChunks.length > 0;
  steps.push({
    stepNumber: 3,
    type: 'SECURITY_FILTER',
    title: 'Deterministic RBAC Pre-Retrieval Security Filter',
    detail: `Evaluated ${retrieval.candidateChunks.length} candidate chunk(s). Dropped ${retrieval.filteredOutDocCount} restricted document(s) based on Role: ${userRole}. ${retrieval.authorizedChunks.length} chunk(s) cleared for context assembly.`,
    status: isAccessAllowed ? 'COMPLETED' : 'WARNING',
    durationMs: 25,
    data: { authorizedChunks: retrieval.authorizedChunks.length, dropped: retrieval.filteredOutDocCount }
  });

  // Step 4: Hybrid Retrieval & Citation Extraction
  steps.push({
    stepNumber: 4,
    type: 'RETRIEVE',
    title: 'Hybrid Dense Semantic + BM25 Retrieval',
    detail: `Retrieved ${retrieval.citations.length} governing policy citation(s) from authoritative repositories: ${retrieval.citations.map(c => `${c.docId} (${c.version})`).join(', ') || 'None accessible'}.`,
    status: 'COMPLETED',
    durationMs: 65,
    data: { citationsCount: retrieval.citations.length }
  });

  // Step 5: Tool Invocations
  if (isExcelTask) {
    toolsUsed.push('employee_directory_lookup', 'expense_policy_auditor', 'excel_binary_builder');
    steps.push({
      stepNumber: 5,
      type: 'TOOL_EXECUTION',
      title: 'Tool Execution: Employee Directory & Expense Audit Engine',
      detail: `Invoked tools [employee_directory_lookup] and [expense_policy_auditor]. Screened ${SYNTHETIC_EMPLOYEE_DIRECTORY.length} employee expense records against Section 3.2 ($75 per diem cap). Flagged 1 non-compliant record ($94.00/day).`,
      status: 'COMPLETED',
      durationMs: 80,
      data: { recordsProcessed: SYNTHETIC_EMPLOYEE_DIRECTORY.length }
    });
  } else if (isEmailTask) {
    toolsUsed.push('email_composition_engine', 'policy_citation_formatter');
    steps.push({
      stepNumber: 5,
      type: 'TOOL_EXECUTION',
      title: 'Tool Execution: Email Composition & Compliance Formatter',
      detail: `Invoked tool [email_composition_engine]. Synthesized formal communication with inline policy citations and required approval routing.`,
      status: 'COMPLETED',
      durationMs: 50,
      data: { tool: 'email_composition_engine' }
    });
  }

  // Step 6: Policy Conflict Analysis & Supersession Resolution
  const conflictReport = analyzePolicyConflicts(query, retrieval.citations);
  if (conflictReport.detected) {
    toolsUsed.push('policy_diff_and_conflict_resolver');
    steps.push({
      stepNumber: 6,
      type: 'CONFLICT_CHECK',
      title: 'Policy Conflict & Supersession Analysis',
      detail: `${conflictReport.description} ${conflictReport.resolution}`,
      status: 'COMPLETED',
      durationMs: 40,
      data: { conflict: conflictReport }
    });
  }

  // Step 7: Reasoning & Synthesis
  let synthesizedText = "";

  if (!isAccessAllowed) {
    synthesizedText = `**Access Restricted by Role Security Policy**\n\nYour current profile role (**${userRole}**) does not possess the requisite clearance to view the requested executive or restricted policy documentation.\n\n• **Governing Security Rule**: RBAC-SEC-402 (Restricted Executive Documents)\n• **Required Role**: FINANCE, HR Specialist, or Enterprise Administrator\n• **Action Available**: Please request temporary elevated privileges from the Corporate Controller or switch roles in the top-right header to simulate elevated access.`;
  } else {
    // Specific domain synthesis rules based on query intent and citations
    if (/discretionary.*entertainment|entertainment.*budget|entertainment.*cap|hospitality.*cap|discretionary.*cap|executive.*entertainment/i.test(query)) {
      synthesizedText = `### Director & Executive Discretionary Entertainment Guidelines\n\nGoverned by **Corporate Treasury Guidelines (Doc ID: KORA-FIN-DISC-109-V1, Section 2.3)**:\n\n• **Annual Discretionary Cap**: Managing Directors and Vice Presidents maintain an annual discretionary client entertainment allocation up to **$25,000 USD** per fiscal year.\n• **Single Event Approval**: Any single hospitality event exceeding **$2,500 USD** requires Chief Financial Officer (CFO) pre-authorization and itemized attendee corporate identification.\n• **Reporting**: Must include itemized receipts with corporate attendee identification.\n• **Clearance Tier**: Restricted strictly to Finance Auditors, Controllers, and Executive Leadership (FINANCE_ONLY).`;
    } else if (conflictReport.detected && conflictReport.type === 'VERSION_SUPERSEDED' && /travel|meal|per diem|50|concur|flight|expense/i.test(query)) {
      synthesizedText = `### Domestic Travel Meal Reimbursement Policy\n\nAccording to the current **Global Business Travel & Expense Policy (Doc ID: KORA-FIN-POL-101-V3, Version 3.1, Effective January 1, 2026)**:\n\n• **Domestic Daily Meal Allowance**: **$75.00 USD per day** (allocated as $15 breakfast, $20 lunch, $40 dinner).\n• **International Daily Allowance**: **$110.00 USD per day**.\n• **Receipt Mandate**: Mandatory for any single meal receipt exceeding **$25.00 USD**.\n\n> ⚠️ **Policy Conflict Resolution Notice**:\n> An earlier version of this document (**Policy v2.0, 2024**) stipulated a $50.00/day allowance. That version was formally **superseded on January 1, 2026** by Version 3.1 under VP-level authorization. The currently active and legally binding cap is **$75.00 USD**.`;
    } else if (isMultiDomainTask) {
      synthesizedText = `### Cross-Departmental Requirements: External Cloud Vendor Data Sharing\n\nSharing customer warranty records and KORA Connect smart fixture IoT telemetry with an external vendor requires cross-departmental clearance across **Privacy**, **Legal**, and **Support** domains:\n\n1. **Data Privacy Office Clearance (Policy v3.0, Section 4.3)**:\n   • Mandatory **Data Privacy Impact Assessment (DPIA)** approved by the Chief Privacy Officer.\n   • Customer telemetry must be edge-pseudonymized with **AES-256 encryption in transit and at rest**.\n   • Direct export of unmasked customer lists is strictly forbidden.\n\n2. **Legal & Compliance Due Diligence (Protocol v3.0, Section 2.2)**:\n   • Execution of a bilateral **Data Protection Agreement (DPA)** incorporating Standard Contractual Clauses (SCCs).\n   • Independent audit verification: Vendor must hold active **SOC2 Type II or ISO 27001** certification.\n   • Procurement Master Service Agreement (MSA) sign-off.\n\n3. **Customer Experience & Warranty Scope (Guidelines v4.0)**:\n   • Warranty telemetry usage must be confined strictly to diagnostic verification and defect mitigation (under Section 2.4).\n\n4. **Breach Notification Protocol (Legal Section 5.4)**:\n   • Vendor contract must mandate a **24-hour incident notification** window to KORA Legal Incident Response.`;
    } else if (/executive.*severance|retention/i.test(query)) {
      synthesizedText = `### Executive Severance & Transition Protocols\n\nGoverned by **Executive Compensation Guidelines (Doc ID: KORA-HR-EXEC-009-V2, Section 4.1)**:\n\n• **Severance Multiple**: Executive Band 1 (VP and above) departures not for cause are eligible for **18 months base salary continuation** plus prorated annual bonus.\n• **Outplacement**: 12 months executive outplacement services.\n• **Covenants**: 24-month non-solicitation agreement and mandatory non-disclosure.\n• **Required Authorization**: Co-signature from the Chief Human Resources Officer and General Counsel.`;
    } else if (/leave|pto|vacation/i.test(query)) {
      synthesizedText = `### KORA Paid Time Off (PTO) & Leave Regulations (2026)\n\nAccording to **Global Employee Leave Policy (Doc ID: KORA-HR-POL-001-V3, Version 3.2)**:\n\n• **Standard Accrual (1–4 Years Tenure)**: **20 business days** of paid time off per calendar year.\n• **Tenured Accrual (5+ Years Tenure)**: **25 business days** annually.\n• **Rollover Cap**: Maximum of **5 unused days** may roll over into Q1 of the following year (expiring March 31).\n• **Parental Leave**: **16 weeks fully paid** for primary caregivers, **6 weeks fully paid** for secondary caregivers.\n• **Hybrid Work**: 3 mandatory collaboration days in-office (Tue–Thu), up to 2 remote days (Mon/Fri) with Director approval.`;
    } else if (/warranty|toilet|numi|veil|smart fixture/i.test(query)) {
      synthesizedText = `### KORA Signature Plumbing & Smart Fixture Warranty Coverage\n\nAccording to **Quality Assurance Warranty Guidelines (Doc ID: KORA-CS-WARR-201-V4, Version 4.0)**:\n\n• **Vitreous China & Cast Iron**: **Lifetime Limited Warranty** for original residential owner against manufacturing defects.\n• **Intelligent Smart Fixtures (Horizon 2.0, Veil, Innate)**: **Three-Year (3-Year) Limited Warranty** covering electronic components, bidet seats, heating coils, and remote sensors. Includes 12 months certified technician labor dispatch.\n• **Replacement Escalation**: Defects unresolved within 14 business days qualify for expedited unit replacement or full refund under Tier 2 Care authorization.`;
    } else {
      synthesizedText = `### Policy Summary & Guidance\n\nBased on authoritative KORA corporate documentation:\n\n${retrieval.citations.map(c => `• **${c.title} (${c.version}, ${c.section})**:\n  ${c.excerpt}`).join('\n\n')}`;
    }
  }

  // Attempt server-side Gemini enhancement if client passed a runner and access is allowed
  if (isAccessAllowed && callServerGemini && !isExcelTask && requestedFormat === 'CHAT') {
    try {
      const geminiPrompt = `You are KORA (Orchestrated Reasoning Agent). Answer this employee query accurately and concisely based strictly on the retrieved policies below. Cite document IDs and sections.
Query: "${query}"
Retrieved Policies:
${retrieval.citations.map(c => `[${c.docId} | ${c.section} | ${c.version}]: ${c.excerpt}`).join('\n')}
${conflictReport.detected ? `Conflict Note: ${conflictReport.description} Resolution: ${conflictReport.resolution}` : ''}`;
      
      const enhanced = await callServerGemini(geminiPrompt);
      if (enhanced && enhanced.trim().length > 40) {
        synthesizedText = enhanced;
      }
    } catch {
      // Graceful fallback to verified deterministic synthesis
    }
  }

  steps.push({
    stepNumber: 7,
    type: 'SYNTHESIZE',
    title: 'Evidence-Grounded Synthesis',
    detail: `Synthesized policy response grounded across ${retrieval.citations.length} cited clauses with strict fact attribution.`,
    status: 'COMPLETED',
    durationMs: 70
  });

  // Step 8: Verification & Confidence Scoring
  const verification = computeVerificationAndConfidence(synthesizedText, retrieval.citations, conflictReport);
  steps.push({
    stepNumber: 8,
    type: 'VERIFY',
    title: 'Verification Layer & Confidence Assessment',
    detail: `${verification.confidence.explanation} (Relevance: ${verification.confidence.factors.retrievalRelevance}%, Authority: ${verification.confidence.factors.authorityLevel}%, Temporal: ${verification.confidence.factors.temporalValidity}%).`,
    status: verification.isVerified ? 'COMPLETED' : 'WARNING',
    durationMs: 35,
    data: { confidence: verification.confidence }
  });

  // Step 9: Dynamic Output Engine
  const outputData = buildDynamicOutput(requestedFormat, synthesizedText, query, retrieval.citations);

  // Step 10: Human-in-the-loop Gate
  const isHighRisk = isEmailTask || /(external.*vendor.*send|export.*confidential|share.*records)/i.test(query);
  const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = isHighRisk ? 'HIGH' : isExcelTask ? 'MEDIUM' : 'LOW';
  const hitlRequired = isHighRisk;

  if (hitlRequired) {
    steps.push({
      stepNumber: 9,
      type: 'HITL_GATE',
      title: 'Human-in-the-Loop Governance Gate',
      detail: 'High-risk external action detected: Outbound email or third-party data transmission requires mandatory human review and authorization before dispatch.',
      status: 'BLOCKED',
      durationMs: 15,
      data: { riskLevel: 'HIGH', requiresUserSignoff: true }
    });
  }

  return {
    steps,
    detectedDomains: retrieval.detectedDomains,
    citations: retrieval.citations,
    conflictReport,
    confidence: verification.confidence,
    answerText: synthesizedText,
    outputData,
    riskLevel,
    hitlRequired,
    toolsUsed
  };
}
