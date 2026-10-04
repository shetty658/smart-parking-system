import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Database
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminPanel({ 
  dsaState, 
  onRefresh, 
  onPopHistory, 
  onClearHistory,
  onResetSystem 
}) {
  const [newSlotId, setNewSlotId] = useState('');
  const [deleteSlotId, setDeleteSlotId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!newSlotId.trim()) return;

    try {
      setLoading(true);
      setError('');
      setMessage('');
      const res = await api.addSlot(newSlotId.trim().toUpperCase());
      setMessage(`Slot ${res.slot.slotId} appended to Linked List successfully.`);
      setNewSlotId('');
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (e) => {
    e.preventDefault();
    if (!deleteSlotId.trim()) return;

    try {
      setLoading(true);
      setError('');
      setMessage('');
      const res = await api.deleteSlot(deleteSlotId.trim().toUpperCase());
      setMessage(`Slot ${res.deletedSlotId} removed from Linked List.`);
      setDeleteSlotId('');
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Admin Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Administrative Control Center
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              System Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Configure dynamic Linked List capacity, manage waiting queue FIFO states, inspect stack frames, and apply rapid testing presets for presentations.
          </p>
        </div>

        {/* Database indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>MongoDB / Dual Persistence: ACTIVE</span>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Add Slot (Linked List Insert) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
            <Plus className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Add Parking Slot (Linked List Node Insert)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Instantiates a new <code className="text-emerald-300 font-mono">ParkingSlotNode</code> and appends it to the tail of the Singly Linked List (O(n) traversal or O(1)).
          </p>

          <form onSubmit={handleAddSlot} className="flex gap-2">
            <input
              type="text"
              value={newSlotId}
              onChange={(e) => setNewSlotId(e.target.value.toUpperCase())}
              placeholder="Slot ID (e.g. P-11)"
              className="flex-1 px-4 py-2.5 rounded-xl glass-input text-white font-mono text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Insert Slot</span>
            </button>
          </form>
        </div>

        {/* Card 2: Delete Slot (Linked List Delete) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
            <Trash2 className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Remove Parking Slot (Linked List Node Delete)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Finds slot node and deletes it by rewiring pointers: <code className="text-rose-300 font-mono">prev.next = current.next</code>. Slot must be AVAILABLE.
          </p>

          <form onSubmit={handleDeleteSlot} className="flex gap-2">
            <input
              type="text"
              value={deleteSlotId}
              onChange={(e) => setDeleteSlotId(e.target.value.toUpperCase())}
              placeholder="Slot ID to delete (e.g. P-10)"
              className="flex-1 px-4 py-2.5 rounded-xl glass-input text-white font-mono text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-950 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Node</span>
            </button>
          </form>
        </div>
      </div>

      {/* Card 3: Stack Controls */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Parking History Stack Management (LIFO)
            </h3>
          </div>
          <span className="text-xs font-mono text-purple-300">
            Depth: {dsaState ? dsaState.stack.size : 0} items
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onPopHistory}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Pop Latest Record (TOP)</span>
          </button>

          <button
            onClick={onClearHistory}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 font-bold text-xs transition-all"
          >
            <span>Clear Entire Stack (Reset TOP to NULL)</span>
          </button>
        </div>
      </div>

      {/* Card 4: System Reset & College Demo Presets */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Viva Presentation & Rapid Demonstration Presets
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          One-click test environments designed to instantly demonstrate all 3 data structures to professors without manual typing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onResetSystem('DEFAULT')}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500 text-left transition-all group"
          >
            <span className="text-xs font-bold text-brand-300 block mb-1 group-hover:text-brand-200">
              Preset 1: Standard College Demo (Recommended)
            </span>
            <span className="text-[11px] text-slate-400 block">
              Loads 10 slots (6 occupied, 4 free), 2 vehicles in Waiting Queue, and 3 exit records in Stack.
            </span>
          </button>

          <button
            onClick={() => onResetSystem('EMPTY')}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-left transition-all group"
          >
            <span className="text-xs font-bold text-amber-300 block mb-1 group-hover:text-amber-200">
              Preset 2: Clean Slate (Empty Lot)
            </span>
            <span className="text-[11px] text-slate-400 block">
              Resets facility to 6 completely empty slots, empty queue, and empty history stack.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
