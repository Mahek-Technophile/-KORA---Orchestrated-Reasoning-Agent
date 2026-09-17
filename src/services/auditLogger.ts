import { AuditRecord, UserRole, PolicyDomain, OutputFormatType } from '../types/enterprise';

class AuditLoggerService {
  private records: AuditRecord[] = [];

  constructor() {
    // Seed with a few realistic initial historical records
    this.records = [
      {
        id: "AUD-2026-0901",
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        userId: "KOHLER-EMP-95095",
        userName: "Lightning McQueen",
        userRole: "EMPLOYEE",
        userDepartment: "Product Design & Sustainable Engineering",
        query: "What is the domestic travel meal allowance?",
        detectedDomains: ["FINANCE"],
        retrievedDocCount: 2,
        accessibleDocIds: ["KOHLER-FIN-POL-101-V3"],
        filteredOutDocIds: [],
        conflictsFound: true,
        confidence: "HIGH",
        confidenceScore: 92,
        outputFormat: "CHAT",
        toolsUsed: ["policy_diff_and_conflict_resolver"],
        riskLevel: "LOW",
        hitlRequired: false,
        hitlStatus: "NOT_APPLICABLE",
        durationMs: 320
      },
      {
        id: "AUD-2026-0899",
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        userId: "KOHLER-EMP-10442",
        userName: "Sarah Jenkins",
        userRole: "MANAGER",
        userDepartment: "Global Customer Care",
        query: "Generate Excel summary of department travel expenses",
        detectedDomains: ["FINANCE"],
        retrievedDocCount: 3,
        accessibleDocIds: ["KOHLER-FIN-POL-101-V3"],
        filteredOutDocIds: [],
        conflictsFound: false,
        confidence: "HIGH",
        confidenceScore: 95,
        outputFormat: "EXCEL",
        toolsUsed: ["employee_directory_lookup", "excel_binary_builder"],
        riskLevel: "MEDIUM",
        hitlRequired: false,
        hitlStatus: "NOT_APPLICABLE",
        durationMs: 410
      }
    ];
  }

  public logEvent(record: Omit<AuditRecord, 'id' | 'timestamp'>): AuditRecord {
    const fullRecord: AuditRecord = {
      ...record,
      id: `AUD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString()
    };
    this.records.unshift(fullRecord);
    return fullRecord;
  }

  public getRecords(): AuditRecord[] {
    return [...this.records];
  }

  public updateHitlStatus(auditId: string, status: 'APPROVED' | 'REJECTED'): void {
    const rec = this.records.find(r => r.id === auditId);
    if (rec) {
      rec.hitlStatus = status;
    }
  }
}

export const auditLogger = new AuditLoggerService();
