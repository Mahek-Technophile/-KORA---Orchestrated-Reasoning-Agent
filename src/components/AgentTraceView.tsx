import React from 'react';
import { AgentStep } from '../types/enterprise';
import { Shield, Route, Search, Wrench, GitCompare, FileText, CheckCircle, Lock, AlertCircle, Clock } from 'lucide-react';

interface AgentTraceViewProps {
  steps: AgentStep[];
  query?: string;
}

export const AgentTraceView: React.FC<AgentTraceViewProps> = ({ steps, query }) => {
  if (!steps || steps.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400 mb-3">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-stone-900">No Active Agent Trace</h3>
        <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
          Execute a query in the Interactive Copilot tab to inspect the real-time agentic plan, domain routing, and security filtering.
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

  const totalDuration = steps.reduce((sum, s) => sum + s.durationMs, 0);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Telemetry Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-900 text-white uppercase tracking-wider">
              ReAct Architecture
            </span>
            <span className="text-xs text-stone-500">Live Agentic Execution Telemetry</span>
          </div>
          {query && (
            <p className="text-xs font-semibold text-stone-900 mt-1.5 line-clamp-1">
              Query: "{query}"
            </p>
          )}
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/80">
            <span className="text-stone-400 block text-[10px] uppercase">Total Steps</span>
            <span className="font-bold text-stone-900">{steps.length} Executed</span>
          </div>
          <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/80">
            <span className="text-stone-400 block text-[10px] uppercase">Latency</span>
            <span className="font-bold text-emerald-700">{totalDuration} ms</span>
          </div>
        </div>
      </div>

      {/* Execution Pipeline Steps */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          return (
            <div key={step.stepNumber} className="relative flex items-start space-x-4">
              {/* Connector line */}
              {!isLast && (
                <div className="absolute left-4 top-9 bottom-0 w-0.5 bg-stone-200 -z-10" />
              )}

              {/* Step Icon Badge */}
              <div className="w-8 h-8 rounded-full bg-white border-2 border-stone-200 shadow-xs flex items-center justify-center shrink-0 mt-0.5">
                {getStepIcon(step.type)}
              </div>

              {/* Step Card */}
              <div className="flex-1 bg-white rounded-xl border border-stone-200/90 p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-stone-400">
                      STEP 0{step.stepNumber}
                    </span>
                    <span className="text-xs font-semibold text-stone-900">
                      {step.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px]">
                    <span className="font-mono text-stone-400">{step.durationMs}ms</span>
                    <span className={`px-2 py-0.5 rounded font-medium ${
                      step.status === 'COMPLETED' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : step.status === 'WARNING'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : step.status === 'BLOCKED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {step.detail}
                </p>

                {/* Optional Structured Data payload */}
                {step.data && Object.keys(step.data).length > 0 && (
                  <div className="mt-3 p-2.5 rounded-lg bg-stone-50 border border-stone-100 font-mono text-[11px] text-stone-700">
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
