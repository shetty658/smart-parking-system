import React, { useState } from 'react';
import { 
  GitFork, 
  ArrowRight, 
  ArrowDown, 
  Layers, 
  Clock, 
  Car, 
  User, 
  Sparkles, 
  Info, 
  Eye, 
  Play, 
  RotateCcw,
  CheckCircle2,
  Trash2,
  UploadCloud
} from 'lucide-react';

export default function DsaVisualizerPage({ 
  dsaState, 
  onPopHistory, 
  onRemoveWaiting, 
  onSelectSlot 
}) {
  const [inspectedNode, setInspectedNode] = useState(null);
  const [activeSection, setActiveSection] = useState('ALL'); // 'ALL' | 'LL' | 'QUEUE' | 'STACK'

  if (!dsaState) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        Loading DSA visual models...
      </div>
    );
  }

  const { linkedList, queue, stack, latestOperation } = dsaState;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Visualizer Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              DSA Visualizer & Memory Model
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Academic Architecture
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Live interactive graphical visualization of internal data structures managing slots, waiting vehicles, and exit logs.
          </p>
        </div>

        {/* Section Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Structures' },
            { id: 'LL', label: '1. Linked List' },
            { id: 'QUEUE', label: '2. Queue' },
            { id: 'STACK', label: '3. Stack' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveSection(btn.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSection === btn.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: LINKED LIST (PARKING SLOTS) */}
      {/* ============================================================ */}
      {(activeSection === 'ALL' || activeSection === 'LL') && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-900/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-lg font-bold text-white">
                  Parking Slot Linked List <span className="font-mono text-indigo-400 font-normal text-sm">(`ParkingSlotLinkedList`)</span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic Singly Linked List holding slot nodes connected via <code className="text-indigo-300">.next</code> pointers.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800 text-indigo-300">
                Size: {linkedList.size} nodes
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                HEAD: <strong className="text-brand-400">{linkedList.head || 'NULL'}</strong>
              </span>
            </div>
          </div>

          {/* Graphical Nodes Pipeline */}
          <div className="overflow-x-auto pb-6 pt-3 px-2 no-scrollbar">
            <div className="flex items-center min-w-max space-x-3">
              {/* HEAD Pointer Tag */}
              <div className="flex flex-col items-center mr-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-400 font-mono px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/30">
                  HEAD
                </span>
                <ArrowDown className="w-4 h-4 text-brand-400 animate-bounce mt-1" />
              </div>

              {/* Linked List Nodes */}
              {linkedList.nodes.map((node, index) => {
                const isOccupied = node.status === 'OCCUPIED';
                const isHead = index === 0;

                return (
                  <React.Fragment key={node.slotId}>
                    {/* Node Container */}
                    <div
                      onClick={() => setInspectedNode({ type: 'LINKED_LIST_NODE', data: node })}
                      className={`relative w-44 rounded-xl p-3 border transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 ${
                        isOccupied
                          ? 'bg-slate-900 border-rose-500/40 hover:border-rose-400 hover:shadow-rose-950/50'
                          : 'bg-slate-900/70 border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-950/50'
                      }`}
                    >
                      {/* Top Node Header */}
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800 text-xs">
                        <span className="font-mono font-black text-white px-1.5 py-0.5 rounded bg-slate-800">
                          {node.slotId}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                          isOccupied ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {node.status}
                        </span>
                      </div>

                      {/* Node Data Content */}
                      <div className="min-h-[50px] text-xs">
                        {isOccupied ? (
                          <div className="space-y-1">
                            <p className="font-mono font-bold text-white truncate">
                              {node.vehicleNumber}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {node.vehicleType} • {node.ownerName || 'Guest'}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-500 text-xs italic">
                            Empty Node (Free)
                          </div>
                        )}
                      </div>

                      {/* Next Pointer Footer */}
                      <div className="pt-1.5 mt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">.next:</span>
                        <span className="font-bold text-indigo-300">
                          {node.nextSlotId ? `➔ ${node.nextSlotId}` : '➔ NULL'}
                        </span>
                      </div>
                    </div>

                    {/* Arrow to Next Node */}
                    <div className="flex items-center text-indigo-400">
                      <ArrowRight className="w-5 h-5 text-indigo-400" />
                    </div>
                  </React.Fragment>
                );
              })}

              {/* NULL Terminator */}
              <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs font-bold">
                NULL
              </div>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-400 overflow-x-auto">
            <span className="text-slate-400 font-bold block mb-1">Text Traversal Representation:</span>
            <span className="text-slate-300">{linkedList.traceString}</span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2 & 3: QUEUE & STACK SPLIT VIEW */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ----------------- WAITING QUEUE (FIFO) ----------------- */}
        {(activeSection === 'ALL' || activeSection === 'QUEUE') && (
          <div className="glass-panel p-6 rounded-2xl border border-cyan-900/40 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-2">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    Waiting Queue <span className="font-mono text-cyan-400 font-normal text-sm">(`WaitingQueue`)</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  First-In-First-Out (FIFO) queue for arriving vehicles when all slots are occupied.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                  Size: {queue.size}
                </span>
              </div>
            </div>

            {queue.size === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-800 rounded-xl">
                <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-xs font-medium">Waiting Queue is Empty</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Vehicles arrive directly at parking slots until capacity is reached.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Pointer Indicators */}
                <div className="flex items-center justify-between text-xs font-mono px-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <span>FRONT Pointer</span>
                    <span className="text-[10px] font-normal text-slate-400">(Next to be allocated)</span>
                  </span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <span>REAR Pointer</span>
                    <span className="text-[10px] font-normal text-slate-400">(Latest enqueued)</span>
                  </span>
                </div>

                {/* Queue Chain Nodes */}
                <div className="space-y-2.5">
                  {queue.items.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => setInspectedNode({ type: 'QUEUE_NODE', data: item })}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:border-cyan-400 ${
                        item.isFront
                          ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-950/40'
                          : item.isRear
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                          {item.position}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-white text-sm">
                              {item.vehicleNumber}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                              {item.vehicleType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.ownerName} • waiting since {new Date(item.waitingSince).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.isFront && (
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            FRONT
                          </span>
                        )}
                        {item.isRear && (
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            REAR
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveWaiting(item.vehicleNumber);
                          }}
                          title="Remove from queue (Cancellation)"
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-[11px] text-cyan-300/80">
                  {queue.traceString}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- PARKING HISTORY STACK (LIFO) ----------------- */}
        {(activeSection === 'ALL' || activeSection === 'STACK') && (
          <div className="glass-panel p-6 rounded-2xl border border-purple-900/40 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-2">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    Parking History Stack <span className="font-mono text-purple-400 font-normal text-sm">(`ParkingHistoryStack`)</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Last-In-First-Out (LIFO) stack recording recently exited vehicle receipts.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300">
                  Depth: {stack.size}
                </span>
                {stack.size > 0 && (
                  <button
                    onClick={onPopHistory}
                    className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-sans text-xs font-bold transition-all shadow-md shadow-purple-950"
                  >
                    Pop TOP
                  </button>
                )}
              </div>
            </div>

            {stack.size === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-800 rounded-xl">
                <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-xs font-medium">History Stack is Empty</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Exiting vehicles will PUSH exit receipts to TOP of stack.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Visual Stack Tower (Top is highest card) */}
                <div className="space-y-2.5">
                  {stack.items.slice(0, 5).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      onClick={() => setInspectedNode({ type: 'STACK_NODE', data: item })}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:border-purple-400 ${
                        item.isTop
                          ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/30'
                          : 'bg-slate-900 border-slate-800 opacity-90'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-center font-mono">
                          <span className={`text-[10px] font-bold block ${item.isTop ? 'text-purple-300' : 'text-slate-400'}`}>
                            {item.isTop ? 'TOP' : `LVL ${item.depth}`}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-white text-sm">
                              {item.vehicleNumber}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                              Slot {item.slotId}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Duration: {item.durationMinutes} mins • Paid: ₹{item.fee}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-mono block">
                          {new Date(item.exitTime).toLocaleTimeString()}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          Receipt Saved
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-[11px] text-purple-300/80">
                  {stack.traceString}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Node Memory Inspector Modal */}
      {inspectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass-panel bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setInspectedNode(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white mb-1">
              Memory Node Inspector
            </h3>
            <p className="text-xs text-brand-300 font-mono mb-4">
              Type: {inspectedNode.type}
            </p>

            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-72">
              {JSON.stringify(inspectedNode.data, null, 2)}
            </pre>

            <div className="mt-4 pt-3 border-t border-slate-800 text-right">
              <button
                onClick={() => setInspectedNode(null)}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
