# KOHLER Enterprise Intelligence Agent: User Guide
### Track 3: Unified Enterprise Conversational AI Agent Prototype
**KOHLER-MITWPU AI Research Lab Case Study**

---

## 1. Quick Start & Navigation

The **KOHLER Enterprise Intelligence Agent** web application is organized into five primary views accessible via the top navigation bar:

1. **Interactive Copilot** (`ChatView`): Primary conversational workspace for submitting policy inquiries, selecting dynamic output formats (Standard Chat, Validated JSON, Excel `.xlsx`, Email), and interacting with generated artifacts.
2. **ReAct Agent Trace** (`AgentTraceView`): Real-time inspection of the internal agent execution lifecycle (Understanding $\rightarrow$ Domain Routing $\rightarrow$ Security Filter $\rightarrow$ Retrieval $\rightarrow$ Tool Execution $\rightarrow$ Conflict Check $\rightarrow$ Synthesis $\rightarrow$ Verification $\rightarrow$ HITL Gate).
3. **Audit Trail** (`AuditLogView`): Searchable compliance log recording every query, user role, accessible document IDs, tool executions, and approval decisions.
4. **Evaluation & KPIs** (`BenchmarkView`): Automated evaluation suite to execute all 8 official case study scenarios and measure live performance.
5. **Knowledge Repository** (`KnowledgeBaseView`): Document repository browser spanning all five corporate policy domains with versioning, validity windows, and RBAC tags.

---

## 2. Managing User Identity & Roles

In the top-right header, you can switch the active user profile across six enterprise roles to evaluate Role-Based Access Control (RBAC):

* **Default User**: **Lightning McQueen**
* **Available Roles**:
  * `EMPLOYEE`: Standard Associate (Access restricted to general policies).
  * `MANAGER`: Department Manager (Access to team budgets and employee directories).
  * `HR`: Human Resources Specialist (Access to confidential compensation and personnel policies).
  * `FINANCE`: Finance Controller & Auditor (Access to executive hospitality caps and travel budgets).
  * `LEGAL`: Legal & Compliance Officer (Access to DPA vendor contracts and whistleblower hotlines).
  * `ADMIN`: Enterprise Superuser (Full clearance across all domains).

---

## 3. Running the 8 Case Study Scenarios

You can run any scenario in two ways:
1. Click any quick pill in the **Case Study One-Click Demos** bar at the top of the Copilot tab.
2. Go to the **Evaluation & KPIs** tab and click **"Launch in Copilot"** next to the desired scenario.

---

### Scenario 1: Single-Domain Knowledge Grounding
* **Prompt**: *"What is the domestic travel meal reimbursement policy and daily allowance limit?"*
* **Active Role**: `EMPLOYEE`
* **Format**: `Standard Answer`
* **What to Observe**:
  * Agent retrieves `KOHLER-FIN-POL-101-V3` (Section 3.2).
  * Cites exact policy constraints: **$75.00 daily allowance limit**, receipts required for expenses exceeding $25.00, and corporate card requirement.
  * Verified citation buttons appear beneath the response. Click any citation to open the source excerpt in the Evidence Drawer.

---

### Scenario 2: Cross-Department Governance Reasoning
* **Prompt**: *"What approvals and legal requirements are required before sharing customer warranty and IoT telemetry data with an external cloud vendor?"*
* **Active Role**: `EMPLOYEE`
* **Format**: `Standard Answer`
* **What to Observe**:
  * Agent identifies a multi-domain inquiry and routes to **Privacy**, **Legal**, and **Customer Support**.
  * Synthesizes requirements across three distinct documents:
    1. **Data Privacy** (`KOHLER-PRV-DATA-301-V3`): Mandatory Data Protection Impact Assessment (DPIA) and AES-256 encryption.
    2. **Legal Compliance** (`KOHLER-LEG-VEND-401-V3`): Executed Data Processing Agreement (DPA) and SOC2 Type II certification.
    3. **Warranty Scope** (`KOHLER-CS-WARR-201-V4`): Customer telemetry governance.

---

### Scenario 3: Deterministic Role-Based Access Control (RBAC)
* **Prompt**: *"What are the discretionary executive entertainment budget caps and approval thresholds?"*
* **Part A (Employee Role)**:
  * Select `EMPLOYEE` from the role dropdown and submit the prompt.
  * **Result**: Pre-retrieval clearance gate drops `KOHLER-FIN-DISC-109-V1`. The agent responds with a formal **Access Restricted** notice and surfaces zero confidential figures.
* **Part B (Finance Role)**:
  * Switch active role to `FINANCE` and re-submit the identical prompt.
  * **Result**: Security gate grants access. The agent reveals the **$25,000 per event limit**, VP/CFO dual-approval thresholds, and alcohol expense restrictions.

