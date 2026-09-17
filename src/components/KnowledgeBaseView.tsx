import React, { useState } from 'react';
import { KOHLER_POLICIES, SYNTHETIC_DISCLAIMER } from '../data/syntheticKnowledgeBase';
import { PolicyDomain, PolicyStatus } from '../types/enterprise';
import { Search, Filter, Calendar, Shield, AlertTriangle, ChevronRight, FileText } from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  const filteredDocs = KOHLER_POLICIES.filter(doc => {
    if (selectedDomain !== 'ALL' && doc.domain !== selectedDomain) return false;
    if (selectedStatus !== 'ALL' && doc.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchSummary = doc.summary.toLowerCase().includes(q);
      const matchId = doc.id.toLowerCase().includes(q);
      const matchChunks = doc.chunks.some(c => c.content.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchId && !matchChunks) return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Synthetic Disclaimer Banner */}
      <div className="mb-6 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
        <span>{SYNTHETIC_DISCLAIMER}</span>
      </div>

      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            KOHLER Enterprise Knowledge Repository
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Indexed across 5 core corporate domains with version control, validity windows, and RBAC tags.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-stone-600">
          <span className="px-2.5 py-1 bg-stone-100 rounded-md font-semibold">{KOHLER_POLICIES.length} Total Policies</span>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md font-semibold">
            {KOHLER_POLICIES.filter(d => d.status === 'ACTIVE').length} Active
          </span>
          <span className="px-2.5 py-1 bg-rose-50 text-rose-800 rounded-md font-semibold">
            {KOHLER_POLICIES.filter(d => d.status === 'SUPERSEDED').length} Superseded
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policies by keyword, title, clause, or ID..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700 bg-white focus:outline-hidden focus:border-stone-900"
            >
              <option value="ALL">All Domains</option>
              <option value="HR">HR Policies</option>
              <option value="FINANCE">Financial Guidelines</option>
              <option value="SUPPORT">Customer Support</option>
              <option value="PRIVACY">Privacy Policies</option>
              <option value="LEGAL">Legal & Compliance</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700 bg-white focus:outline-hidden focus:border-stone-900"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="SUPERSEDED">Superseded / Historical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policy Documents List */}
      <div className="space-y-4">
        {filteredDocs.map((doc) => {
          const isExpanded = expandedDocId === doc.id;
          return (
            <div
              key={doc.id}
              className={`bg-white rounded-xl border transition-all shadow-xs ${
                doc.status === 'SUPERSEDED' 
                  ? 'border-rose-200/80 bg-rose-50/20' 
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded">
                      {doc.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-stone-100 text-stone-700">
                      {doc.version}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      doc.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {doc.status}
                    </span>
                    {doc.supersedesId && (
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                        Supersedes {doc.supersedesId}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-stone-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Effective: {doc.effectiveDate}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>Access: {doc.accessLevel}</span>
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-stone-900 mt-2.5">
                  {doc.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Department: {doc.department} | Authority: {doc.authorityLevel}
                </p>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {doc.summary}
                </p>

                {/* Chunks Preview Toggle */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    {doc.chunks.length} Ingested Semantic Chunk(s)
                  </span>
                  <button
                    onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                    className="text-xs font-medium text-stone-800 hover:text-stone-950 flex items-center space-x-1 transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Chunks' : 'Inspect Chunks'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Expanded Chunks Drawer */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 space-y-3 bg-stone-50/60 border-t border-stone-100 rounded-b-xl">
                  {doc.chunks.map((chunk) => (
                    <div
                      key={chunk.chunkId}
                      className="p-3.5 rounded-lg bg-white border border-stone-200 text-xs space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-stone-900 flex items-center space-x-1.5">
                          <FileText className="w-3.5 h-3.5 text-stone-500" />
                          <span>{chunk.section}</span>
                        </span>
                        <span className="font-mono text-stone-400 text-[10px]">{chunk.chunkId}</span>
                      </div>
                      <p className="text-stone-700 text-[11px] leading-relaxed">
                        {chunk.content}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {chunk.keywords.map(kw => (
                          <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-mono">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
