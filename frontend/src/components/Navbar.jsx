import React from 'react';
import { 
  Car, 
  Layers, 
  Search, 
  ShieldAlert, 
  BookOpen, 
  Activity, 
  PlusCircle, 
  LogOut, 
  Zap,
  Moon,
  Sun
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  stats, 
  onOpenParkModal, 
  onOpenExitModal, 
  onSimulateRush,
  isDark,
  toggleTheme,
  loading
}) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard & Lot', icon: Car },
    { id: 'visualizer', label: 'DSA Visualizer', icon: Layers, badge: 'Core' },
    { id: 'operations', label: 'DSA Operations', icon: Activity },
    { id: 'search', label: 'Search Vehicle', icon: Search },
    { id: 'admin', label: 'Admin Controls', icon: ShieldAlert },
    { id: 'viva', label: 'Code & Viva Guide', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  ParkDSA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  DSA Project
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Linked List • FIFO Queue • LIFO Stack
              </p>
            </div>
          </div>

          {/* Center: Live Occupancy Quick Pill */}
          {stats && (
            <div className="hidden lg:flex items-center gap-4 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${stats.availableSlots > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-slate-300 font-medium">{stats.availableSlots} Available</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-medium">{stats.occupiedSlots} Occupied</span>
                <span className="text-slate-500">({stats.occupancyPercent}%)</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-cyan-400 font-medium">{stats.waitingVehicles} Waiting</span>
              </div>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenParkModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Park</span>
            </button>

            <button
              onClick={onOpenExitModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-rose-600/20 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit</span>
            </button>

            <button
              onClick={onSimulateRush}
              disabled={loading}
              title="Simulates quick vehicle rush to demonstrate queue and stack"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Rush Demo</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-900 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full uppercase font-bold tracking-wider ${
                    isActive ? 'bg-white/20 text-white' : 'bg-brand-500/20 text-brand-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
