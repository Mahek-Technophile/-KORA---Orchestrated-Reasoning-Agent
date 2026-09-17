export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'HR' | 'FINANCE' | 'LEGAL' | 'ADMIN';

export type PolicyDomain = 'HR' | 'FINANCE' | 'SUPPORT' | 'PRIVACY' | 'LEGAL';

export type AccessLevel = 'PUBLIC' | 'EMPLOYEE' | 'MANAGER' | 'HR_ONLY' | 'FINANCE_ONLY' | 'LEGAL_ONLY' | 'ADMIN';

export type PolicyStatus = 'ACTIVE' | 'SUPERSEDED' | 'DRAFT' | 'ARCHIVED';

export type OutputFormatType = 'CHAT' | 'JSON' | 'XML' | 'EXCEL' | 'EMAIL' | 'CSV';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  email: string;
}

export interface PolicyChunk {
  chunkId: string;
  documentId: string;
  section: string;
  content: string;
  keywords: string[];
  accessLevel: AccessLevel;
  effectiveDate: string;
  version: string;
}

export interface PolicyDocument {
  id: string;
  domain: PolicyDomain;
  department: string;
  title: string;
  version: string;
  effectiveDate: string;
  expiryDate: string | null;
  supersedesId?: string;
  supersededById?: string;
  authorityLevel: 'BOARD' | 'VP_LEVEL' | 'DIRECTOR' | 'DEPT_HEAD';
  accessLevel: AccessLevel;
  status: PolicyStatus;
  summary: string;
  chunks: PolicyChunk[];
}

export interface Citation {
  docId: string;
  title: string;
  version: string;
  section: string;
  effectiveDate: string;
  status: PolicyStatus;
  excerpt: string;
  authority: string;
  accessLevel: AccessLevel;
  relevanceScore: number;
}

export interface ConflictReport {
  detected: boolean;
  type?: 'VERSION_SUPERSEDED' | 'CONTRADICTING_TERMS' | 'CROSS_DOMAIN_TENSION';
  description?: string;
  docA?: { id: string; version: string; rule: string };
  docB?: { id: string; version: string; rule: string };
  resolution?: string;
  isResolved: boolean;
}

export interface ConfidenceScore {
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  score: number; // 0 - 100
  explanation: string;
  factors: {
    retrievalRelevance: number;
    authorityLevel: number;
    temporalValidity: number;
    uncontradictedScore: number;
    verificationPassRate: number;
  };
}

export interface AgentStep {
  stepNumber: number;
  type: 'UNDERSTAND' | 'ROUTE' | 'SECURITY_FILTER' | 'RETRIEVE' | 'TOOL_EXECUTION' | 'CONFLICT_CHECK' | 'SYNTHESIZE' | 'VERIFY' | 'HITL_GATE';
  title: string;
  detail: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'WARNING' | 'BLOCKED';
  durationMs: number;
  data?: Record<string, unknown>;
}

export interface EmailDraft {
  to: string;
  cc?: string;
  subject: string;
  salutation: string;
  body: string;
  policyReferences: string[];
  actionItems: string[];
}

export interface FormattedOutputData {
  format: OutputFormatType;
  rawText: string;
  jsonPayload?: Record<string, unknown>;
  xmlPayload?: string;
  emailDraft?: EmailDraft;
  excelFileName?: string;
  excelDownloadUrl?: string;
  tableHeaders?: string[];
  tableRows?: (string | number)[][];
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userDepartment: string;
  query: string;
  detectedDomains: PolicyDomain[];
  retrievedDocCount: number;
  accessibleDocIds: string[];
  filteredOutDocIds: string[];
  conflictsFound: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number;
  outputFormat: OutputFormatType;
  toolsUsed: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  hitlRequired: boolean;
  hitlStatus: 'NOT_APPLICABLE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  durationMs: number;
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'ASSISTANT' | 'SYSTEM';
  timestamp: string;
  text: string;
  userRole?: UserRole;
  domains?: PolicyDomain[];
  citations?: Citation[];
  confidence?: ConfidenceScore;
  conflictReport?: ConflictReport;
  steps?: AgentStep[];
  outputData?: FormattedOutputData;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  hitlRequired?: boolean;
  hitlStatus?: 'NOT_APPLICABLE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  auditId?: string;
}

export interface BenchmarkCase {
  id: string;
  title: string;
  query: string;
  role: UserRole;
  expectedDomains: PolicyDomain[];
  expectedDocIds: string[];
  expectedConflict: boolean;
  expectedAccessAllowed: boolean;
  expectedFormat: OutputFormatType;
  description: string;
}
