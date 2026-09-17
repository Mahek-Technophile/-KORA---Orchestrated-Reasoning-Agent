# KOHLER Enterprise Intelligence Agent
### Track 3: Unified Enterprise Conversational AI Agent Prototype
**KOHLER-MITWPU AI Research Lab Case Study**

---

## 1. Executive Summary & Architecture

The **KOHLER Enterprise Intelligence Agent** is an enterprise-grade AI copilot prototype designed to resolve complex cross-departmental policy inquiries across five organizational domains:
1. **HR Policies** (Paid time off, hybrid work guidelines, executive severance)
2. **Financial Guidelines** (Travel per diems, flight cabin class rules, discretionary hospitality budgets)
3. **Customer Support** (Smart toilet warranties, defective parts replacement workflows)
4. **Data Privacy** (Customer PII protection, IoT telemetry safeguards, DPIA mandates)
5. **Legal & Compliance** (Vendor master agreements, DPA requirements, whistleblower hotline)

### Core Architectural Pillars

```
+-----------------------------------------------------------------------------------+
|                           USER / BROWSER INTERACTION LAYER                        |
|   Role Selector (Lightning McQueen / Employee, Manager, HR, Finance, Legal, Admin) |
|   Query Bar + Format Selector (Standard Chat, Validated JSON, Excel .xlsx, Email) |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                           REACT AGENT ORCHESTRATION LOOP                          |
|  1. Format Detection (Intent parsing for JSON schema, Excel download, Email draft) |
|  2. Multi-Domain Taxonomy Routing (HR, Finance, Support, Privacy, Legal)          |
|  3. Pre-Retrieval Deterministic RBAC Gate (Drops restricted chunks before prompt) |
|  4. Hybrid Retrieval & Temporal Relevance Scoring (Token-overlap + date scoring)  |
|  5. Policy Conflict & Supersession Analysis (Active vs Superseded metadata graph) |
|  6. Tool Execution (Employee Directory Lookup, Expense Audit, SheetJS XLSX Export)|
|  7. Grounded Answer Synthesis (Grounded in verified section citations)            |
|  8. Observable Confidence Calculation (Relevance + Authority + Recency + Conflict)|
|  9. Human-in-the-Loop (HITL) Gate for High-Risk External Actions                  |
| 10. Audit Logging (In-memory structured telemetry of every query & decision)       |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        SYNTHETIC REPOSITORY & TOOL LAYER                          |
|  - Synthetic Kohler Policy Documents (5 domains, versioning, validity dates)       |
|  - Synthetic Employee Directory (Lightning McQueen, Sarah Jenkins, Elena Vance)   |
|  - In-Memory Regulatory Audit Log & Empirical Benchmark Runner (8 Scenarios)      |
+-----------------------------------------------------------------------------------+
```

---

## 2. Key Demo Scenarios (Scenarios 1 – 8)

The prototype includes an instant scenario launcher and a dedicated **Evaluation & KPIs** suite to test all case-study requirements with a single click:

| Scenario | Title | Active Role | Key Capabilities Demonstrated |
| :--- | :--- | :--- | :--- |
| **Demo 1** | Single-Domain Knowledge Grounding | `EMPLOYEE` | Grounded extraction of domestic travel per diem ($75/day cap, $25 receipt threshold, Section 3.2). |
| **Demo 2** | Cross-Department Governance Reasoning | `EMPLOYEE` | Multi-domain synthesis across Privacy (DPIA, encryption), Legal (DPA, SOC2 Type II), and Support (warranty scope) for external cloud vendor data sharing. |
| **Demo 3** | Deterministic RBAC Containment | `EMPLOYEE` vs `FINANCE` | When queried as `EMPLOYEE`, executive discretionary entertainment caps are dropped before retrieval with an Access Restricted notice. Switching role to `FINANCE` grants clearance. |
| **Demo 4** | Policy Conflict & Temporal Supersession | `EMPLOYEE` | Reconciles user query citing historical $50/day allowance by detecting that Policy v2.0 was superseded by active Policy v3.1 ($75/day, effective Jan 1, 2026). |
| **Demo 5** | Dynamic Validated JSON Generation | `EMPLOYEE` | Dynamically parses schema keys (`eligibility`, `per_diem_limits`, `cabin_class`, `approval_thresholds`) and outputs a validated JSON artifact. |
| **Demo 6** | Real Downloadable Excel (.xlsx) | `MANAGER` | Invokes employee directory lookup, cross-checks travel policies, flags over-cap expenditures, and generates a valid binary `.xlsx` spreadsheet using SheetJS. |
| **Demo 7** | Outbound Email Draft with Citations | `EMPLOYEE` | Drafts a formal flight cabin exception email to Corporate Procurement citing Section 4.1 (>8 hour flight to Tokyo). |
| **Demo 8** | Multi-Step Agentic Workflow & HITL | `LEGAL` | Multi-tool ReAct execution triggering a Human-in-the-Loop approval gate before dispatching high-risk external notices. |

