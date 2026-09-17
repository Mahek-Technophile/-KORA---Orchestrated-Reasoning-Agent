import { useState } from 'react';
import { UserProfile, UserRole, ChatMessage, Citation, AgentStep, OutputFormatType, BenchmarkCase } from './types/enterprise';
import { CURRENT_USER } from './data/employeeDirectory';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { AgentTraceView } from './components/AgentTraceView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { AuditLogView } from './components/AuditLogView';
import { BenchmarkView } from './components/BenchmarkView';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import { HitlApprovalModal } from './components/HitlApprovalModal';
import { executeAgentWorkflow } from './services/agentPlanner';
import { auditLogger } from './services/auditLogger';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [activeTab, setActiveTab] = useState<'CHAT' | 'KNOWLEDGE' | 'TRACE' | 'AUDIT' | 'BENCHMARK'>('CHAT');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrace, setCurrentTrace] = useState<AgentStep[]>([]);
  const [lastQuery, setLastQuery] = useState<string>('');
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);

  // HITL state
  const [isHitlModalOpen, setIsHitlModalOpen] = useState(false);
  const [pendingActionMessage, setPendingActionMessage] = useState<ChatMessage | null>(null);
  const [pendingAuditId, setPendingAuditId] = useState<string | null>(null);

  // Role change handler
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentUser(prev => ({
      ...prev,
      role: newRole
    }));
  };

  // Server-side Gemini enhancement caller
  const callServerGemini = async (prompt: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.text || null;
    } catch {
      return null;
    }
  };

  // Main query execution loop
  const handleSendMessage = async (queryText: string, formatOverride?: OutputFormatType) => {
    setIsLoading(true);
    setLastQuery(queryText);

    // 1. Append user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'USER',
      text: queryText,
      timestamp: new Date().toISOString(),
      userRole: currentUser.role
    };

    setMessages(prev => [...prev, userMsg]);

    const startTime = Date.now();

    try {
      // 2. Execute Agentic Planner workflow
      const plan = await executeAgentWorkflow(queryText, currentUser.role, formatOverride, callServerGemini);
      setCurrentTrace(plan.steps);

      const elapsed = Date.now() - startTime;

      // 3. Log Audit Record
      const auditRec = auditLogger.logEvent({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        userDepartment: currentUser.department,
        query: queryText,
        detectedDomains: plan.detectedDomains,
        retrievedDocCount: plan.citations.length,
        accessibleDocIds: plan.citations.map(c => c.docId),
        filteredOutDocIds: [],
        conflictsFound: plan.conflictReport.detected,
        confidence: plan.confidence.level,
        confidenceScore: plan.confidence.score,
        outputFormat: plan.outputData.format,
        toolsUsed: plan.toolsUsed,
        riskLevel: plan.riskLevel,
        hitlRequired: plan.hitlRequired,
        hitlStatus: plan.hitlRequired ? 'PENDING' : 'NOT_APPLICABLE',
        durationMs: elapsed
      });

      // 4. Create Assistant message
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        sender: 'ASSISTANT',
        text: plan.answerText,
        timestamp: new Date().toISOString(),
        citations: plan.citations,
        conflictReport: plan.conflictReport,
        confidence: plan.confidence,
        outputData: plan.outputData,
        steps: plan.steps,
        riskLevel: plan.riskLevel,
        hitlRequired: plan.hitlRequired,
        hitlStatus: plan.hitlRequired ? 'PENDING' : 'NOT_APPLICABLE'
      };

      setMessages(prev => [...prev, assistantMsg]);

      // 5. If HITL is required, open approval gate
      if (plan.hitlRequired) {
        setPendingActionMessage(assistantMsg);
        setPendingAuditId(auditRec.id);
        setIsHitlModalOpen(true);
      }
    } catch (err) {
      console.error("Workflow failure:", err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'SYSTEM',
        text: "An error occurred during workflow execution. Please retry.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // HITL Approval handlers
  const handleHitlApprove = () => {
    if (pendingAuditId) {
      auditLogger.updateHitlStatus(pendingAuditId, 'APPROVED');
    }
    if (pendingActionMessage) {
      setMessages(prev => prev.map(m => 
        m.id === pendingActionMessage.id ? { ...m, hitlStatus: 'APPROVED' } : m
      ));
    }
    setIsHitlModalOpen(false);
    setPendingActionMessage(null);
  };

  const handleHitlReject = () => {
    if (pendingAuditId) {
      auditLogger.updateHitlStatus(pendingAuditId, 'REJECTED');
    }
    if (pendingActionMessage) {
      setMessages(prev => prev.map(m => 
        m.id === pendingActionMessage.id ? { ...m, hitlStatus: 'REJECTED', text: `${m.text}\n\n🛑 **Action Canceled**: The user explicitly revoked authorization for this action.` } : m
      ));
    }
    setIsHitlModalOpen(false);
    setPendingActionMessage(null);
  };

  // Launch benchmark test scenario directly
  const handleSelectTestCase = (testCase: BenchmarkCase) => {
    // Switch role if required by test case
    setCurrentUser(prev => ({
      ...prev,
      role: testCase.role
    }));
    setActiveTab('CHAT');
    handleSendMessage(testCase.query, testCase.expectedFormat);
  };

  return (
    <div className="min-h-screen bg-stone-100/50 text-stone-900 flex flex-col font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Header */}
      <Header
        user={currentUser}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main View Body */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'CHAT' && (
          <ChatView
            messages={messages}
            isLoading={isLoading}
            user={currentUser}
            onSendMessage={handleSendMessage}
            onOpenCitation={(cit) => setSelectedCitation(cit)}
            onViewTrace={() => setActiveTab('TRACE')}
          />
        )}

        {activeTab === 'TRACE' && (
          <AgentTraceView
            steps={currentTrace}
            query={lastQuery}
          />
        )}

        {activeTab === 'KNOWLEDGE' && (
          <KnowledgeBaseView />
        )}

        {activeTab === 'AUDIT' && (
          <AuditLogView />
        )}

        {activeTab === 'BENCHMARK' && (
          <BenchmarkView
            onSelectTestCase={handleSelectTestCase}
          />
        )}
      </main>

      {/* Evidence Side Drawer */}
      <EvidenceDrawer
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
      />

      {/* Human-in-the-Loop Safety Modal */}
      <HitlApprovalModal
        isOpen={isHitlModalOpen}
        user={currentUser}
        emailDraft={pendingActionMessage?.outputData?.emailDraft}
        onApprove={handleHitlApprove}
        onReject={handleHitlReject}
      />
    </div>
  );
}
