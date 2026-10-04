import React from 'react';
import { 
  SquareParking, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Layers, 
  GitFork 
} from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {/* 1. Total Slots (Linked List) */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-brand-500/40 transition-all group">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Slots</span>
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
            <SquareParking className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-white">{stats.totalSlots}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
            Linked List
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Nodes in memory</p>
      </div>

      {/* 2. Available Slots */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all group">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Available</span>
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-emerald-400">{stats.availableSlots}</span>
          <span className="text-xs text-slate-400">free slots</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div 
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${stats.totalSlots > 0 ? (stats.availableSlots / stats.totalSlots) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 3. Occupied Slots */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-rose-500/40 transition-all group">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Occupied</span>
          <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-rose-400">{stats.occupiedSlots}</span>
          <span className="text-xs font-bold text-amber-400">{stats.occupancyPercent}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div 
            className={`h-1.5 rounded-full transition-all duration-500 ${stats.occupancyPercent >= 90 ? 'bg-rose-500' : 'bg-amber-500'}`}
            style={{ width: `${stats.occupancyPercent}%` }}
          />
        </div>
      </div>

      {/* 4. Waiting Queue (FIFO) */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all group">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Waiting Queue</span>
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
            <Clock className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-cyan-400">{stats.waitingVehicles}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
            FIFO Queue
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {stats.waitingVehicles > 0 ? 'Vehicles in line' : 'Queue is empty'}
        </p>
      </div>

      {/* 5. Parked Today */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-blue-500/40 transition-all group">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Parked Today</span>
          <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
            <ArrowDownLeft className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-blue-400">{stats.vehiclesParkedToday}</span>
          <span className="text-xs text-slate-400">entries</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 truncate">
          Latest: {stats.latestEntry ? stats.latestEntry.vehicleNumber : 'None'}
        </p>
      </div>

      {/* 6. Exited Today (Stack) */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-purple-500/40 transition-all group">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Exited (Stack)</span>
          <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-purple-400">{stats.vehiclesExitedToday}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
            LIFO Stack
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 truncate">
          Top: {stats.latestExit ? stats.latestExit.vehicleNumber : 'None'}
        </p>
      </div>
    </div>
  );
}
