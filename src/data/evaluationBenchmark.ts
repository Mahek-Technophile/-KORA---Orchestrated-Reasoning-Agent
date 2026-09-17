import { BenchmarkCase, OutputFormatType, UserRole, PolicyDomain } from '../types/enterprise';

export interface BenchmarkCaseDefinition extends BenchmarkCase {
  expectedDomains: PolicyDomain[];
  expectedDocIds: string[];
  expectedConflict: boolean;
  expectedAccessAllowed: boolean;
  expectedFormat: OutputFormatType;
}

export const EVALUATION_BENCHMARK_CASES: BenchmarkCaseDefinition[] = [
  {
    id: "DEMO-1",
    title: "Scenario 1: Standard Single-Domain Knowledge Grounding",
    query: "What is the domestic travel meal reimbursement policy and daily allowance limit?",
    role: "EMPLOYEE",
    expectedDomains: ["FINANCE"],
    expectedDocIds: ["KOHLER-FIN-POL-101-V3"],
    expectedConflict: false,
    expectedAccessAllowed: true,
    expectedFormat: "CHAT",
    description: "Evaluates standard knowledge grounding, section citation, and quantitative clause extraction ($75/day cap)."
  },
  {
    id: "DEMO-2",
    title: "Scenario 2: Cross-Department Governance Reasoning",
    query: "What approvals and legal requirements are required before sharing customer warranty and IoT telemetry data with an external cloud vendor?",
    role: "EMPLOYEE",
    expectedDomains: ["PRIVACY", "LEGAL", "SUPPORT"],
    expectedDocIds: ["KOHLER-PRV-DATA-301-V3", "KOHLER-LEG-VEND-401-V3", "KOHLER-CS-WARR-201-V4"],
    expectedConflict: false,
    expectedAccessAllowed: true,
    expectedFormat: "CHAT",
    description: "Multi-domain synthesis across Privacy (DPIA, encryption), Legal (DPA, SOC2 Type II), and Support (warranty scope)."
  },
  {
    id: "DEMO-3",
    title: "Scenario 3: Deterministic Role-Based Access Control (RBAC)",
    query: "What are the discretionary executive entertainment budget caps and approval thresholds?",
    role: "EMPLOYEE",
    expectedDomains: ["FINANCE"],
    expectedDocIds: ["KOHLER-FIN-DISC-109-V1"],
    expectedConflict: false,
    expectedAccessAllowed: false, // Employee role is deterministically blocked from restricted finance documents
    expectedFormat: "CHAT",
    description: "Demonstrates pre-retrieval clearance filter dropping restricted executive records before LLM prompt assembly."
  },
  {
    id: "DEMO-4",
    title: "Scenario 4: Policy Conflict Detection & Temporal Supersession",
    query: "What is the meal per diem limit for domestic travel? I heard it was $50 per day.",
    role: "EMPLOYEE",
    expectedDomains: ["FINANCE"],
    expectedDocIds: ["KOHLER-FIN-POL-101-V3", "KOHLER-FIN-POL-101-V2"],
    expectedConflict: true,
    expectedAccessAllowed: true,
    expectedFormat: "CHAT",
    description: "Identifies tension between historical 2024 terms ($50/day) and active 2026 revision ($75/day), resolving in favor of active v3.1."
  },
  {
    id: "DEMO-5",
    title: "Scenario 5: Dynamic Schema-Validated JSON Generation",
    query: "Summarize the travel reimbursement policy as JSON with fields: eligibility, per_diem_limits, cabin_class, approval_thresholds, and exceptions.",
    role: "EMPLOYEE",
    expectedDomains: ["FINANCE"],
    expectedDocIds: ["KOHLER-FIN-POL-101-V3"],
    expectedConflict: false,
    expectedAccessAllowed: true,
    expectedFormat: "JSON",
    description: "Dynamic output engine parses requested schema, formats JSON, and validates structural integrity."
  },
  {
    id: "DEMO-6",
    title: "Scenario 6: Real Binary Excel (.xlsx) Generation",
    query: "Find employees eligible for travel reimbursement and create an Excel spreadsheet summary with compliance status.",
    role: "MANAGER",
    expectedDomains: ["FINANCE"],
    expectedDocIds: ["KOHLER-FIN-POL-101-V3"],
    expectedConflict: false,
    expectedAccessAllowed: true,
    expectedFormat: "EXCEL",
    description: "Invokes employee directory tool + expense audit calculator + real binary Excel (.xlsx) generator using SheetJS."
  },
  {
    id: "DEMO-7",
    title: "Scenario 7: Outbound Email Draft with Policy References",
    query: "Draft a formal email to Corporate Procurement asking for an exception to book Business Class for an urgent 10-hour flight to Tokyo.",
    role: "EMPLOYEE",
    expectedDomains: ["FINANCE"],
    expectedDocIds: ["KOHLER-FIN-POL-101-V3"],
    expectedConflict: false,
    expectedAccessAllowed: true,
    expectedFormat: "EMAIL",
    description: "Synthesizes formal email draft adhering to Section 4.1 flight criteria with Subject, CC, and Action Items."
  },
  {
    id: "DEMO-8",
    title: "Scenario 8: Multi-Step Agentic Workflow & Human-in-the-Loop",
    query: "Identify which policy governs external vendor audits, check if our IoT cloud vendor has signed a DPA, and prepare a compliance notice email requiring approval before sending.",
    role: "LEGAL",
    expectedDomains: ["PRIVACY", "LEGAL"],
    expectedDocIds: ["KOHLER-PRV-DATA-301-V3", "KOHLER-LEG-VEND-401-V3"],
    expectedConflict: false,
    expectedAccessAllowed: true,
    expectedFormat: "EMAIL",
    description: "Demonstrates ReAct planning: multi-step tools + verification + human-in-the-loop gate for high-risk external action."
  }
];

export interface MeasuredBenchmarkMetrics {
  totalScenariosExecuted: number;
  scenariosPassed: number;
  scenariosFailed: number;
  averageLatencyMs: number;
  rbacAssertionsPassed: number;
  rbacAssertionsTotal: number;
  groundednessPassed: number;
  groundednessTotal: number;
  conflictAssertionsPassed: number;
  conflictAssertionsTotal: number;
  structuredOutputValidCount: number;
  structuredOutputTotal: number;
}