---

## 3. Security & RBAC Clearance Matrix

The knowledge base implements a strict 6-tier Role-Based Access Control model evaluated **prior to LLM prompt assembly**:

| Role | Access Tier Description | Accessible Documents | Restricted Documents |
| :--- | :--- | :--- | :--- |
| **EMPLOYEE** | Standard Associate | Standard HR policies, general travel guidelines, customer warranty terms. | Executive severance, discretionary entertainment caps, legal whistleblower logs. |
| **MANAGER** | Department Manager | All employee-tier policies + team approval thresholds and department budgets. | Confidential executive compensation, CPO privacy assessments. |
| **HR** | HR Specialist | Full HR repository, confidential severance formulas, personnel relations. | Finance controller exception caps, legal attorney-client records. |
| **FINANCE** | Finance Auditor | Full travel and procurement policies, executive entertainment caps, treasury limits. | Confidential HR health records, privileged legal litigation files. |
| **LEGAL** | Legal & Compliance | DPA agreements, whistleblower hotlines, regulatory risk disclosures. | Unmasked employee compensation matrices. |
| **ADMIN** | Enterprise Superuser | Full access across all 5 departmental repositories. | None. |

---

## 4. Empirical Evaluation & KPI Scorecard

The prototype includes an automated benchmark runner that executes all 8 case study scenarios directly against live services and calculates actual measured telemetry:

### 1. Measured Metrics (Computed Live from Executed Scenarios)
* **Assertions Passed**: Measured live across all 8 test cases (RBAC containment, ground truth citations, conflict identification, format validity).
* **Average Retrieval & Synthesis Latency**: Measured live in milliseconds via `performance.now()`.
* **RBAC Containment**: Evaluates that 100% of restricted documents (e.g., Scenario 3) are filtered pre-retrieval.
* **Structured Output Validity**: 100% of requested JSON, Excel, and Email artifacts validate against structural schemas.

### 2. Estimated Metrics (Explicitly Labeled Prototype Estimates)
* **Operational Search Reduction**: ~1.8 hours per complex cross-departmental query.
  * *Disclaimer*: **Prototype estimate — not an empirical KOHLER measurement.** Based on manual workflow modeling comparing manual cross-referencing of 5 departmental repositories (HR, Finance, Privacy, Legal, Customer Support) against unified agent retrieval.

### 3. Unmeasured / Production-Only Metrics
* **Statistical Hallucination Rate at Enterprise Scale**: Labeled as **N/A — Not measured**. Production-scale hallucination rates require longitudinal human auditing across thousands of real production documents.
* **Enterprise Token Overhead**: Labeled as **N/A — Not measured**.

---

## 5. Technology Stack & Architectural Decisions

* **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React Icons, SheetJS (`xlsx`)
* **Backend**: Express (Node.js), Vite Development Middleware, `@google/genai` (Gemini model integration with deterministic fallback)
* **Storage & Telemetry**: In-memory compliance audit service, synthetic Kohler policy repository across 5 domains.
* **Architecture Style**: Client-side single-page copilot with server-side proxy capabilities, prioritizing working code, explainability, and technical defensibility.

---

## 6. Project Directory Structure

```
├── README.md                      # Primary project overview & architecture
├── docs/
│   ├── technical-report.md        # Comprehensive 10-section technical whitepaper
│   ├── user-guide.md              # Operator guide for testing the prototype
│   ├── prompts.md                 # System prompts, guardrails, and templates
│   ├── presentation.md            # 4-slide executive presentation script
│   ├── demo-script.md             # 2-minute live presentation walkthrough
│   └── submission-checklist.md    # Case study Track 3 requirement verification
├── src/
│   ├── components/                # Modular React views (Chat, Trace, Audit, Benchmark, KB)
│   ├── data/                      # Synthetic knowledge base, employee directory, benchmarks
│   ├── services/                  # Agent planner, RAG engine, conflict detector, formatters
│   └── types/                     # Enterprise TypeScript interfaces & enums
```

---

## 7. Synthetic Data Notice

> **Synthetic demonstration data prepared for KOHLER-MITWPU AI Research Lab Case Study. Not official KOHLER corporate documentation.** All policy numbers, dollar caps, approval thresholds, and employee names (e.g., Lightning McQueen) are fictional assets constructed specifically to demonstrate governance reasoning.
