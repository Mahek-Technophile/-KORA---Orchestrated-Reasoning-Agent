import React, { useState, useEffect } from 'react';
import { auditLogger } from '../services/auditLogger';
import { AuditRecord } from '../types/enterprise';
import { Search, Shield, Filter, CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react';

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
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            Enterprise Decision Audit Trail (Prototype)
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Prototype audit log — in-memory demonstration, not an immutable enterprise compliance system. Logs user identity, RBAC filtering, tool invocations, and HITL approvals.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded font-semibold text-[10px]">
            In-Memory Prototype Log
          </span>
          <span className="px-2.5 py-1 bg-stone-100 rounded-md font-semibold text-stone-700">
            {records.length} Total Records
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search by Audit ID, query, user, or domain..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs focus:outline-hidden focus:border-stone-900"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700 bg-white"
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
            className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700 bg-white"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>
      </div>

      {/* Audit Records Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Audit ID</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User & Role</th>
                <th className="px-4 py-3">Query</th>
                <th className="px-4 py-3">Domains</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">Risk & HITL</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-stone-900 whitespace-nowrap">
                    {record.id}
                  </td>
                  <td className="px-4 py-3 text-stone-500 whitespace-nowrap text-[11px]">
                    {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-stone-900">{record.userName}</div>
                    <div className="text-[10px] text-stone-500 font-mono">{record.userRole}</div>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-stone-800">
                    {record.query}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {record.detectedDomains.map(d => (
                        <span key={d} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-700">
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      record.confidence === 'HIGH'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                        : record.confidence === 'MEDIUM'
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-rose-50 text-rose-800'
                    }`}>
                      {record.confidence} ({record.confidenceScore}%)
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-stone-600 whitespace-nowrap">
                    {record.outputFormat}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        record.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-800' : record.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {record.riskLevel}
                      </span>
                      {record.hitlStatus !== 'NOT_APPLICABLE' && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          record.hitlStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          HITL: {record.hitlStatus}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="text-stone-900 hover:text-stone-600 font-semibold underline text-[11px]"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-stone-700" />
                <h3 className="font-bold text-sm text-stone-900 font-mono">
                  Audit Entry: {selectedRecord.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-stone-700">
              <div className="p-3 bg-stone-50 rounded-lg space-y-1">
                <span className="text-stone-400 text-[10px] font-semibold uppercase block">Original Query</span>
                <p className="font-semibold text-stone-900">"{selectedRecord.query}"</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-stone-50 rounded-lg">
                  <span className="text-stone-400 block text-[10px] uppercase">User Identity</span>
                  <span className="font-medium text-stone-900">{selectedRecord.userName}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg">
                  <span className="text-stone-400 block text-[10px] uppercase">Role Clearance</span>
                  <span className="font-mono text-stone-900">{selectedRecord.userRole}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg">
                  <span className="text-stone-400 block text-[10px] uppercase">Execution Latency</span>
                  <span className="font-mono text-emerald-700">{selectedRecord.durationMs} ms</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg">
                  <span className="text-stone-400 block text-[10px] uppercase">Conflict Detected</span>
                  <span className="font-medium text-stone-900">{selectedRecord.conflictsFound ? 'YES (Resolved)' : 'NO'}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg space-y-1">
                <span className="text-stone-400 text-[10px] font-semibold uppercase block">Tools Invoked</span>
                <div className="flex flex-wrap gap-1">
                  {selectedRecord.toolsUsed.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-mono text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg space-y-1">
                <span className="text-stone-400 text-[10px] font-semibold uppercase block">Grounded Citations</span>
                <div className="font-mono text-[10px] text-stone-800">
                  {selectedRecord.accessibleDocIds.join(', ')}
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
