import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Citation, FormattedOutputData, OutputFormatType, UserRole, UserProfile, BenchmarkCase } from '../types/enterprise';
import { Send, FileSpreadsheet, Code2, Mail, Sparkles, Download, Copy, Check, ChevronRight, ShieldCheck, AlertTriangle, FileCode } from 'lucide-react';
import { EVALUATION_BENCHMARK_CASES } from '../data/evaluationBenchmark';

interface ChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  user: UserProfile;
  onSendMessage: (query: string, format?: OutputFormatType) => void;
  onOpenCitation: (citation: Citation) => void;
  onViewTrace: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isLoading,
  user,
  onSendMessage,
  onOpenCitation,
  onViewTrace
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<OutputFormatType>('CHAT');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeConfidenceScore, setActiveConfidenceScore] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim(), selectedFormat);
    setInputText('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] max-w-5xl mx-auto px-4 sm:px-6">
      {/* Quick Demo Scenario Bar */}
      <div className="py-2.5 border-b border-stone-200/80 shrink-0">
        <div className="flex items-center space-x-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Case Study One-Click Demos:
          </span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {EVALUATION_BENCHMARK_CASES.slice(0, 6).map((demo) => (
            <button
              key={demo.id}
              onClick={() => {
                setInputText(demo.query);
                setSelectedFormat(demo.expectedFormat);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-700 whitespace-nowrap transition-colors flex items-center space-x-1.5 shadow-2xs shrink-0"
            >
              <span className="font-mono text-[9px] font-bold text-stone-900 bg-stone-100 px-1 rounded">
                {demo.id}
              </span>
              <span className="truncate max-w-[160px]">{demo.title.split(':')[1] || demo.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-xl bg-stone-900 text-white font-serif font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              K
            </div>
            <h2 className="text-base font-semibold text-stone-900">
              KOHLER Enterprise Intelligence Agent
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto leading-relaxed">
              Ask policy inquiries across HR, Finance, Customer Care, Privacy, or Legal domains.
              Answers are grounded in authoritative documentation with deterministic RBAC and transparent confidence scoring.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-xl mx-auto text-xs">
              <button
                onClick={() => {
                  setInputText("What is the domestic travel meal reimbursement policy and daily allowance limit?");
                  setSelectedFormat("CHAT");
                }}
                className="p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-left transition-colors shadow-2xs"
              >
                <div className="font-semibold text-stone-900">Per Diem & Travel Cap</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Test single-domain RAG & quantitative extraction</div>
              </button>
              <button
                onClick={() => {
                  setInputText("What is the meal per diem limit for domestic travel? I heard it was $50 per day.");
                  setSelectedFormat("CHAT");
                }}
                className="p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-left transition-colors shadow-2xs"
              >
                <div className="font-semibold text-stone-900">Conflict Detection (v2 vs v3)</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Test supersession resolution: $50 vs $75/day</div>
              </button>
              <button
                onClick={() => {
                  setInputText("Find employees eligible for travel reimbursement and create an Excel spreadsheet summary with compliance status.");
                  setSelectedFormat("EXCEL");
                }}
                className="p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-left transition-colors shadow-2xs"
              >
                <div className="font-semibold text-stone-900">Audit & Excel Export</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Test tool execution & real .xlsx generation</div>
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
            >
              {/* Sender Label */}
              <div className="flex items-center space-x-2 text-[10px] text-stone-400 font-medium mb-1 px-1">
                <span>{msg.sender === 'USER' ? user.name : 'KOHLER AI Agent'}</span>
                <span>•</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.sender === 'USER' && (
                  <span className="font-mono text-[9px] px-1 py-0.2 bg-stone-100 rounded text-stone-600">
                    {msg.userRole}
                  </span>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-5 py-4 max-w-3xl text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'USER'
                    ? 'bg-stone-900 text-white rounded-br-xs'
                    : 'bg-white border border-stone-200/90 text-stone-800 rounded-bl-xs'
                }`}
              >
                {/* Text Content */}
                <div className="space-y-3 whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Conflict Resolution Notice (if detected) */}
                {msg.conflictReport?.detected && (
                  <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 space-y-1.5">
                    <div className="flex items-center space-x-1.5 font-semibold text-[11px]">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Policy Conflict & Supersession Notice</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-800">
                      {msg.conflictReport.description}
                    </p>
                    <p className="text-[11px] font-medium text-stone-800 bg-white/80 p-2 rounded border border-amber-200/60">
                      {msg.conflictReport.resolution}
                    </p>
                  </div>
                )}

                {/* Formatted Output Artifact (Excel, JSON, XML, Email) */}
                {msg.outputData && msg.outputData.format !== 'CHAT' && (
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center space-x-1">
                        {msg.outputData.format === 'EXCEL' && <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}
                        {msg.outputData.format === 'JSON' && <Code2 className="w-3.5 h-3.5 text-blue-600" />}
                        {msg.outputData.format === 'XML' && <FileCode className="w-3.5 h-3.5 text-orange-600" />}
                        {msg.outputData.format === 'EMAIL' && <Mail className="w-3.5 h-3.5 text-purple-600" />}
                        <span>Dynamic Output Format: {msg.outputData.format}</span>
                      </span>

                      {msg.outputData.rawText && (
                        <button
                          onClick={() => handleCopy(msg.outputData!.rawText, msg.id)}
                          className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center space-x-1"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>

                    {/* Render Excel */}
                    {msg.outputData.format === 'EXCEL' && (
                      <div className="space-y-3">
                        <div className="overflow-x-auto border border-stone-200 rounded-lg max-h-56">
                          <table className="w-full text-left text-[11px]">
                            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                              <tr>
                                {msg.outputData.tableHeaders?.map((th, i) => (
                                  <th key={i} className="p-2 whitespace-nowrap">{th}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-stone-700">
                              {msg.outputData.tableRows?.map((row, i) => (
                                <tr key={i} className="hover:bg-stone-50/60">
                                  {row.map((cell, j) => (
                                    <td key={j} className="p-2 whitespace-nowrap">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {msg.outputData.excelDownloadUrl && (
                          <a
                            href={msg.outputData.excelDownloadUrl}
                            download={msg.outputData.excelFileName || "KOHLER_Audit.xlsx"}
                            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-xs transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Validated .xlsx Spreadsheet</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Render JSON */}
                    {msg.outputData.format === 'JSON' && (
                      <div className="p-3 bg-stone-900 text-stone-100 rounded-xl font-mono text-[11px] overflow-x-auto max-h-64 leading-relaxed">
                        <pre>{msg.outputData.rawText}</pre>
                      </div>
                    )}

                    {/* Render XML */}
                    {msg.outputData.format === 'XML' && (
                      <div className="p-3 bg-stone-900 text-stone-100 rounded-xl font-mono text-[11px] overflow-x-auto max-h-64 leading-relaxed">
                        <pre>{msg.outputData.rawText}</pre>
                      </div>
                    )}

                    {/* Render Email */}
                    {msg.outputData.format === 'EMAIL' && msg.outputData.emailDraft && (
                      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs text-stone-800">
                        <div className="grid grid-cols-1 gap-1 text-[11px] border-b border-stone-200 pb-2">
                          <div><span className="font-semibold text-stone-500">To:</span> <span className="font-mono">{msg.outputData.emailDraft.to}</span></div>
                          {msg.outputData.emailDraft.cc && <div><span className="font-semibold text-stone-500">CC:</span> <span className="font-mono">{msg.outputData.emailDraft.cc}</span></div>}
                          <div><span className="font-semibold text-stone-500">Subject:</span> <span className="font-semibold text-stone-900">{msg.outputData.emailDraft.subject}</span></div>
                        </div>
                        <div className="whitespace-pre-wrap font-sans leading-relaxed pt-1 text-[11px]">
                          {msg.outputData.emailDraft.body}
                        </div>
                        <div className="pt-2 border-t border-stone-200 text-[10px] text-stone-500">
                          <span className="font-semibold text-stone-700">Governance References:</span>
                          <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                            {msg.outputData.emailDraft.policyReferences.map((ref, idx) => (
                              <li key={idx} className="font-mono">{ref}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Citations & Evidence Bar (Assistant messages) */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Authoritative Policy Citations ({msg.citations.length}):
                      </span>
                      {msg.confidence && (
                        <button
                          type="button"
                          onClick={() => setActiveConfidenceScore(msg.confidence)}
                          className={`inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${
                            msg.confidence.level === 'HIGH'
                              ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                              : msg.confidence.level === 'MEDIUM'
                              ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
                              : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/60'
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Confidence: {msg.confidence.score}% ({msg.confidence.level})</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cit, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onOpenCitation(cit)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-stone-50 hover:bg-amber-50/80 border border-stone-200 hover:border-amber-300 text-stone-700 hover:text-amber-900 transition-colors text-[11px] font-mono group"
                        >
                          <span className="font-semibold text-stone-900 group-hover:text-amber-900">{cit.docId}</span>
                          <span className="text-stone-400">•</span>
                          <span className="text-stone-600 truncate max-w-[120px]">{cit.section}</span>
                          <ChevronRight className="w-3 h-3 text-stone-400 group-hover:text-amber-700" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-start space-x-3 text-xs text-stone-500 animate-pulse">
            <div className="w-6 h-6 rounded bg-stone-900 text-white font-serif flex items-center justify-center text-[10px] font-bold">
              K
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Routing domain, evaluating RBAC clearance, and synthesizing evidence...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="py-4 border-t border-stone-200 shrink-0 bg-white">
        {/* Format Selector Pills */}
        <div className="flex items-center space-x-1.5 mb-2.5 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1">
            Format:
          </span>
          {(['CHAT', 'JSON', 'XML', 'EXCEL', 'EMAIL'] as OutputFormatType[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setSelectedFormat(fmt)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                selectedFormat === fmt
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {fmt === 'CHAT' ? 'Standard Answer' : fmt === 'EXCEL' ? 'Excel (.xlsx)' : fmt === 'EMAIL' ? 'Email Draft' : fmt}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder={`Ask a corporate policy inquiry as ${user.name} (${user.role})...`}
            className="w-full pl-4 pr-24 py-3 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all shadow-xs"
          />
          <div className="absolute right-2 flex items-center space-x-1.5">
            <button
              type="button"
              onClick={onViewTrace}
              title="Inspect ReAct Agent Trace"
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors text-[10px] font-mono hidden sm:block"
            >
              Trace
            </button>
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-30 text-white transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Confidence Breakdown Modal */}
      {activeConfidenceScore && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-stone-900 text-sm">
                  Confidence Score Formula Breakdown
                </h3>
              </div>
              <button
                onClick={() => setActiveConfidenceScore(null)}
                className="text-stone-400 hover:text-stone-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <div className="text-stone-500 text-[11px]">Composite Confidence Rating</div>
              <div className="text-2xl font-bold text-stone-900 mt-0.5">
                {activeConfidenceScore.score}% ({activeConfidenceScore.level})
              </div>
              <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                {activeConfidenceScore.explanation}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Mathematical Factor Weightings
              </label>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Retrieval Relevance (30% weight)</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {activeConfidenceScore.factors.retrievalRelevance}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Authority Level (25% weight)</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {activeConfidenceScore.factors.authorityLevel}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Temporal Freshness (20% weight)</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {activeConfidenceScore.factors.temporalValidity}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Conflict Freedom (15% weight)</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {activeConfidenceScore.factors.uncontradictedScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Numerical Claim Grounding (10% weight)</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {activeConfidenceScore.factors.verificationPassRate}%
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setActiveConfidenceScore(null)}
                className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
