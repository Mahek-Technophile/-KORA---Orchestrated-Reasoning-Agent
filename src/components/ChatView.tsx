import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Citation, FormattedOutputData, OutputFormatType, UserRole, UserProfile, BenchmarkCase } from '../types/enterprise';
import { Send, FileSpreadsheet, Code2, Mail, Sparkles, Download, Copy, Check, ChevronRight, ShieldCheck, AlertTriangle, FileCode, ArrowUpRight, Scale, Clock, Award, ShieldAlert, Cpu } from 'lucide-react';
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
      <div className="py-2.5 border-b border-stone-200/80 shrink-0 bg-stone-50/50 -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              One-Click Evaluation Scenarios
            </span>
          </div>
          <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
            Click to auto-populate test cases
          </span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {EVALUATION_BENCHMARK_CASES.slice(0, 7).map((demo) => {
            const domainBadge = demo.expectedDomains?.join('/') || 'GENERAL';
            return (
              <button
                key={demo.id}
                onClick={() => {
                  setInputText(demo.query);
                  setSelectedFormat(demo.expectedFormat);
                }}
                className="text-[11px] px-3 py-1.5 rounded-xl border border-stone-200/90 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-800 whitespace-nowrap transition-all flex items-center space-x-2 shadow-2xs shrink-0 group"
              >
                <span className="font-mono text-[9px] font-bold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                  {demo.id}
                </span>
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-tight">
                  {domainBadge}
                </span>
                <span className="text-stone-300">•</span>
                <span className="truncate max-w-[170px] font-medium text-stone-700">
                  {demo.title.includes(':') ? demo.title.split(':')[1].trim() : demo.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="py-6 px-2 max-w-3xl mx-auto">
            {/* Architectural Hero Card */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-stone-900 via-amber-700 to-stone-900" />
              
              <div className="w-12 h-12 rounded-xl bg-stone-950 text-white font-serif font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-md ring-1 ring-black/10">
                K
              </div>
              <h2 className="text-lg font-extrabold text-stone-950 tracking-tight">
                KORA Policy Intelligence
              </h2>
              <p className="text-xs text-stone-600 mt-1 max-w-lg mx-auto leading-relaxed">
                Permission-governed neuro-symbolic assistant grounding inquiries in authoritative enterprise policies across HR, Finance, Customer Care, Privacy, and Legal.
              </p>

              {/* Guarantees Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] font-medium">
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pre-Retrieval Zero-Trust RBAC</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200/60">
                  <Scale className="w-3.5 h-3.5 text-amber-600" />
                  <span>Deterministic Conflict Resolution</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200/60">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>Verifiable Citations</span>
                </span>
              </div>
            </div>

            {/* Capability Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => {
                  setInputText("What is the domestic travel meal reimbursement policy and daily allowance limit?");
                  setSelectedFormat("CHAT");
                }}
                className="p-4 rounded-xl border border-stone-200 bg-white hover:border-amber-400 hover:bg-stone-50/80 text-left transition-all shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Finance & Travel
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-amber-700 transition-colors" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs mt-2 group-hover:text-amber-900">
                    Per Diem Meal Allowance Cap
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    Extracts quantitative reimbursement limits, alcohol exclusions, and itemized receipt rules.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-stone-400 mt-3 block">Query: $75/day standard cap</span>
              </button>

              <button
                onClick={() => {
                  setInputText("What is the meal per diem limit for domestic travel? I heard it was $50 per day.");
                  setSelectedFormat("CHAT");
                }}
                className="p-4 rounded-xl border border-stone-200 bg-white hover:border-amber-400 hover:bg-stone-50/80 text-left transition-all shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                      Conflict Detection
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-amber-700 transition-colors" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs mt-2 group-hover:text-amber-900">
                    Supersession Resolution (v2 vs v3)
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    Tests automatic invalidation of outdated $50/day policy in favor of active FIN-POL-003 ($75/day).
                  </p>
                </div>
                <span className="text-[10px] font-mono text-stone-400 mt-3 block">Query: Superseded doc override</span>
              </button>

              <button
                onClick={() => {
                  setInputText("Find employees eligible for travel reimbursement and create an Excel spreadsheet summary with compliance status.");
                  setSelectedFormat("EXCEL");
                }}
                className="p-4 rounded-xl border border-stone-200 bg-white hover:border-amber-400 hover:bg-stone-50/80 text-left transition-all shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Executable Tooling
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-amber-700 transition-colors" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs mt-2 group-hover:text-amber-900">
                    Employee Audit & Real .xlsx Export
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    Executes internal directory search tool and generates an actual downloadable Excel file.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-stone-400 mt-3 block">Format: Executable .xlsx file</span>
              </button>

              <button
                onClick={() => {
                  setInputText("Can customer care reps initiate a replacement for a leaking smart toilet valve under warranty, and what telemetry is logged?");
                  setSelectedFormat("CHAT");
                }}
                className="p-4 rounded-xl border border-stone-200 bg-white hover:border-amber-400 hover:bg-stone-50/80 text-left transition-all shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      Cross-Domain Reasoning
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-amber-700 transition-colors" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs mt-2 group-hover:text-amber-900">
                    Customer Care + IoT Privacy
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    Synthesizes customer support replacement protocol (SUP-POL-001) with smart IoT privacy rules (PRV-POL-001).
                  </p>
                </div>
                <span className="text-[10px] font-mono text-stone-400 mt-3 block">Multi-domain: Support + IoT</span>
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'} animate-in fade-in-50 duration-150`}
            >
              {/* Sender Label */}
              <div className="flex items-center space-x-2 text-[10px] text-stone-500 font-medium mb-1.5 px-1.5">
                <span className="font-semibold text-stone-700">
                  {msg.sender === 'USER' ? user.name : 'KORA AI Agent'}
                </span>
                <span>•</span>
                <span className="font-mono text-stone-400">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.sender === 'USER' && (
                  <span className="font-mono text-[9px] px-1.5 py-0.5 bg-stone-200/80 rounded font-semibold text-stone-700">
                    {msg.userRole}
                  </span>
                )}
                {msg.sender === 'ASSISTANT' && (
                  <span className="inline-flex items-center space-x-1 text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
                    <span>Evidence-Grounded</span>
                  </span>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-5 sm:px-6 py-4 sm:py-5 max-w-3xl text-xs leading-relaxed shadow-xs transition-all ${
                  msg.sender === 'USER'
                    ? 'bg-stone-900 text-white rounded-br-xs border border-stone-800'
                    : 'bg-white border border-stone-200/90 text-stone-900 rounded-bl-xs'
                }`}
              >
                {/* Text Content */}
                <div className="space-y-3 whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed">
                  {msg.text}
                </div>

                {/* Conflict Resolution Notice (if detected) */}
                {msg.conflictReport?.detected && (
                  <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-300 text-amber-950 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-bold text-xs">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Policy Conflict Detected & Resolved</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 font-semibold uppercase">
                        Deterministic Override
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-900">
                      {msg.conflictReport.description}
                    </p>
                    <div className="text-[11px] font-medium text-stone-900 bg-white/95 p-3 rounded-lg border border-amber-200 shadow-2xs space-y-1">
                      <div className="font-bold text-stone-800 text-[10px] uppercase tracking-wider">
                        Active Governed Resolution:
                      </div>
                      <p>{msg.conflictReport.resolution}</p>
                    </div>
                  </div>
                )}

                {/* Formatted Output Artifact (Excel, JSON, XML, Email) */}
                {msg.outputData && msg.outputData.format !== 'CHAT' && (
                  <div className="mt-5 pt-4 border-t border-stone-100">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1.5">
                        {msg.outputData.format === 'EXCEL' && <FileSpreadsheet className="w-4 h-4 text-emerald-700" />}
                        {msg.outputData.format === 'JSON' && <Code2 className="w-4 h-4 text-blue-700" />}
                        {msg.outputData.format === 'XML' && <FileCode className="w-4 h-4 text-orange-700" />}
                        {msg.outputData.format === 'EMAIL' && <Mail className="w-4 h-4 text-purple-700" />}
                        <span>Dynamic Output Format: {msg.outputData.format}</span>
                      </span>

                      {msg.outputData.rawText && (
                        <button
                          onClick={() => handleCopy(msg.outputData!.rawText, msg.id)}
                          className="text-[11px] px-2 py-1 rounded border border-stone-200 hover:bg-stone-50 text-stone-600 flex items-center space-x-1.5 transition-colors"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-400" />}
                          <span className="font-medium">{copiedId === msg.id ? 'Copied' : 'Copy Payload'}</span>
                        </button>
                      )}
                    </div>

                    {/* Render Excel */}
                    {msg.outputData.format === 'EXCEL' && (
                      <div className="space-y-3">
                        <div className="overflow-x-auto border border-stone-200/90 rounded-xl max-h-60 shadow-2xs">
                          <table className="w-full text-left text-[11px]">
                            <thead className="bg-stone-100/80 text-stone-700 font-bold border-b border-stone-200">
                              <tr>
                                {msg.outputData.tableHeaders?.map((th, i) => (
                                  <th key={i} className="p-2.5 whitespace-nowrap">{th}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-stone-800 bg-white">
                              {msg.outputData.tableRows?.map((row, i) => (
                                <tr key={i} className="hover:bg-amber-50/40 transition-colors">
                                  {row.map((cell, j) => (
                                    <td key={j} className="p-2.5 whitespace-nowrap font-sans">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {msg.outputData.excelDownloadUrl && (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                                <FileSpreadsheet className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-emerald-950 text-xs">
                                  {msg.outputData.excelFileName || "KORA_Audit.xlsx"}
                                </div>
                                <div className="text-[10px] text-emerald-800">
                                  {msg.outputData.tableRows?.length || 0} Records • Client-Side Generated Spreadsheet
                                </div>
                              </div>
                            </div>
                            <a
                              href={msg.outputData.excelDownloadUrl}
                              download={msg.outputData.excelFileName || "KORA_Audit.xlsx"}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download .xlsx</span>
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Render JSON */}
                    {msg.outputData.format === 'JSON' && (
                      <div className="p-4 bg-stone-950 text-stone-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-64 leading-relaxed border border-stone-800 shadow-inner">
                        <pre>{msg.outputData.rawText}</pre>
                      </div>
                    )}

                    {/* Render XML */}
                    {msg.outputData.format === 'XML' && (
                      <div className="p-4 bg-stone-950 text-stone-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-64 leading-relaxed border border-stone-800 shadow-inner">
                        <pre>{msg.outputData.rawText}</pre>
                      </div>
                    )}

                    {/* Render Email */}
                    {msg.outputData.format === 'EMAIL' && msg.outputData.emailDraft && (
                      <div className="p-4 sm:p-5 rounded-xl bg-stone-50/80 border border-stone-200 space-y-3 text-xs text-stone-900 shadow-2xs">
                        <div className="grid grid-cols-1 gap-1 text-[11px] border-b border-stone-200 pb-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-stone-500 w-16">To:</span>
                            <span className="font-mono text-stone-800 font-semibold">{msg.outputData.emailDraft.to}</span>
                          </div>
                          {msg.outputData.emailDraft.cc && (
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-stone-500 w-16">CC:</span>
                              <span className="font-mono text-stone-800">{msg.outputData.emailDraft.cc}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 pt-0.5">
                            <span className="font-bold text-stone-500 w-16">Subject:</span>
                            <span className="font-bold text-stone-950">{msg.outputData.emailDraft.subject}</span>
                          </div>
                        </div>
                        <div className="whitespace-pre-wrap font-sans leading-relaxed pt-1 text-xs">
                          {msg.outputData.emailDraft.body}
                        </div>
                        <div className="pt-3 border-t border-stone-200 text-[10px] text-stone-500">
                          <span className="font-bold text-stone-700 uppercase tracking-wider">Governing Citations:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {msg.outputData.emailDraft.policyReferences.map((ref, idx) => (
                              <span key={idx} className="font-mono font-semibold px-2 py-0.5 rounded bg-stone-200/70 text-stone-800">
                                {ref}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Citations & Evidence Bar (Assistant messages) */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-5 pt-3.5 border-t border-stone-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Authoritative Policy Grounding ({msg.citations.length}):
                      </span>
                      {msg.confidence && (
                        <button
                          type="button"
                          onClick={() => setActiveConfidenceScore(msg.confidence)}
                          className={`inline-flex items-center space-x-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                            msg.confidence.level === 'HIGH'
                              ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300'
                              : msg.confidence.level === 'MEDIUM'
                              ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
                              : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-300'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Confidence Score: {msg.confidence.score}% ({msg.confidence.level})</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cit, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onOpenCitation(cit)}
                          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-stone-50 hover:bg-amber-50/80 border border-stone-200 hover:border-amber-300 text-stone-800 hover:text-amber-950 transition-all text-xs group shadow-2xs"
                        >
                          <span className="font-mono font-bold text-stone-900 group-hover:text-amber-950">
                            {cit.docId}
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="text-stone-600 font-medium truncate max-w-[150px]">
                            {cit.section}
                          </span>
                          <span className="font-mono text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1 rounded border border-emerald-200">
                            {cit.relevanceScore}%
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-800 transition-colors" />
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
          <div className="flex items-start space-x-3 text-xs text-stone-600 animate-pulse max-w-xl">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-200 font-serif flex items-center justify-center text-sm font-bold shadow-xs">
              K
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-2 flex-1">
              <div className="flex items-center space-x-2 text-stone-900 font-semibold">
                <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
                <span>Orchestrating Neuro-Symbolic Workflow...</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-snug">
                Routing domain intent, enforcing pre-retrieval RBAC filters, checking temporal supersessions, and synthesizing citations.
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="py-4 border-t border-stone-200 shrink-0 bg-white -mx-4 px-4 sm:-mx-6 sm:px-6">
        {/* Format Selector Pills */}
        <div className="flex items-center space-x-1.5 mb-2.5 text-xs overflow-x-auto scrollbar-none pb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1 shrink-0">
            Synthesis Target:
          </span>
          {(['CHAT', 'JSON', 'XML', 'EXCEL', 'EMAIL'] as OutputFormatType[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                selectedFormat === fmt
                  ? 'bg-stone-950 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              {fmt === 'CHAT' && <span>Chat Briefing</span>}
              {fmt === 'EXCEL' && <span>Excel (.xlsx)</span>}
              {fmt === 'EMAIL' && <span>Email Draft</span>}
              {fmt === 'JSON' && <span>JSON Payload</span>}
              {fmt === 'XML' && <span>XML Document</span>}
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
            placeholder={`Inquire as ${user.name} (${user.role} - ${user.department})...`}
            className="w-full pl-4 pr-28 py-3.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all shadow-xs placeholder:text-stone-400"
          />
          <div className="absolute right-2.5 flex items-center space-x-2">
            <button
              type="button"
              onClick={onViewTrace}
              title="Inspect Live ReAct Agent Trace"
              className="px-2 py-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors text-[11px] font-semibold hidden sm:flex items-center space-x-1"
            >
              <Cpu className="w-3.5 h-3.5 text-stone-500" />
              <span>Trace</span>
            </button>
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-lg bg-stone-950 hover:bg-stone-800 disabled:opacity-30 text-white transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Confidence Breakdown Modal */}
      {activeConfidenceScore && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50 duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-stone-950 text-sm">
                  Confidence Score Formula Breakdown
                </h3>
              </div>
              <button
                onClick={() => setActiveConfidenceScore(null)}
                className="w-7 h-7 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90">
              <div className="text-stone-500 text-[11px] font-medium">Composite Confidence Rating</div>
              <div className="text-3xl font-extrabold text-stone-950 mt-1 flex items-baseline space-x-2">
                <span>{activeConfidenceScore.score}%</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeConfidenceScore.level === 'HIGH'
                    ? 'bg-emerald-100 text-emerald-900'
                    : activeConfidenceScore.level === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-rose-100 text-rose-900'
                }`}>
                  {activeConfidenceScore.level}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mt-2 leading-relaxed">
                {activeConfidenceScore.explanation}
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Mathematical Factor Weightings
              </label>

              <div className="space-y-2.5 text-[11px]">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-stone-700 font-medium">Retrieval Relevance (30% weight)</span>
                    <span className="font-mono font-bold text-stone-900">
                      {activeConfidenceScore.factors.retrievalRelevance}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${activeConfidenceScore.factors.retrievalRelevance}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-stone-700 font-medium">Authority Level (25% weight)</span>
                    <span className="font-mono font-bold text-stone-900">
                      {activeConfidenceScore.factors.authorityLevel}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${activeConfidenceScore.factors.authorityLevel}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-stone-700 font-medium">Temporal Freshness (20% weight)</span>
                    <span className="font-mono font-bold text-stone-900">
                      {activeConfidenceScore.factors.temporalValidity}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: `${activeConfidenceScore.factors.temporalValidity}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-stone-700 font-medium">Conflict Freedom (15% weight)</span>
                    <span className="font-mono font-bold text-stone-900">
                      {activeConfidenceScore.factors.uncontradictedScore}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${activeConfidenceScore.factors.uncontradictedScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-stone-700 font-medium">Numerical Claim Grounding (10% weight)</span>
                    <span className="font-mono font-bold text-stone-900">
                      {activeConfidenceScore.factors.verificationPassRate}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: `${activeConfidenceScore.factors.verificationPassRate}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setActiveConfidenceScore(null)}
                className="px-5 py-2 bg-stone-950 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors shadow-xs"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