---

### Scenario 4: Policy Conflict Detection & Temporal Supersession
* **Prompt**: *"What is the meal per diem limit for domestic travel? I heard it was $50 per day."*
* **Active Role**: `EMPLOYEE`
* **Format**: `Standard Answer`
* **What to Observe**:
  * The agent retrieves both active Policy v3.1 and retired Policy v2.0.
  * Surfaces an **Amber Policy Conflict Notice**:
    * Identifies that the $50/day figure belongs to superseded Policy v2.0 (retired Dec 31, 2025).
    * Authoritatively applies active Policy v3.1: **$75/day**, effective Jan 1, 2026.

---

### Scenario 5: Dynamic Schema-Validated JSON Generation
* **Prompt**: *"Summarize the travel reimbursement policy as JSON with fields: eligibility, per_diem_limits, cabin_class, approval_thresholds, and exceptions."*
* **Active Role**: `EMPLOYEE`
* **Format**: `JSON`
* **What to Observe**:
  * Dynamic output engine parses user-requested schema keys.
  * Renders a validated, syntax-highlighted JSON object with an instant "Copy" button.

---

### Scenario 6: Real Binary Excel (.xlsx) Generation
* **Prompt**: *"Find employees eligible for travel reimbursement and create an Excel spreadsheet summary with compliance status."*
* **Active Role**: `MANAGER`
* **Format**: `Excel (.xlsx)`
* **What to Observe**:
  * The agent invokes the `employee_directory_lookup` and `excel_binary_builder` tools.
  * Displays an interactive preview table with employee names, departments, pending expenses, and compliance flags.
  * Renders a green **"Download Validated .xlsx Spreadsheet"** button that downloads a genuine binary Excel workbook created via SheetJS.

---

### Scenario 7: Outbound Email Draft with Policy References
* **Prompt**: *"Draft a formal email to Corporate Procurement asking for an exception to book Business Class for an urgent 10-hour flight to Tokyo."*
* **Active Role**: `EMPLOYEE`
* **Format**: `Email Draft`
* **What to Observe**:
  * The agent references Section 4.1 of the travel policy (>8 hour international flight criteria).
  * Renders a formal email artifact complete with:
    * `To:` corporate.travel@kohler.com
    * `Subject:` Travel Policy Exception Request - Business Class Long-Haul (>8 Hours)
    * Structured rationale and governance citations.

---

### Scenario 8: Multi-Step Agentic Workflow & Human-in-the-Loop (HITL)
* **Prompt**: *"Identify which policy governs external vendor audits, check if our IoT cloud vendor has signed a DPA, and prepare a compliance notice email requiring approval before sending."*
* **Active Role**: `LEGAL`
* **Format**: `Email Draft`
* **What to Observe**:
  * Agent initiates a multi-step ReAct execution plan.
  * Because outbound legal notifications represent high enterprise liability, execution pauses and triggers a **Human-in-the-Loop Modal**.
  * The operator can inspect the draft notice, review risk parameters, and click **"Approve & Execute Action"** or **"Reject Action"**.

---

## 4. Inspecting Confidence & Verification

Whenever the agent answers an inquiry:
1. A **Confidence Badge** appears in the top-right of the citation bar (e.g., `Confidence: 91% (HIGH)`).
2. Click the badge to open the **Mathematical Factor Weighting Modal**:
   * **Retrieval Relevance (30%)**: Quality of semantic match.
   * **Authority Level (25%)**: Document authority tier (Board, Corporate, Departmental).
   * **Temporal Validity (20%)**: Active vs. superseded status.
   * **Conflict Freedom (15%)**: Absence of unresolved version disputes.
   * **Numerical Claim Grounding (10%)**: Verification pass rate of extracted numbers.

---

## 5. Running the Empirical Benchmark Suite

1. Navigate to the **Evaluation & KPIs** tab.
2. Click **"Run Live Benchmark (8 Scenarios)"**.
3. Watch the progress bar execute each test case sequentially against live services.
4. The dashboard updates in real time to display:
   * **Measured Assertions Passed**: e.g., `8 / 8 (100%)`.
   * **Measured Average Latency**: Live millisecond duration measured via `performance.now()`.
   * **Measured RBAC Containment**: 100% of restricted documents dropped.
   * **Measured Output Validity**: 100% of JSON, Excel, and Email artifacts valid.
   * **Prototype Estimate**: Operational search savings (~1.8 hrs/query) clearly badged as an estimate.
   * **Not Measured**: Population-level hallucination rate clearly badged as `N/A — Not Measured`.
