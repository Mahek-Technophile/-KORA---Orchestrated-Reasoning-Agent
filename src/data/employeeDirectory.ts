import { UserProfile, UserRole } from '../types/enterprise';

export interface EmployeeExpenseRecord {
  employeeId: string;
  name: string;
  department: string;
  tripPurpose: string;
  travelDates: string;
  totalClaimedUSD: number;
  daysTraveled: number;
  dailyMealAverageUSD: number;
  concurStatus: 'SUBMITTED' | 'MANAGER_APPROVED' | 'AUDIT_PENDING' | 'REIMBURSED';
  complianceStatus: 'COMPLIANT' | 'OVER_CAP_FLAGGED' | 'MISSING_RECEIPTS';
  eligibleForReimbursement: boolean;
  notes: string;
}

export const CURRENT_USER: UserProfile = {
  id: "KOHLER-EMP-95095",
  name: "Lightning McQueen",
  role: "EMPLOYEE",
  department: "Product Design & Sustainable Engineering",
  email: "lightning.mcqueen@kohler.com"
};

export const AVAILABLE_ROLES: { role: UserRole; label: string; badge: string; description: string }[] = [
  { role: 'EMPLOYEE', label: 'Employee', badge: 'Standard Tier', description: 'Access to general company policies, standard benefits, and travel guidelines.' },
  { role: 'MANAGER', label: 'Team Manager', badge: 'Manager Tier', description: 'Department approvals, escalation matrices, and team budget guidelines.' },
  { role: 'HR', label: 'HR Specialist', badge: 'HR Restricted', description: 'Executive compensation, confidential severance formulas, employee relations.' },
  { role: 'FINANCE', label: 'Finance Auditor', badge: 'Finance Restricted', description: 'Corporate controller rules, executive hospitality caps, procurement exceptions.' },
  { role: 'LEGAL', label: 'Legal & Compliance', badge: 'Legal Restricted', description: 'Attorney-client privileged hotlines, regulatory risk disclosures, DPA standards.' },
  { role: 'ADMIN', label: 'Enterprise Admin', badge: 'Full Access', description: 'Superuser permission across all 5 departmental knowledge repositories.' },
];

export const SYNTHETIC_EMPLOYEE_DIRECTORY: EmployeeExpenseRecord[] = [
  {
    employeeId: "KOHLER-EMP-95095",
    name: "Lightning McQueen",
    department: "Product Design & Sustainable Engineering",
    tripPurpose: "Milan Design Week - Smart Sanitary Ware Showcase",
    travelDates: "2026-02-10 to 2026-02-14 (4 days)",
    totalClaimedUSD: 980.00,
    daysTraveled: 4,
    dailyMealAverageUSD: 68.50,
    concurStatus: "SUBMITTED",
    complianceStatus: "COMPLIANT",
    eligibleForReimbursement: true,
    notes: "Daily meal average ($68.50) is strictly within the $75 domestic / $110 international cap. Economy flight booked via Concur."
  },
  {
    employeeId: "KOHLER-EMP-10442",
    name: "Sarah Jenkins",
    department: "Global Customer Care",
    tripPurpose: "Regional Kohler Experience Center Quality Audit (Chicago)",
    travelDates: "2026-01-20 to 2026-01-23 (3 days)",
    totalClaimedUSD: 640.00,
    daysTraveled: 3,
    dailyMealAverageUSD: 71.00,
    concurStatus: "MANAGER_APPROVED",
    complianceStatus: "COMPLIANT",
    eligibleForReimbursement: true,
    notes: "Under $1,000 threshold, approved by Direct Manager. All receipts attached."
  },
  {
    employeeId: "KOHLER-EMP-33891",
    name: "Marcus Vance",
    department: "Corporate Procurement",
    tripPurpose: "Supplier Factory Inspection (Kohler, Wisconsin)",
    travelDates: "2026-02-01 to 2026-02-03 (2 days)",
    totalClaimedUSD: 420.00,
    daysTraveled: 2,
    dailyMealAverageUSD: 94.00,
    concurStatus: "AUDIT_PENDING",
    complianceStatus: "OVER_CAP_FLAGGED",
    eligibleForReimbursement: false,
    notes: "Daily meal average ($94.00) exceeds the domestic daily per diem limit of $75.00 specified in Policy v3.1. Requires itemized exception justification."
  },
  {
    employeeId: "KOHLER-EMP-77219",
    name: "Elena Rostova",
    department: "IoT Embedded Systems",
    tripPurpose: "CES 2026 Kohler Konnect Keynote Presentation",
    travelDates: "2026-01-08 to 2026-01-12 (4 days)",
    totalClaimedUSD: 1450.00,
    daysTraveled: 4,
    dailyMealAverageUSD: 72.00,
    concurStatus: "SUBMITTED",
    complianceStatus: "COMPLIANT",
    eligibleForReimbursement: true,
    notes: "Exceeds $1,000 threshold; automatically routed to Department Director for required sign-off under Section 7.3."
  },
  {
    employeeId: "KOHLER-EMP-51204",
    name: "David Chen",
    department: "Supply Chain & Logistics",
    tripPurpose: "Distribution Center Automation Review",
    travelDates: "2026-02-18 to 2026-02-19 (1 day)",
    totalClaimedUSD: 290.00,
    daysTraveled: 1,
    dailyMealAverageUSD: 45.00,
    concurStatus: "REIMBURSED",
    complianceStatus: "COMPLIANT",
    eligibleForReimbursement: true,
    notes: "Direct manager approved, fully reimbursed through Concur corporate ACH."
  }
];
