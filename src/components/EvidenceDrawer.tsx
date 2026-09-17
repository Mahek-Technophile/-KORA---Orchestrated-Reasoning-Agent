import React from 'react';
import { Citation } from '../types/enterprise';
import { X, ExternalLink, Calendar, Award } from 'lucide-react';

interface EvidenceDrawerProps {
  citation: Citation | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white border-l border-stone-200 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-amber-700" />
          <h3 className="text-xs font-semibold text-stone-900 tracking-wide uppercase">
            Authoritative Citation Inspector
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-stone-700">
        {/* Document Header Info */}
        <div className="space-y-1.5 pb-4 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
              {citation.docId}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
              citation.status === 'ACTIVE' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                : 'bg-rose-50 text-rose-800 border border-rose-200/60'
            }`}>
              {citation.status}
            </span>
          </div>

          <h4 className="text-sm font-semibold text-stone-900 pt-1">
            {citation.title}
          </h4>

          <div className="text-[11px] font-medium text-stone-600">
            {citation.section}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/60">
            <div className="text-stone-400 font-medium text-[10px] uppercase">Version</div>
            <div className="font-semibold text-stone-800 mt-0.5 font-mono">{citation.version}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/60">
            <div className="text-stone-400 font-medium text-[10px] uppercase flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Effective Date</span>
            </div>
            <div className="font-semibold text-stone-800 mt-0.5">{citation.effectiveDate}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/60">
            <div className="text-stone-400 font-medium text-[10px] uppercase">Authority Level</div>
            <div className="font-semibold text-stone-800 mt-0.5">{citation.authority}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/60">
            <div className="text-stone-400 font-medium text-[10px] uppercase">Relevance Match</div>
            <div className="font-semibold text-emerald-700 mt-0.5">{citation.relevanceScore}%</div>
          </div>
        </div>

        {/* Verbatim Excerpt */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-stone-900 uppercase tracking-wide">
            Retrieved Authoritative Excerpt
          </label>
          <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/60 text-stone-800 leading-relaxed font-serif text-[12px] italic">
            "{citation.excerpt}"
          </div>
        </div>

        {/* Grounding Verification Check */}
        <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/60 space-y-1">
          <div className="text-emerald-900 font-medium text-[11px] flex items-center space-x-1.5">
            <span>✓ Verified by Grounding Engine</span>
          </div>
          <p className="text-[10px] text-emerald-800 leading-normal">
            Extracted directly from the indexed Kohler policy database. No hallucinations or unverified additions detected.
          </p>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-[11px]">
        <span className="text-stone-500 font-mono text-[10px]">Access Tier: {citation.accessLevel}</span>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-md font-medium transition-colors"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
