import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/enterprise';
import { AVAILABLE_ROLES } from '../data/employeeDirectory';
import { ShieldCheck, UserCheck, ChevronDown, Sparkles } from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  onRoleChange: (newRole: UserRole) => void;
  activeTab: 'CHAT' | 'KNOWLEDGE' | 'TRACE' | 'AUDIT' | 'BENCHMARK';
  onTabChange: (tab: 'CHAT' | 'KNOWLEDGE' | 'TRACE' | 'AUDIT' | 'BENCHMARK') => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onRoleChange,
  activeTab,
  onTabChange
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRoleMeta = AVAILABLE_ROLES.find(r => r.role === user.role) || AVAILABLE_ROLES[0];

  return (
    <header className="border-b border-stone-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      {/* Top Branding & User Profile Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white font-serif font-black text-xl tracking-widest shadow-md ring-1 ring-black/10">
              K
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-stone-950 tracking-wider text-base uppercase">KORA</span>
                <span className="text-stone-300 font-light">/</span>
                <span className="text-stone-800 text-xs sm:text-sm font-semibold tracking-tight">Orchestrated Reasoning Agent</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  Track 3
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="inline-flex items-center space-x-1.5 text-[10px] text-stone-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Neuro-Symbolic RAG</span>
                </span>
                <span className="text-stone-300 text-[10px]">•</span>
                <span className="text-[10px] text-stone-500 hidden md:inline">
                  Pre-Retrieval Zero-Trust RBAC • Verifiable Citations
                </span>
              </div>
            </div>
          </div>

          {/* User Profile & Role Switcher */}
          <div className="flex items-center space-x-3">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl border border-stone-200/90 hover:border-stone-300 bg-stone-50/90 hover:bg-stone-100/90 transition-all text-left shadow-2xs group"
                aria-haspopup="true"
                aria-expanded={isRoleDropdownOpen}
              >
                <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-200 flex items-center justify-center text-xs font-bold ring-1 ring-stone-900/10 group-hover:scale-105 transition-transform">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-stone-900 flex items-center space-x-1.5">
                    <span>{user.name}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 flex items-center space-x-1">
                    <span className="text-amber-800 font-semibold">{currentRoleMeta.label}</span>
                    <span className="text-stone-300">•</span>
                    <span className="font-mono text-stone-500">{user.role}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-colors" />
              </button>

              {/* Role Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-stone-200 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5">
                  <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/60 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-stone-900">Active Persona & RBAC Clearance</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-200/70 font-mono text-stone-600 uppercase font-semibold">Simulator</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Change role to test deterministic pre-retrieval clearance gates.
                    </p>
                  </div>
                  <div className="py-1">
                    {AVAILABLE_ROLES.map((r) => {
                      const isSelected = user.role === r.role;
                      return (
                        <button
                          key={r.role}
                          onClick={() => {
                            onRoleChange(r.role);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs flex items-start space-x-3 hover:bg-stone-50 transition-colors ${
                            isSelected ? 'bg-amber-50/70 font-medium' : ''
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isSelected ? 'bg-amber-600 ring-2 ring-amber-200' : 'bg-stone-300'}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-stone-900 ${isSelected ? 'font-bold text-amber-950' : 'font-medium'}`}>
                                {r.label}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono font-semibold">
                                {r.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                              {r.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-t border-stone-100 pt-1 -mb-px overflow-x-auto scrollbar-none">
          <button
            onClick={() => onTabChange('CHAT')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'CHAT'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Copilot</span>
          </button>

          <button
            onClick={() => onTabChange('TRACE')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'TRACE'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>ReAct Agent Trace</span>
          </button>

          <button
            onClick={() => onTabChange('KNOWLEDGE')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'KNOWLEDGE'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <span>Policy Knowledge Base</span>
          </button>

          <button
            onClick={() => onTabChange('AUDIT')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'AUDIT'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <span>Compliance Audit Log</span>
          </button>

          <button
            onClick={() => onTabChange('BENCHMARK')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'BENCHMARK'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Evaluation & KPIs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
