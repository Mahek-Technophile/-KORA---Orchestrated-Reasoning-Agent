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
    <header className="border-b border-stone-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Top Branding & User Profile Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-stone-900 flex items-center justify-center text-white font-serif font-bold text-lg tracking-wider shadow-sm">
              K
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-stone-900 tracking-tight text-base">KOHLER</span>
                <span className="text-stone-400 font-light">|</span>
                <span className="text-stone-800 text-sm font-medium">Enterprise Intelligence Agent</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                  Track 3 Prototype
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Permission-Aware • Evidence-Grounded • Multi-Domain Policy Copilot
              </p>
            </div>
          </div>

          {/* User Profile & Role Switcher */}
          <div className="flex items-center space-x-3">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-stone-50/80 hover:bg-stone-100 transition-colors text-left"
                aria-haspopup="true"
                aria-expanded={isRoleDropdownOpen}
              >
                <div className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center text-xs font-medium">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-stone-900 flex items-center space-x-1.5">
                    <span>{user.name}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center space-x-1">
                    <span className="text-amber-700 font-medium">{currentRoleMeta.label}</span>
                    <span>•</span>
                    <span>{currentRoleMeta.badge}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Role Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-stone-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-900">Switch User Role (RBAC Simulator)</p>
                    <p className="text-[11px] text-stone-500">
                      Tests deterministic pre-retrieval filtering with different clearance tiers.
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
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-start space-x-2.5 hover:bg-stone-50 transition-colors ${
                            isSelected ? 'bg-amber-50/60 font-medium' : ''
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${isSelected ? 'bg-amber-600' : 'bg-stone-300'}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-stone-900 ${isSelected ? 'font-semibold text-amber-900' : ''}`}>
                                {r.label}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                                {r.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
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
            className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'CHAT'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Copilot</span>
          </button>

          <button
            onClick={() => onTabChange('TRACE')}
            className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'TRACE'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Agent ReAct Trace</span>
          </button>

          <button
            onClick={() => onTabChange('KNOWLEDGE')}
            className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'KNOWLEDGE'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <span>Enterprise Knowledge Base</span>
          </button>

          <button
            onClick={() => onTabChange('AUDIT')}
            className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'AUDIT'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <span>Compliance Audit Log</span>
          </button>

          <button
            onClick={() => onTabChange('BENCHMARK')}
            className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'BENCHMARK'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Evaluation & KPIs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
