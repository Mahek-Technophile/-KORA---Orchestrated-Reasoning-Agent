import * as XLSX from 'xlsx';
import { FormattedOutputData, OutputFormatType, EmailDraft, Citation } from '../types/enterprise';
import { SYNTHETIC_EMPLOYEE_DIRECTORY } from '../data/employeeDirectory';

export function detectRequestedFormat(query: string, overrideFormat?: OutputFormatType): OutputFormatType {
  if (overrideFormat && overrideFormat !== 'CHAT') return overrideFormat;

  const q = query.toLowerCase();
  if (/\b(json|as json|in json|json format)\b/i.test(q)) return 'JSON';
  if (/\b(xml|as xml|in xml|xml format)\b/i.test(q)) return 'XML';
  if (/\b(excel|spreadsheet|\.xlsx|sheet)\b/i.test(q)) return 'EXCEL';
  if (/\b(csv|comma separated)\b/i.test(q)) return 'CSV';
  if (/\b(email|draft an email|draft email|write an email|send email)\b/i.test(q)) return 'EMAIL';

  return 'CHAT';
}

export function buildDynamicOutput(
  format: OutputFormatType,
  answerText: string,
  query: string,
  citations: Citation[]
): FormattedOutputData {
  switch (format) {
    case 'JSON': {
      const jsonPayload = {
        metadata: {
          generator: "KOHLER Enterprise Intelligence Agent",
          timestamp: new Date().toISOString(),
          query: query,
          status: "SUCCESS"
        },
        policy_summary: {
          governing_document: citations[0]?.title || "Kohler Travel & Business Expense Policy",
          document_id: citations[0]?.docId || "KOHLER-FIN-POL-101-V3",
          version: citations[0]?.version || "v3.1",
          effective_date: citations[0]?.effectiveDate || "2026-01-01",
          authority: citations[0]?.authority || "VP_LEVEL"
        },
        regulations: {
          eligibility: "All active regular full-time Kohler associates traveling on authorized company business.",
          per_diem_limits: {
            domestic_daily_cap_usd: 75.00,
            breakdown: { breakfast_usd: 15.00, lunch_usd: 20.00, dinner_usd: 40.00 },
            international_daily_cap_usd: 110.00,
            receipt_required_threshold_usd: 25.00
          },
          flight_restrictions: {
            cabin_class_domestic: "Economy / Coach Mandatory",
            cabin_class_international_under_8h: "Economy Mandatory",
            cabin_class_international_over_8h: "Business Class Allowed with Division VP Approval",
            first_class: "Strictly Prohibited"
          },
          approval_hierarchy: [
            { range: "< $1,000 USD", approver: "Direct Manager" },
            { range: "$1,000 - $5,000 USD", approver: "Department Director" },
            { range: "> $5,000 USD", approver: "Division VP and Corporate Controller" }
          ],
          exceptions: "Alcohol non-reimbursable unless client hospitality authorized in advance by Controller."
        },
        citations: citations.map(c => ({
          doc_id: c.docId,
          section: c.section,
          version: c.version,
          status: c.status
        }))
      };

      return {
        format: 'JSON',
        rawText: JSON.stringify(jsonPayload, null, 2),
        jsonPayload
      };
    }

    case 'XML': {
      const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
<kohler_enterprise_intelligence version="1.0">
  <metadata>
    <agent>KOHLER Enterprise Intelligence Agent</agent>
    <timestamp>${new Date().toISOString()}</timestamp>
    <status>VERIFIED</status>
  </metadata>
  <policy_summary>
    <governing_policy id="${citations[0]?.docId || 'KOHLER-FIN-POL-101-V3'}" version="${citations[0]?.version || 'v3.1'}">
      ${citations[0]?.title || 'Global Business Travel & Expense Policy'}
    </governing_policy>
    <effective_date>${citations[0]?.effectiveDate || '2026-01-01'}</effective_date>
    <per_diem_allowances currency="USD">
      <domestic_daily_cap>75.00</domestic_daily_cap>
      <international_daily_cap>110.00</international_daily_cap>
      <receipt_threshold>25.00</receipt_threshold>
    </per_diem_allowances>
    <approval_thresholds>
      <tier limit="1000">Direct Manager</tier>
      <tier limit="5000">Department Director</tier>
      <tier limit="above_5000">Division VP and Finance Controller</tier>
    </approval_thresholds>
  </policy_summary>
  <supporting_citations count="${citations.length}">
    ${citations.map(c => `<citation doc_id="${c.docId}" section="${c.section}" version="${c.version}"/>`).join('\n    ')}
  </supporting_citations>
</kohler_enterprise_intelligence>`;

      return {
        format: 'XML',
        rawText: xmlPayload,
        xmlPayload
      };
    }

    case 'EXCEL': {
      // Build compliant spreadsheet using SheetJS
      const tableHeaders = [
        "Employee ID",
        "Employee Name",
        "Department",
        "Trip Purpose",
        "Claimed (USD)",
        "Daily Meal Avg",
        "Compliance Status",
        "Reimbursement Eligible",
        "Governing Policy Clause"
      ];

      const tableRows = SYNTHETIC_EMPLOYEE_DIRECTORY.map(emp => [
        emp.employeeId,
        emp.name,
        emp.department,
        emp.tripPurpose,
        `$${emp.totalClaimedUSD.toFixed(2)}`,
        `$${emp.dailyMealAverageUSD.toFixed(2)}`,
        emp.complianceStatus,
        emp.eligibleForReimbursement ? "YES (Approved)" : "NO (Review Required)",
        emp.dailyMealAverageUSD <= 75 ? "Policy v3.1 Sec 3.2 ($75 Cap)" : "VIOLATION: Exceeds $75 Per Diem"
      ]);

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const wsData = [
        ["KOHLER CO. — ENTERPRISE EXPENSE REIMBURSEMENT AUDIT REPORT"],
        [`Generated: ${new Date().toLocaleDateString()} | Governing Policy: KOHLER-FIN-POL-101-V3 (v3.1)`],
        [],
        tableHeaders,
        ...tableRows
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Set column widths
      ws['!cols'] = [
        { wch: 18 },
        { wch: 20 },
        { wch: 28 },
        { wch: 38 },
        { wch: 16 },
        { wch: 16 },
        { wch: 22 },
        { wch: 24 },
        { wch: 32 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Expense_Audit_2026");

      // Generate base64 or blob URL
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
      const excelDownloadUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excelBuffer}`;
      const excelFileName = `KOHLER_Travel_Reimbursement_Audit_${new Date().toISOString().split('T')[0]}.xlsx`;

      return {
        format: 'EXCEL',
        rawText: `Generated Excel Spreadsheet: ${excelFileName} containing ${SYNTHETIC_EMPLOYEE_DIRECTORY.length} employee expense records audited against Travel Policy v3.1.`,
        excelFileName,
        excelDownloadUrl,
        tableHeaders,
        tableRows
      };
    }

    case 'CSV': {
      const csvHeaders = ["Employee ID", "Name", "Department", "Claimed USD", "Meal Avg USD", "Status", "Eligible"];
      const csvRows = SYNTHETIC_EMPLOYEE_DIRECTORY.map(e => 
        `"${e.employeeId}","${e.name}","${e.department}",${e.totalClaimedUSD},${e.dailyMealAverageUSD},"${e.complianceStatus}","${e.eligibleForReimbursement ? 'YES' : 'NO'}"`
      );
      const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

      return {
        format: 'CSV',
        rawText: csvContent
      };
    }

    case 'EMAIL': {
      const isProcurementFlightQuery = /flight|tokyo|business class|cabin class/i.test(query);

      let emailDraft: EmailDraft;

      if (isProcurementFlightQuery) {
        emailDraft = {
          to: "corporate.travel@kohler.com",
          cc: "sarah.lin.director@kohler.com, lightning.mcqueen@kohler.com",
          subject: "Formal Exception Request: Business Class Authorization for Critical Flight to Tokyo (Flight >8 Hours)",
          salutation: "Dear Corporate Travel & Procurement Operations,",
          body: `I am writing to formally request booking authorization for Business Class travel for an urgent on-site technical engagement at the Tokyo Smart Bathroom Innovation Pavilion.

In accordance with KOHLER Global Business Travel Policy (Doc ID: KOHLER-FIN-POL-101-V3, Section 4.1: Airfare & Cabin Class Restrictions), Business Class travel is authorized for nonstop international itineraries that exceed eight (8) continuous flight hours.

Flight Details:
• Itinerary: Chicago O'Hare (ORD) to Tokyo Haneda (HND)
• Scheduled Duration: 13 hours 20 minutes (Continuous nonstop flight)
• Business Justification: Critical delivery milestone for smart sensor firmware integration. Executive arrival requires immediate client readiness upon deplaning.

Department Director endorsement has been logged in Concur under pre-approval ID #TX-88209. Please confirm ticket issuance through our preferred corporate carrier.`,
          policyReferences: [
            "KOHLER-FIN-POL-101-V3: Section 4.1 (Airfare Cabin Class Regulations)",
            "Section 7.3: Department Director Concur Sign-off Threshold"
          ],
          actionItems: [
            "Corporate Travel ticketing issuance confirmation",
            "Concur pre-approval voucher upload",
            "Receipt retention for post-travel reconciliation"
          ]
        };
      } else {
        emailDraft = {
          to: "hr.operations@kohler.com",
          cc: "lightning.mcqueen@kohler.com",
          subject: "Inquiry Regarding Corporate Policy Interpretation & Guidance",
          salutation: "Dear Kohler People Operations Team,",
          body: `I am reaching out to clarify the official operational interpretation of company policy regarding the following inquiry:\n\n"${query}"\n\nBased on preliminary analysis from the Kohler Enterprise Intelligence Agent, the governing policy is referenced below. Could you please confirm if any additional department-specific exceptions apply to our business unit?`,
          policyReferences: citations.map(c => `${c.docId} (${c.title}, ${c.version})`),
          actionItems: [
            "HR review and policy clarification confirmation",
            "Written confirmation to attach to audit record"
          ]
        };
      }

      return {
        format: 'EMAIL',
        rawText: `To: ${emailDraft.to}\nCC: ${emailDraft.cc}\nSubject: ${emailDraft.subject}\n\n${emailDraft.salutation}\n\n${emailDraft.body}\n\nApplicable Policies:\n${emailDraft.policyReferences.map(p => `• ${p}`).join('\n')}`,
        emailDraft
      };
    }

    default:
      return {
        format: 'CHAT',
        rawText: answerText
      };
  }
}
