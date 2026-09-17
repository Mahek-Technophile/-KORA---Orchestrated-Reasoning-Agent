import { PolicyDocument, PolicyDomain, AccessLevel, UserRole } from '../types/enterprise';

export const SYNTHETIC_DISCLAIMER = "Synthetic demonstration data prepared for KOHLER-MITWPU AI Research Lab Case Study. Not official KOHLER corporate documentation.";

export const KOHLER_POLICIES: PolicyDocument[] = [
  // ==========================================
  // HR POLICIES
  // ==========================================
  {
    id: "KOHLER-HR-POL-001-V3",
    domain: "HR",
    department: "Global Human Resources",
    title: "Global Employee Leave & Remote Work Policy (2026 Revision)",
    version: "v3.2",
    effectiveDate: "2026-01-01",
    expiryDate: null,
    supersedesId: "KOHLER-HR-POL-001-V2",
    authorityLevel: "VP_LEVEL",
    accessLevel: "EMPLOYEE",
    status: "ACTIVE",
    summary: "Governs annual paid time off (PTO), hybrid workplace arrangements, parental leave, and bereavement guidelines for full-time regular associates worldwide.",
    chunks: [
      {
        chunkId: "HR-001-C1",
        documentId: "KOHLER-HR-POL-001-V3",
        section: "Section 2.1: Paid Time Off (PTO) Entitlement",
        content: "Effective January 1, 2026, all regular full-time associates accrue 20 business days of paid time off per calendar year during their first four years of continuous service. Associates with 5+ years of tenure accrue 25 business days annually. Unused PTO may be rolled over up to a maximum cap of 5 days into Q1 of the following year, expiring March 31.",
        keywords: ["pto", "leave", "vacation", "accrual", "carryover", "days off", "holidays"],
        accessLevel: "EMPLOYEE",
        effectiveDate: "2026-01-01",
        version: "v3.2"
      },
      {
        chunkId: "HR-001-C2",
        documentId: "KOHLER-HR-POL-001-V3",
        section: "Section 3.4: Hybrid & Remote Work Eligibility",
        content: "Associates in designated corporate and design roles may adopt a hybrid schedule consisting of 3 mandatory in-office core collaboration days (Tuesday through Thursday) and up to 2 flexible remote work days (Monday and Friday), subject to formal department director approval. Full remote status requires People & Culture VP clearance.",
        keywords: ["remote work", "hybrid", "wfh", "work from home", "core hours", "schedule"],
        accessLevel: "EMPLOYEE",
        effectiveDate: "2026-01-01",
        version: "v3.2"
      },
      {
        chunkId: "HR-001-C3",
        documentId: "KOHLER-HR-POL-001-V3",
        section: "Section 5.1: Parental & Family Care Leave",
        content: "Kohler Co. provides 16 weeks of fully paid parental leave for primary caregivers following birth, adoption, or foster placement, and 6 weeks of fully paid leave for secondary caregivers. Must be taken within the first 12 months following the qualifying event.",
        keywords: ["parental leave", "maternity", "paternity", "adoption", "family care"],
        accessLevel: "EMPLOYEE",
        effectiveDate: "2026-01-01",
        version: "v3.2"
      }
    ]
  },
  {
    id: "KOHLER-HR-POL-001-V2",
    domain: "HR",
    department: "Global Human Resources",
    title: "Global Employee Leave Policy (2024 Historical)",
    version: "v2.0",
    effectiveDate: "2024-01-01",
    expiryDate: "2025-12-31",
    supersededById: "KOHLER-HR-POL-001-V3",
    authorityLevel: "DIRECTOR",
    accessLevel: "EMPLOYEE",
    status: "SUPERSEDED",
    summary: "Superseded 2024 leave policy. Preserved for audit and retrospective query purposes.",
    chunks: [
      {
        chunkId: "HR-001-OLD-C1",
        documentId: "KOHLER-HR-POL-001-V2",
        section: "Section 2.1: Paid Time Off (PTO) Entitlement (Superseded)",
        content: "Under the 2024 framework, associates in their first 4 years accrued 15 business days of paid time off per calendar year. Hybrid work allowed only 1 remote day per week.",
        keywords: ["pto", "leave", "vacation", "historical", "2024"],
        accessLevel: "EMPLOYEE",
        effectiveDate: "2024-01-01",
        version: "v2.0"
      }
    ]
  },
  {
    id: "KOHLER-HR-EXEC-009-V2",
    domain: "HR",
    department: "Executive Compensation & People Operations",
    title: "Executive Severance, Retention & Transition Protocols",
    version: "v2.1",
    effectiveDate: "2025-06-01",
    expiryDate: null,
    authorityLevel: "BOARD",
    accessLevel: "HR_ONLY",
    status: "ACTIVE",
    summary: "Confidential guidance governing VP and Senior Director severance formulas, change-of-control vesting acceleration, and non-compete stipulations.",
    chunks: [
      {
        chunkId: "HR-009-C1",
        documentId: "KOHLER-HR-EXEC-009-V2",
        section: "Section 4.1: Executive Severance Multipliers",
        content: "Executive Band 1 (VP and above) departures not for cause are eligible for 18 months base salary continuation plus prorated annual bonus, alongside 12 months executive outplacement services. Subject to bilateral non-disclosure and 24-month non-solicitation agreement. Requires Chief Human Resources Officer and General Counsel co-sign.",
        keywords: ["severance", "executive compensation", "vp transition", "retention", "separation", "confidential"],
        accessLevel: "HR_ONLY",
        effectiveDate: "2025-06-01",
        version: "v2.1"
      }
    ]
  },

  // ==========================================
  // FINANCE POLICIES
  // ==========================================
  {
    id: "KOHLER-FIN-POL-101-V3",
    domain: "FINANCE",
    department: "Corporate Controller & Travel Operations",
    title: "Global Business Travel, Lodging & Expense Reimbursement Policy (2026)",
    version: "v3.1",
    effectiveDate: "2026-01-01",
    expiryDate: null,
    supersedesId: "KOHLER-FIN-POL-101-V2",
    authorityLevel: "VP_LEVEL",
    accessLevel: "EMPLOYEE",
    status: "ACTIVE",
    summary: "Mandates allowable travel expenses, per diem meals, airline cabin classes, hotel caps, and approval workflows across all Kohler operating units.",
    chunks: [
      {
        chunkId: "FIN-101-C1",
        documentId: "KOHLER-FIN-POL-101-V3",
        section: "Section 3.2: Per Diem Meals & Incidentals Cap",
        content: "Under the 2026 Travel Policy, the domestic daily meal allowance (per diem) is capped at $75.00 USD per day ($15 breakfast, $20 lunch, $40 dinner). For international travel, the daily per diem cap is $110.00 USD. Receipts are strictly mandatory for any single meal expense exceeding $25.00 USD. Alcohol is non-reimbursable unless part of an authorized client entertainment dinner with pre-approval.",
        keywords: ["travel", "meal", "per diem", "reimbursement", "food", "daily allowance", "dinner", "domestic travel"],
        accessLevel: "EMPLOYEE",
        effectiveDate: "2026-01-01",
        version: "v3.1"
      },
      {
        chunkId: "FIN-101-C2",
        documentId: "KOHLER-FIN-POL-101-V3",
        section: "Section 4.1: Airfare & Cabin Class Restrictions",
        content: "Economy/Coach class is mandatory for all domestic flights and international flights under 8 continuous flight hours. Business Class travel is permitted only for nonstop international flights exceeding 8 continuous hours, with prior written authorization from the Division Vice President. First Class travel is strictly prohibited across all levels.",
        keywords: ["airfare", "flights", "business class", "economy", "airline", "international flight"],
        accessLevel: "EMPLOYEE",
        effectiveDate: "2026-01-01",
        version: "v3.1"
      },
      {
        chunkId: "FIN-101-C3",
        documentId: "KOHLER-FIN-POL-101-V3",
        section: "Section 7.3: Expense Submission Deadlines & Approval Matrix",
        content: "All expense reports must be submitted via the Concur portal within 30 days of trip conclusion. Expense totals under $1,000 require Direct Manager approval. Expenses between $1,000 and $5,000 require Department Director signoff. Expenses exceeding $5,000 require Division VP and Finance Controller dual approval.",
        keywords: ["expense approval", "concur", "manager approval", "thresholds", "deadline", "receipts", "signoff"],
        accessLevel: "EMPLOYEE",
        effectiveDate: "2026-01-01",
        version: "v3.1"
      }
    ]
  },
  {
    id: "KOHLER-FIN-POL-101-V2",
    domain: "FINANCE",
    department: "Corporate Controller",
    title: "Global Business Travel Policy (2024 Edition)",
    version: "v2.0",
    effectiveDate: "2024-01-01",
    expiryDate: "2025-12-31",
    supersededById: "KOHLER-FIN-POL-101-V3",
    authorityLevel: "DIRECTOR",
    accessLevel: "EMPLOYEE",
    status: "SUPERSEDED",
    summary: "Superseded 2024 travel policy with lower per diem limits. Retained for historical audit and conflict detection demonstration.",
    chunks: [
      {
        chunkId: "FIN-101-OLD-C1",
        documentId: "KOHLER-FIN-POL-101-V2",
        section: "Section 3.2: Per Diem Meals (Superseded)",
        content: "Historical 2024 rule: The domestic daily meal allowance was capped at $50.00 USD per day ($10 breakfast, $15 lunch, $25 dinner). This document has been superseded by v3.1 effective January 1, 2026.",
        keywords: ["travel", "meal", "per diem", "50", "historical", "reimbursement", "conflict"],
        accessLevel: "EMPLOYEE",
        effectiveDate: "2024-01-01",
        version: "v2.0"
      }
    ]
  },
  {
    id: "KOHLER-FIN-DISC-109-V1",
    domain: "FINANCE",
    department: "Corporate Treasury & Executive Audit",
    title: "Director & Executive Discretionary Entertainment Guidelines",
    version: "v1.1",
    effectiveDate: "2025-03-01",
    expiryDate: null,
    authorityLevel: "VP_LEVEL",
    accessLevel: "FINANCE_ONLY",
    status: "ACTIVE",
    summary: "Confidential corporate entertainment, premier hospitality suites, and executive customer dining allowances.",
    chunks: [
      {
        chunkId: "FIN-109-C1",
        documentId: "KOHLER-FIN-DISC-109-V1",
        section: "Section 2.3: Executive Entertainment & Hospitality Caps",
        content: "Managing Directors and Vice Presidents maintain an annual discretionary client entertainment allocation up to $25,000 USD per fiscal year. Single hospitality events exceeding $2,500 USD require Chief Financial Officer pre-authorization and itemized attendee corporate identification. Restricted strictly to Finance Auditors, Controllers, and Executive Leadership.",
        keywords: ["discretionary", "entertainment", "executive dinner", "client dining", "hospitality", "cfo approval", "confidential"],
        accessLevel: "FINANCE_ONLY",
        effectiveDate: "2025-03-01",
        version: "v1.1"
      }
    ]
  },

  // ==========================================
  // CUSTOMER SUPPORT GUIDELINES
  // ==========================================
  {
    id: "KOHLER-CS-WARR-201-V4",
    domain: "SUPPORT",
    department: "Global Customer Experience & Quality Assurance",
    title: "KOHLER Signature Plumbing & Smart Fixture Warranty Guidelines",
    version: "v4.0",
    effectiveDate: "2025-09-01",
    expiryDate: null,
    authorityLevel: "DIRECTOR",
    accessLevel: "PUBLIC",
    status: "ACTIVE",
    summary: "Outlines warranty coverage tiers for vitreous china, cast iron enameled baths, faucets, and intelligent smart toilets (Numi 2.0, Veil, Innate).",
    chunks: [
      {
        chunkId: "CS-201-C1",
        documentId: "KOHLER-CS-WARR-201-V4",
        section: "Section 1.2: Residential Plumbing Fixtures Warranty",
        content: "Kohler Co. warrants vitreous china fixtures (toilets, lavatories) and cast iron enameled bathtubs to be free of manufacturing defects for the lifetime of original residential ownership. Chrome and PVD finish coatings carry a Lifetime Limited Warranty against corrosion and tarnishing under normal residential use.",
        keywords: ["warranty", "toilets", "sink", "faucet", "vitreous china", "cast iron", "residential", "lifetime warranty"],
        accessLevel: "PUBLIC",
        effectiveDate: "2025-09-01",
        version: "v4.0"
      },
      {
        chunkId: "CS-201-C2",
        documentId: "KOHLER-CS-WARR-201-V4",
        section: "Section 2.4: Intelligent Toilets & Electronic Components (Numi, Veil)",
        content: "Electronic components, bidet seats, heating elements, sensors, and remote controls for Kohler Intelligent Toilets (including Numi 2.0, Veil, and Innate) are covered under a Three-Year (3-Year) Limited Warranty from original date of installation. Labor coverage for certified technician dispatch is included for the first 12 months. Commercial installations are limited to a One-Year warranty.",
        keywords: ["intelligent toilet", "numi", "veil", "bidet", "smart toilet", "electronics warranty", "3 year", "repair"],
        accessLevel: "PUBLIC",
        effectiveDate: "2025-09-01",
        version: "v4.0"
      },
      {
        chunkId: "CS-201-C3",
        documentId: "KOHLER-CS-WARR-201-V4",
        section: "Section 4.1: Customer Defect Escalation & Replacement Tiers",
        content: "If a certified product defect cannot be resolved through replacement parts within 14 business days, Tier 2 customer care specialists are authorized to issue an expedited complete unit exchange or full refund for purchases within 60 days of installation, subject to photo verification and serial barcode registry.",
        keywords: ["escalation", "replacement", "refund", "customer care", "tier 2", "defect", "exchange"],
        accessLevel: "PUBLIC",
        effectiveDate: "2025-09-01",
        version: "v4.0"
      }
    ]
  },

  // ==========================================
  // PRIVACY POLICIES
  // ==========================================
  {
    id: "KOHLER-PRV-DATA-301-V3",
    domain: "PRIVACY",
    department: "Data Privacy & Information Security Office",
    title: "Global Customer & Smart Home IoT Data Handling Policy",
    version: "v3.0",
    effectiveDate: "2026-01-01",
    expiryDate: null,
    authorityLevel: "VP_LEVEL",
    accessLevel: "EMPLOYEE",
    status: "ACTIVE",
    summary: "Governs telemetry, user voice recordings, mobile app diagnostics, and personally identifiable information (PII) collected via Kohler Konnect and smart home devices.",
    chunks: [
      {
        chunkId: "PRV-301-C1",
        documentId: "KOHLER-PRV-DATA-301-V3",
        section: "Section 3.1: Customer PII Classification & Data Minimization",
        content: "Customer Personally Identifiable Information (PII) collected through Kohler Konnect applications, warranty registrations, or support tickets is classified as 'Restricted Enterprise Data'. Telemetry and voice interaction logs from Kohler Konnect smart fixtures must be pseudononymized at edge ingest and purged within 90 days unless explicit customer opt-in is registered.",
        keywords: ["privacy", "pii", "smart home", "telemetry", "iot", "kohler konnect", "data classification", "voice logs"],
        accessLevel: "EMPLOYEE",
        effectiveDate: "2026-01-01",
        version: "v3.0"
      },
      {
        chunkId: "PRV-301-C2",
        documentId: "KOHLER-PRV-DATA-301-V3",
        section: "Section 4.3: Third-Party Vendor Data Sharing Restrictions",
        content: "Customer PII or usage telemetry may NEVER be transferred, shared, or integrated with external third-party software vendors without: (1) a signed Data Protection Agreement (DPA) incorporating standard contractual clauses, (2) formal Data Privacy Impact Assessment (DPIA) approved by the Chief Privacy Officer, and (3) mandatory AES-256 encryption in transit and at rest. Direct export of unmasked customer lists to third-party marketing vendors is strictly forbidden.",
        keywords: ["vendor sharing", "third party", "dpa", "data protection agreement", "cpo approval", "encryption", "customer data sharing"],
        accessLevel: "EMPLOYEE",
        effectiveDate: "2026-01-01",
        version: "v3.0"
      }
    ]
  },

  // ==========================================
  // LEGAL & COMPLIANCE
  // ==========================================
  {
    id: "KOHLER-LEG-VEND-401-V3",
    domain: "LEGAL",
    department: "Legal Affairs & Regulatory Compliance",
    title: "Third-Party Cloud Vendor Due Diligence & Approval Protocol",
    version: "v3.0",
    effectiveDate: "2025-10-01",
    expiryDate: null,
    authorityLevel: "VP_LEVEL",
    accessLevel: "EMPLOYEE",
    status: "ACTIVE",
    summary: "Outlines mandatory governance, legal sign-offs, cyber insurance, and audit certifications required before engaging external IT, SaaS, or data processing partners.",
    chunks: [
      {
        chunkId: "LEG-401-C1",
        documentId: "KOHLER-LEG-VEND-401-V3",
        section: "Section 2.2: Cross-Departmental Approvals for Vendor Engagements",
        content: "Prior to transmitting ANY internal employee data, financial records, or customer records to an external cloud or SaaS vendor, the initiating department must secure four mandatory sign-offs: (1) Information Security Security Clearance (SOC2 Type II or ISO 27001 audit verification), (2) Chief Privacy Officer DPIA approval, (3) Procurement Master Service Agreement (MSA) sign-off, and (4) Legal Counsel Data Processing Addendum (DPA) execution. Contracts exceeding $100,000 USD also require Corporate Controller approval.",
        keywords: ["vendor approvals", "sharing data", "external vendor", "cloud vendor", "legal signoff", "compliance", "dpa", "procurement"],
        accessLevel: "EMPLOYEE",
        effectiveDate: "2025-10-01",
        version: "v3.0"
      },
      {
        chunkId: "LEG-401-C2",
        documentId: "KOHLER-LEG-VEND-401-V3",
        section: "Section 5.4: Regulatory Breach Notification Protocols",
        content: "In the event of suspected or verified unauthorized exposure of restricted Kohler data hosted by an external vendor, the vendor is contractually mandated to notify Kohler Legal Incident Response within 24 hours of discovery. Legal counsel manages required regulatory notifications to federal and international authorities (e.g., GDPR 72-hour regulatory disclosure deadline).",
        keywords: ["breach", "incident response", "gdpr", "notification", "legal", "security incident", "24 hours"],
        accessLevel: "EMPLOYEE",
        effectiveDate: "2025-10-01",
        version: "v3.0"
      }
    ]
  },
  {
    id: "KOHLER-LEG-COMP-409-V1",
    domain: "LEGAL",
    department: "Legal Affairs & Ethics Office",
    title: "Whistleblower Protection & Anti-Retaliation Charter",
    version: "v1.2",
    effectiveDate: "2025-01-01",
    expiryDate: null,
    authorityLevel: "BOARD",
    accessLevel: "LEGAL_ONLY",
    status: "ACTIVE",
    summary: "Confidential investigative protocols for anonymous ethics helpline disclosures and attorney-client privileged reports.",
    chunks: [
      {
        chunkId: "LEG-409-C1",
        documentId: "KOHLER-LEG-COMP-409-V1",
        section: "Section 3.1: Privilege & Investigation Escalation",
        content: "All complaints submitted via the Kohler Integrity Hotline alleging executive financial misconduct, regulatory non-compliance, or antitrust violations are routed directly to the Chief Legal Officer and the Audit Committee of the Board of Directors under attorney-client privilege. Retaliation of any form results in immediate termination of employment.",
        keywords: ["whistleblower", "ethics", "investigation", "attorney-client", "confidential", "compliance hotline"],
        accessLevel: "LEGAL_ONLY",
        effectiveDate: "2025-01-01",
        version: "v1.2"
      }
    ]
  }
];

// Permission resolution helper
export function isRoleAuthorizedForChunk(userRole: UserRole, accessLevel: AccessLevel): boolean {
  if (userRole === 'ADMIN') return true;
  if (accessLevel === 'PUBLIC') return true;
  if (accessLevel === 'EMPLOYEE') return true; // All internal roles can view employee level

  if (accessLevel === 'MANAGER') {
    return userRole === 'MANAGER' || userRole === 'HR' || userRole === 'FINANCE' || userRole === 'LEGAL';
  }

  if (accessLevel === 'HR_ONLY') {
    return userRole === 'HR';
  }

  if (accessLevel === 'FINANCE_ONLY') {
    return userRole === 'FINANCE';
  }

  if (accessLevel === 'LEGAL_ONLY') {
    return userRole === 'LEGAL';
  }

  return false;
}
