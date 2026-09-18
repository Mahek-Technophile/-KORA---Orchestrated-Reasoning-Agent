import React, { useState, useEffect } from 'react';
import { auditLogger } from '../services/auditLogger';
import { AuditRecord } from '../types/enterprise';
import { Search, Shield, Filter, CheckCircle2, Clock, AlertTriangle, FileText, UserCheck, Activity, Terminal } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  useEffect(() => {
    setRecords(auditLogger.getRecords());
  }, []);

  const filtered = records.filter(r => {
    if (roleFilter !== 'ALL' && r.userRole !== roleFilter) return false;
    if (riskFilter !== 'ALL' && r.riskLevel !== riskFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        r.query.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.detectedDomains.some(d => d.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Audit & Governance Telemetry
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-stone-950 tracking-tight mt-0.5">
            Enterprise Decision Audit Trail
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            In-memory evaluation log recording user role clearance, dynamic domain routing, deterministic conflict overrides, and tool executions.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-bold text-[10px]">
            In-Memory Log
          </span>
          <span className="px-3 py-1 bg-stone-100 border border-stone-200 rounded-xl font-bold text-stone-800">
            {records.length} Total Events
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 mb-6 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search by Audit ID, query prompt, user, or domain..."
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all placeholder:text-stone-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 bg-white focus:outline-hidden focus:border-stone-900"
          >
            <option value="ALL">All Roles</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="HR">HR Specialist</option>
            <option value="FINANCE">Finance Auditor</option>
            <option value="LEGAL">Legal & Compliance</option>
            <option value="ADMIN">Administrator</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 bg-white focus:outline-hidden focus:border-stone-900"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>
      </div>

      {/* Audit Records Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Audit ID</th>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Identity & Role</th>
                <th className="px-4 py-3.5">Query Prompt</th>
                <th className="px-4 py-3.5">Domains</th>
                <th className="px-4 py-3.5">Confidence</th>
                <th className="px-4 py-3.5">Format</th>
                <th className="px-4 py-3.5">Risk & HITL</th>
                <th className="px-4 py-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-stone-950 whitespace-nowrap">
                    {record.id}
                  </td>
                  <td className="px-4 py-3.5 text-stone-500 whitespace-nowrap text-[11px] font-mono">
                    {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-bold text-stone-950">{record.userName}</div>
                    <div className="text-[10px] text-stone-500 font-mono font-semibold">{record.userRole}</div>
                  </td>
                  <td className="px-4 py-3.5 max-w-xs truncate text-stone-800 font-medium">
                    {record.query}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {record.detectedDomains.map(d => (
                        <span key={d} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-700">
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      record.confidence === 'HIGH'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : record.confidence === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}>
                      {record.confidence} ({record.confidenceScore}%)
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[10px] text-stone-700 whitespace-nowrap font-bold">
                    {record.outputFormat}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        record.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-900 border border-rose-300' : record.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {record.riskLevel}
                      </span>
                      {record.hitlStatus !== 'NOT_APPLICABLE' && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          record.hitlStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900'
                        }`}>
                          HITL: {record.hitlStatus}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="text-stone-900 hover:text-amber-800 font-bold underline text-xs transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Inspector Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50 duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-stone-900" />
                <h3 className="font-extrabold text-sm text-stone-950 font-mono">
                  Audit Telemetry: {selectedRecord.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-7 h-7 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-stone-700">
              <div className="p-3.5 bg-stone-50 rounded-xl space-y-1 border border-stone-200/80">
                <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider block">Query Prompt</span>
                <p className="font-bold text-stone-950 text-xs">"{selectedRecord.query}"</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <span className="text-stone-400 block text-[9px] font-bold uppercase tracking-wider">User Identity</span>
                  <span className="font-bold text-stone-900 mt-0.5 block">{selectedRecord.userName}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <span className="text-stone-400 block text-[9px] font-bold uppercase tracking-wider">Role Clearance</span>
                  <span className="font-mono font-bold text-stone-900 mt-0.5 block">{selectedRecord.userRole}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <span className="text-stone-400 block text-[9px] font-bold uppercase tracking-wider">Latency</span>
                  <span className="font-mono font-bold text-emerald-700 mt-0.5 block">{selectedRecord.durationMs} ms</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <span className="text-stone-400 block text-[9px] font-bold uppercase tracking-wider">Conflict Override</span>
                  <span className="font-bold text-stone-900 mt-0.5 block">{selectedRecord.conflictsFound ? 'YES (Resolved)' : 'NO'}</span>
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl space-y-1.5 border border-stone-200/80">
                <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider block">Tools Invoked</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRecord.toolsUsed.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 font-mono text-[10px] font-bold border border-purple-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl space-y-1.5 border border-stone-200/80">
                <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider block">Grounded Citations</span>
                <div className="font-mono text-xs font-bold text-stone-900">
                  {selectedRecord.accessibleDocIds.join(', ')}
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 bg-stone-950 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors shadow-xs"
              >
                Close Telemetry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

