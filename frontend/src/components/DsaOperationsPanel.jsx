import React, { useState } from 'react';
import { 
  Activity, 
  ArrowRight, 
  ArrowDown, 
  Clock, 
  Layers, 
  GitCommit, 
  Zap, 
  CheckCircle2, 
  Code2, 
  History 
} from 'lucide-react';

export default function DsaOperationsPanel({ dsaState }) {
  const [selectedOpIndex, setSelectedOpIndex] = useState(0);

  if (!dsaState) return null;

  const { latestOperation, recentOperations = [] } = dsaState;
  const currentOp = recentOperations[selectedOpIndex] || latestOperation;

  if (!currentOp) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-slate-400">
        <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p>No DSA operations logged yet. Perform a park or exit operation to see trace.</p>
      </div>
    );
  }

  const getOpBadgeColor = (type) => {
    switch (type) {
      case 'PARK_VEHICLE':
      case 'INSERT_SLOT':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'EXIT_VEHICLE':
      case 'POP_STACK':
      case 'DELETE_SLOT':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'WAITING_QUEUE_ENQUEUE':
      case 'AUTO_ASSIGN_FROM_QUEUE':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-brand-500/10 text-brand-300 border-brand-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              DSA Operations & Pointer Trace Panel
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Live Inspector
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Detailed step-by-step academic walkthrough of internal pointer transitions, state rewiring, and algorithmic Big-O metrics for each parking event.
          </p>
        </div>

        {/* Complexity Summary */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Time Complexity</span>
            <span className="text-sm font-bold text-amber-400">{currentOp.timeComplexity || 'O(1)'}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Space Complexity</span>
            <span className="text-sm font-bold text-cyan-400">{currentOp.spaceComplexity || 'O(1)'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Operations Timeline */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 h-fit">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Operation Stream ({recentOperations.length})
              </h3>
            </div>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {recentOperations.map((op, idx) => {
              const isSelected = selectedOpIndex === idx;
              return (
                <div
                  key={op.id || idx}
                  onClick={() => setSelectedOpIndex(idx)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-brand-500 shadow-md shadow-brand-950/40 ring-1 ring-brand-500/40'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${getOpBadgeColor(op.operation)}`}>
                      {op.operation}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(op.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 truncate">{op.title}</p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono truncate">
                    Structure: <span className="text-brand-300">{op.dataStructure}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Operation Trace & State Transition */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Operation Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-3">
              <div>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border inline-block mb-2 ${getOpBadgeColor(currentOp.operation)}`}>
                  {currentOp.operation}
                </span>
                <h2 className="text-xl font-bold text-white tracking-wide">{currentOp.title}</h2>
                <p className="text-xs text-brand-300 font-mono mt-1">
                  Algorithm: {currentOp.algorithm}
                </p>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Log ID: {currentOp.id}
              </div>
            </div>

            {/* Before vs After State Comparison Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Before State */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  1. State Before Operation
                </span>
                <pre className="font-mono text-xs text-amber-300/90 whitespace-pre-wrap break-all bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  {currentOp.before}
                </pre>
              </div>

              {/* After State */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  2. State After Operation
                </span>
                <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap break-all bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  {currentOp.after}
                </pre>
              </div>
            </div>

            {/* Step-by-Step Pointer Execution */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-wider block mb-3">
                3. Pointer Reassignments & Traversal Steps
              </span>

              <div className="space-y-2.5">
                {currentOp.steps && currentOp.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/40 flex items-center justify-center font-mono font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-300 leading-relaxed font-mono">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Live Snapshot of all 3 Structures */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live System State Hashes (Academic Trace)
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span className="text-indigo-400 font-bold min-w-[90px]">Linked List:</span>
                <span className="text-slate-300 truncate">{currentOp.linkedListTrace}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span className="text-cyan-400 font-bold min-w-[90px]">Queue:</span>
                <span className="text-slate-300 truncate">{currentOp.queueTrace}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span className="text-purple-400 font-bold min-w-[90px]">Stack:</span>
                <span className="text-slate-300 truncate">{currentOp.stackTrace}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
