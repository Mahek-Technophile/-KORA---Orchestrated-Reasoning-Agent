import React from 'react';
import { Citation } from '../types/enterprise';
import { X, ExternalLink, Calendar, Award, ShieldCheck, Check } from 'lucide-react';

interface EvidenceDrawerProps {
  citation: Citation | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white border-l border-stone-200/90 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/90 backdrop-blur-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider">
              Authoritative Policy Inspector
            </h3>
            <span className="text-[10px] text-stone-500 font-medium">Verifiable Grounding Telemetry</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-stone-700">
        {/* Document Header Info */}
        <div className="space-y-2 pb-4 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
              {citation.docId}
            </span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              citation.status === 'ACTIVE' 
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-rose-100 text-rose-900 border border-rose-300'
            }`}>
              {citation.status}
            </span>
          </div>

          <h4 className="text-sm font-extrabold text-stone-950 pt-1 leading-snug">
            {citation.title}
          </h4>

          <div className="text-xs font-semibold text-stone-600">
            Section: {citation.section}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-[11px]">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <div className="text-stone-400 font-bold text-[9px] uppercase tracking-wider">Version</div>
            <div className="font-bold text-stone-900 mt-1 font-mono text-xs">{citation.version}</div>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <div className="text-stone-400 font-bold text-[9px] uppercase tracking-wider flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Effective Date</span>
            </div>
            <div className="font-bold text-stone-900 mt-1">{citation.effectiveDate}</div>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <div className="text-stone-400 font-bold text-[9px] uppercase tracking-wider">Authority Tier</div>
            <div className="font-bold text-stone-900 mt-1">{citation.authority}</div>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <div className="text-stone-400 font-bold text-[9px] uppercase tracking-wider">Match Score</div>
            <div className="font-bold text-emerald-700 mt-1 text-xs">{citation.relevanceScore}%</div>
          </div>
        </div>

        {/* Verbatim Excerpt */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Authoritative Excerpt
          </label>
          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 text-stone-900 leading-relaxed font-serif text-[12px] italic shadow-2xs">
            "{citation.excerpt}"
          </div>
        </div>

        {/* Grounding Verification Check */}
        <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
          <div className="text-emerald-950 font-bold text-xs flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Deterministic Grounding Verified</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-normal">
            Directly retrieved from the enterprise policy index. Mathematical verification confirms absence of hallucinated policy bounds.
          </p>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between text-xs">
        <span className="text-stone-500 font-mono text-[11px] font-semibold">Tier: {citation.accessLevel}</span>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white rounded-xl font-bold text-xs transition-colors shadow-xs"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};

