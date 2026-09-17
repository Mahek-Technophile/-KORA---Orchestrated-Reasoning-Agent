import React from 'react';
import { UserProfile, EmailDraft } from '../types/enterprise';
import { ShieldAlert, CheckCircle2, XCircle, Mail, AlertTriangle } from 'lucide-react';

interface HitlApprovalModalProps {
  isOpen: boolean;
  user: UserProfile;
  emailDraft?: EmailDraft;
  onApprove: () => void;
  onReject: () => void;
}

export const HitlApprovalModal: React.FC<HitlApprovalModalProps> = ({
  isOpen,
  user,
  emailDraft,
  onApprove,
  onReject
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Alert */}
        <div className="bg-rose-50 border-b border-rose-200/80 px-6 py-4 flex items-start space-x-3.5">
          <div className="p-2 bg-rose-100 rounded-lg text-rose-700 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-200/70 px-2 py-0.5 rounded">
                Human-in-the-Loop Control
              </span>
              <span className="text-xs text-rose-700 font-medium">Risk Tier: HIGH</span>
            </div>
            <h3 className="text-base font-semibold text-stone-900 mt-1">
              Authorization Required for Outbound Communication
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              The AI Agent has synthesized a draft communication requiring explicit human confirmation before execution.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs text-stone-700">
          {/* Action Context Box */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-stone-700">Action Type:</span>
              <span className="font-mono text-stone-800 font-medium flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <span>Enterprise Email Dispatch</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-stone-700">Authorizing User:</span>
              <span className="font-medium text-stone-900">{user.name} ({user.role})</span>
            </div>
            {emailDraft && (
              <>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-stone-700">Recipient:</span>
                  <span className="font-mono text-stone-800">{emailDraft.to}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-stone-700">Subject:</span>
                  <span className="font-medium text-stone-900 truncate max-w-[280px]">{emailDraft.subject}</span>
                </div>
              </>
            )}
          </div>

          {/* Draft Preview */}
          {emailDraft && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-stone-800 uppercase tracking-wider">
                Prepared Message Draft
              </label>
              <div className="max-h-48 overflow-y-auto p-3.5 rounded-xl bg-white border border-stone-200 text-stone-800 text-[11px] whitespace-pre-wrap font-sans leading-relaxed">
                {emailDraft.body}
              </div>
            </div>
          )}

          {/* Warning notice */}
          <div className="flex items-start space-x-2 text-[11px] text-amber-800 bg-amber-50/80 p-3 rounded-lg border border-amber-200/60">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              By authorizing, this event will be logged in the immutable enterprise audit trail with your digital signature and role clearance.
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onReject}
            className="px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-medium text-xs transition-colors flex items-center space-x-1.5"
          >
            <XCircle className="w-4 h-4 text-stone-500" />
            <span>Reject / Cancel</span>
          </button>

          <button
            type="button"
            onClick={onApprove}
            className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Authorize & Confirm Action</span>
          </button>
        </div>
      </div>
    </div>
  );
};
