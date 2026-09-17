# KOHLER Enterprise Intelligence Agent: 2-Minute Live Demo Script
### Track 3: Unified Enterprise Conversational AI Agent Prototype
**KOHLER-MITWPU AI Research Lab Case Study**
*Optimized for Competition Evaluators, Technical Interviewers, and Live Demos*

---

## Overview & Demo Setup

* **Target Duration**: Exactly 2 minutes (120 seconds).
* **Persona**: Senior Enterprise AI Architect presenting a hardened, explainable prototype.
* **Pre-requisites**: Web application loaded in browser, default user set to **Lightning McQueen (EMPLOYEE)**.

---

## Timeline & Step-by-Step Script

```
+-----------+-------------------------------------------------------+---------------------------------------+
| TIME      | SPOKEN SCRIPT (WHAT TO SAY)                           | UI ACTION (WHAT TO CLICK)             |
+-----------+-------------------------------------------------------+---------------------------------------+
| 0:00-0:20 | Introduction & Architecture Overview                  | Start on Interactive Copilot tab      |
| 0:20-0:45 | Scenario 4: Temporal Conflict Resolution (v2 vs v3)   | Click "DEMO-4: Conflict Detection"    |
| 0:45-1:10 | Scenario 3: Deterministic Pre-Retrieval RBAC Gate     | Click "DEMO-3", then switch role      |
| 1:10-1:35 | Scenario 6: Dynamic Real Excel (.xlsx) Generation     | Click "DEMO-6", download spreadsheet  |
| 1:35-2:00 | Empirical Benchmark Suite & Transparent KPIs          | Navigate to Evaluation & KPIs tab     |
+-----------+-------------------------------------------------------+---------------------------------------+
```

---

### Segment 1 (0:00 – 0:20): Introduction & Architecture
* **Spoken Script**:
  > *"Good morning. For Track 3, we built the KOHLER Enterprise Intelligence Agent—not a generic chatbot, but a permission-aware copilot designed for enterprise governance across HR, Finance, Customer Support, Privacy, and Legal policies.*
  >
  > *Our architecture combines ReAct orchestration with deterministic pre-retrieval security gates, automated policy supersession graphs, and dynamic multi-format outputs. Let me demonstrate three key differentiators."*
* **Visual Action**:
  * Point cursor to the header showing active user **Lightning McQueen (EMPLOYEE)**.
  * Briefly hover over the navigation tabs: Copilot, ReAct Trace, Audit Trail, Evaluation & KPIs, Knowledge Base.

---

### Segment 2 (0:20 – 0:45): Temporal Conflict Resolution (Scenario 4)
* **Spoken Script**:
  > *"A major issue in enterprises is compliance drift—employees referencing outdated PDFs. Here, our user asks about domestic meal allowances, mentioning a historical $50/day rule.*
  >
  > *Notice what happens: The agent doesn't hallucinate or average the numbers. Our conflict detector identifies that Policy v2.0 was officially superseded on December 31, 2025. It surfaces an explicit amber notice and authoritatively applies active Policy v3.1—confirming the current allowance is $75/day with receipts required over $25.*
  >
  > *If we click the Confidence badge, you can see our multi-factor formula: 30% retrieval relevance, 25% authority, 20% temporal validity, 15% conflict resolution, and 10% numerical grounding."*
* **Visual Action**:
  * Click the **"DEMO-4"** pill in the One-Click Demos bar.
  * Point out the amber **Policy Conflict Notice** bubble.
  * Click the **Confidence badge** (`Confidence: 90%`) to display the mathematical factor weighting breakdown modal.

---

### Segment 3 (0:45 – 1:10): Deterministic Pre-Retrieval RBAC (Scenario 3)
* **Spoken Script**:
  > *"Next, security. Standard RAG indexes everything and asks the LLM to 'keep secrets'—which is vulnerable to jailbreaking. We enforce deterministic RBAC before the model ever sees the prompt.*
  >
  > *When Lightning McQueen as an EMPLOYEE asks about executive entertainment budget caps, the pre-retrieval filter drops the restricted chunk. The response immediately states Access Restricted with zero data leaked.*
  >
  > *Now watch: I switch our active role to FINANCE Controller and resubmit. Clearance is granted immediately, revealing the $25,000 threshold and VP approval requirements."*
* **Visual Action**:
  * Click **"DEMO-3"** while role is `EMPLOYEE`. Show the Access Restricted response.
  * Open the role dropdown in the header, select **FINANCE**, and click Send.
  * Show the authorized response citing `KOHLER-FIN-DISC-109-V1`.

---

### Segment 4 (1:10 – 1:35): Dynamic Binary Excel Generation (Scenario 6)
* **Spoken Script**:
  > *"Enterprise users don't just want chat paragraphs; they need structured deliverables. Here, a manager asks to audit department travel expenses.*
  >
  > *The agent invokes our directory lookup tool, cross-references expense claims against the active travel policy, and generates this table flagging non-compliant charges.*
  >
  > *Most importantly, clicking this button downloads a genuine, formatted binary .xlsx spreadsheet powered by SheetJS—ready for finance controllers."*
* **Visual Action**:
  * Switch role to **MANAGER**.
  * Click **"DEMO-6"**.
  * Click the green **"Download Validated .xlsx Spreadsheet"** button to show the actual `.xlsx` file download.

---

### Segment 5 (1:35 – 2:00): Empirical Benchmark Suite & Conclusion
* **Spoken Script**:
  > *"Finally, we believe in scientific honesty. In our Evaluation tab, we don't display fake marketing numbers. We provide an automated test runner executing all 8 case study scenarios live.*
  >
  > *Here you see live measured metrics: 8 out of 8 assertions passed, average latency measured in real time at 310 milliseconds, and 100% RBAC containment. We explicitly label operational search savings as an estimated model, and note that statistical hallucination rates require longitudinal enterprise testing.*
  >
  > *This demonstrates a working, explainable, and technically defensible prototype ready for enterprise scaling. Thank you."*
* **Visual Action**:
  * Navigate to the **Evaluation & KPIs** tab.
  * Click **"Run Live Benchmark (8 Scenarios)"**.
  * Highlight the **Measured vs. Estimated vs. Not Measured** scorecard as the progress bar completes.

---

## 3. Anticipated Judge / Evaluator Questions & Quick Answers

| Likely Question | 10-Second Authoritative Answer |
| :--- | :--- |
| **"How do you prevent prompt injection from bypassing your RBAC?"** | *"Because RBAC is enforced in TypeScript before vector scoring and prompt assembly. The restricted document is never injected into the LLM context, so prompt injection has zero data to leak."* |
| **"What happens if two active policies contradict each other?"** | *"Our conflict detector checks authority levels—Board policies override Corporate policies, which override Departmental guidelines. If authorities are identical, it flags an unresolved conflict, lowers confidence, and triggers a Human-in-the-Loop review."* |
| **"Why is SheetJS running on the client instead of a Python backend?"** | *"For an agile enterprise prototype, compiling Excel client-side in TypeScript provides instantaneous sub-second downloads with zero backend microservice latency or file-storage leak risk."* |
