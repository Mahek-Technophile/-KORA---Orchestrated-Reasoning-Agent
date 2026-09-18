import React from 'react';
import { AgentStep } from '../types/enterprise';
import { Shield, Route, Search, Wrench, GitCompare, FileText, CheckCircle, Lock, AlertCircle, Clock, Cpu, ArrowRight, Zap } from 'lucide-react';

interface AgentTraceViewProps {
  steps: AgentStep[];
  query?: string;
}

export const AgentTraceView: React.FC<AgentTraceViewProps> = ({ steps, query }) => {
  if (!steps || steps.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-400 mb-4 shadow-2xs">
          <Clock className="w-7 h-7 text-stone-400" />
        </div>
        <h3 className="text-base font-bold text-stone-900">No Active Agent Trace</h3>
        <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto leading-relaxed">
          Inquire about a corporate policy in the Interactive Copilot tab to inspect the real-time ReAct loop (Thought → Action → Observation → Synthesis) with deterministic RBAC and latency telemetry.
        </p>
      </div>
    );
  }

  const getStepIcon = (type: AgentStep['type']) => {
    switch (type) {
      case 'UNDERSTAND': return <Search className="w-4 h-4 text-sky-600" />;
      case 'ROUTE': return <Route className="w-4 h-4 text-indigo-600" />;
      case 'SECURITY_FILTER': return <Lock className="w-4 h-4 text-amber-600" />;
      case 'RETRIEVE': return <Search className="w-4 h-4 text-emerald-600" />;
      case 'TOOL_EXECUTION': return <Wrench className="w-4 h-4 text-purple-600" />;
      case 'CONFLICT_CHECK': return <GitCompare className="w-4 h-4 text-orange-600" />;
      case 'SYNTHESIZE': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'VERIFY': return <CheckCircle className="w-4 h-4 text-teal-600" />;
      case 'HITL_GATE': return <Shield className="w-4 h-4 text-rose-600" />;
      default: return <Clock className="w-4 h-4 text-stone-500" />;
    }
  };

  const getReActPhase = (type: AgentStep['type']): { label: string; color: string } => {
    switch (type) {
      case 'UNDERSTAND':
      case 'ROUTE':
        return { label: 'THOUGHT (Intent & Routing)', color: 'bg-indigo-50 text-indigo-900 border-indigo-200' };
      case 'SECURITY_FILTER':
      case 'RETRIEVE':
      case 'TOOL_EXECUTION':
        return { label: 'ACTION (Pre-Retrieval Gate & Retrieval)', color: 'bg-emerald-50 text-emerald-900 border-emerald-200' };
      case 'CONFLICT_CHECK':
      case 'VERIFY':
        return { label: 'OBSERVATION (Deterministic Rule Verification)', color: 'bg-amber-50 text-amber-900 border-amber-200' };
      case 'SYNTHESIZE':
      case 'HITL_GATE':
        return { label: 'FINAL SYNTHESIS (Grounded Response)', color: 'bg-purple-50 text-purple-900 border-purple-200' };
      default:
        return { label: 'EXECUTION', color: 'bg-stone-50 text-stone-700 border-stone-200' };
    }
  };

  const totalDuration = steps.reduce((sum, s) => sum + s.durationMs, 0);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Telemetry Banner */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-stone-950 text-white uppercase tracking-wider">
              ReAct Engine
            </span>
            <span className="text-xs text-stone-500 font-medium">Deterministic Hybrid Execution Trace</span>
          </div>
          {query && (
            <p className="text-xs font-bold text-stone-900 mt-2 line-clamp-1">
              Active Query: <span className="text-stone-700 font-normal">"{query}"</span>
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-stone-400 block text-[9px] uppercase tracking-wider font-bold">Pipeline Steps</span>
            <span className="font-bold text-stone-950 text-sm">{steps.length} Executed</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-stone-400 block text-[9px] uppercase tracking-wider font-bold">Execution Latency</span>
            <span className="font-bold text-emerald-700 text-sm">{totalDuration} ms</span>
          </div>
        </div>
      </div>

      {/* Execution Pipeline Steps */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const phase = getReActPhase(step.type);
          const pct = Math.max(8, Math.round((step.durationMs / (totalDuration || 1)) * 100));

          return (
            <div key={step.stepNumber} className="relative flex items-start space-x-4">
              {/* Connector line */}
              {!isLast && (
                <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-stone-200 -z-10" />
              )}

              {/* Step Icon Badge */}
              <div className="w-8 h-8 rounded-full bg-white border-2 border-stone-200 shadow-xs flex items-center justify-center shrink-0 mt-1">
                {getStepIcon(step.type)}
              </div>

              {/* Step Card */}
              <div className="flex-1 bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs transition-all hover:border-stone-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                      STEP 0{step.stepNumber}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-stone-950">
                      {step.title}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${phase.color}`}>
                      {phase.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="font-mono text-stone-500 font-semibold">{step.durationMs}ms</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      step.status === 'COMPLETED' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : step.status === 'WARNING'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : step.status === 'BLOCKED'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar micro-meter */}
                <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden mt-3">
                  <div className="bg-stone-900 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>

                <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                  {step.detail}
                </p>

                {/* Optional Structured Data payload */}
                {step.data && Object.keys(step.data).length > 0 && (
                  <div className="mt-3.5 p-3 rounded-xl bg-stone-950 text-stone-200 font-mono text-[11px] border border-stone-800 shadow-inner">
                    <pre className="overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(step.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

