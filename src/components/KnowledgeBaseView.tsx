import React, { useState } from 'react';
import { KOHLER_POLICIES, SYNTHETIC_DISCLAIMER } from '../data/syntheticKnowledgeBase';
import { PolicyDomain, PolicyStatus } from '../types/enterprise';
import { Search, Filter, Calendar, Shield, AlertTriangle, ChevronRight, FileText, Layers, CheckCircle2, History, Sparkles } from 'lucide-react';

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

  const domains = [
    { id: 'ALL', label: 'All Domains' },
    { id: 'HR', label: 'Human Resources' },
    { id: 'FINANCE', label: 'Finance & Travel' },
    { id: 'SUPPORT', label: 'Customer Care' },
    { id: 'PRIVACY', label: 'Smart IoT Privacy' },
    { id: 'LEGAL', label: 'Legal & Ethics' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Synthetic Disclaimer Banner */}
      <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-950 flex items-center space-x-3 shadow-2xs">
        <div className="w-7 h-7 rounded-lg bg-amber-200/70 flex items-center justify-center shrink-0 text-amber-900">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <span className="leading-snug">{SYNTHETIC_DISCLAIMER}</span>
      </div>

      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Corporate Governance
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-stone-950 tracking-tight mt-0.5">
            Authoritative Enterprise Policy Repository
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Deterministic index with strict version controls, temporal validity windows, and pre-retrieval access tags.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1.5 bg-stone-100 rounded-xl font-bold text-stone-800 border border-stone-200">
            {KOHLER_POLICIES.length} Total Policies
          </span>
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-900 rounded-xl font-bold border border-emerald-200">
            {KOHLER_POLICIES.filter(d => d.status === 'ACTIVE').length} Active
          </span>
          <span className="px-3 py-1.5 bg-rose-50 text-rose-900 rounded-xl font-bold border border-rose-200">
            {KOHLER_POLICIES.filter(d => d.status === 'SUPERSEDED').length} Superseded
          </span>
        </div>
      </div>

      {/* Domain Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {domains.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDomain(d.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDomain === d.id
                ? 'bg-stone-950 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-950'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 mb-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policies by keyword, title, clause, or document ID..."
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all placeholder:text-stone-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 bg-white focus:outline-hidden focus:border-stone-900"
            >
              <option value="ALL">All Lifecycle Statuses</option>
              <option value="ACTIVE">Active Policies Only</option>
              <option value="SUPERSEDED">Superseded / Historical Only</option>
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
              className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                doc.status === 'SUPERSEDED' 
                  ? 'border-rose-200 bg-rose-50/15' 
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-stone-950 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                      {doc.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-stone-100 text-stone-700">
                      v{doc.version}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                      doc.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}>
                      {doc.status}
                    </span>
                    {doc.supersedesId && (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center space-x-1">
                        <History className="w-3 h-3" />
                        <span>Overrides {doc.supersedesId}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-stone-500 font-medium">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>Effective: {doc.effectiveDate}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1.5">
                      <Shield className="w-3.5 h-3.5 text-stone-400" />
                      <span>Tier: {doc.accessLevel}</span>
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-stone-950 mt-3 leading-snug">
                  {doc.title}
                </h3>
                <div className="text-xs text-stone-500 font-semibold mt-1">
                  Department: <span className="text-stone-700">{doc.department}</span> • Authority: <span className="text-stone-700">{doc.authorityLevel}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
                  {doc.summary}
                </p>

                {/* Chunks Preview Toggle */}
                <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-medium text-stone-400 flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-stone-400" />
                    <span>{doc.chunks.length} Ingested Semantic Chunk(s)</span>
                  </span>
                  <button
                    onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                    className="text-xs font-bold text-stone-900 hover:text-amber-800 flex items-center space-x-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-50"
                  >
                    <span>{isExpanded ? 'Hide Chunks' : 'Inspect Chunks'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Expanded Chunks Drawer */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 space-y-3 bg-stone-50/70 border-t border-stone-100">
                  {doc.chunks.map((chunk) => (
                    <div
                      key={chunk.chunkId}
                      className="p-4 rounded-xl bg-white border border-stone-200/90 text-xs space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-950 flex items-center space-x-1.5">
                          <FileText className="w-4 h-4 text-stone-500" />
                          <span>{chunk.section}</span>
                        </span>
                        <span className="font-mono text-stone-400 text-[10px] bg-stone-100 px-1.5 py-0.5 rounded">{chunk.chunkId}</span>
                      </div>
                      <p className="text-stone-700 text-xs leading-relaxed">
                        {chunk.content}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {chunk.keywords.map(kw => (
                          <span key={kw} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono font-medium">
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

