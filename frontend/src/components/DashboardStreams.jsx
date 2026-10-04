import React from 'react';
import { 
  Clock, 
  Layers, 
  ArrowRight, 
  Trash2, 
  RotateCcw, 
  LogOut,
  Car,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function DashboardStreams({ 
  waitingQueue = [], 
  historyStack = [], 
  onPopHistory, 
  onRemoveWaiting,
  onNavigateToVisualizer 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* 1. Waiting Queue (FIFO) Stream */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Waiting Vehicles Queue (FIFO)
              </h3>
              <p className="text-[11px] text-slate-400">
                Front vehicle auto-assigned when a slot is released
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
              {waitingQueue.length} Waiting
            </span>
          </div>
        </div>

        {waitingQueue.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-800/80 rounded-xl">
            No vehicles currently waiting. All slots are accommodating traffic.
          </div>
        ) : (
          <div className="space-y-2.5">
            {waitingQueue.slice(0, 4).map((v) => (
              <div
                key={v.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  v.isFront
                    ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    {v.position}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-white">
                        {v.vehicleNumber}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {v.vehicleType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {v.ownerName} • {new Date(v.waitingSince).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {v.isFront && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      FRONT (Next In)
                    </span>
                  )}
                  <button
                    onClick={() => onRemoveWaiting(v.vehicleNumber)}
                    title="Cancel Waiting"
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Recent Exit Stack (LIFO) Stream */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Recent Exits / History Stack (LIFO)
              </h3>
              <p className="text-[11px] text-slate-400">
                Pushed to TOP upon exit with duration & receipt
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/80">
              {historyStack.length} In Stack
            </span>
            {historyStack.length > 0 && (
              <button
                onClick={onPopHistory}
                className="px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold"
              >
                Pop Top
              </button>
            )}
          </div>
        </div>

        {historyStack.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-800/80 rounded-xl">
            No exits recorded yet. Stack is empty.
          </div>
        ) : (
          <div className="space-y-2.5">
            {historyStack.slice(0, 4).map((h, idx) => (
              <div
                key={h.id || idx}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  h.isTop
                    ? 'bg-purple-950/30 border-purple-500/40 text-purple-200 shadow-md ring-1 ring-purple-500/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    h.isTop ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {h.isTop ? 'TOP' : `#${h.depth}`}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-white">
                        {h.vehicleNumber}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        Slot {h.slotId}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Duration: {h.durationMinutes}m • Paid: ₹{h.fee}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono text-[11px] text-slate-400">
                  {new Date(h.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
