import React, { useState } from 'react';
import { 
  Search, 
  Car, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  GitBranch,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function VehicleSearchPage({ onExitVehicle }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError('');
      const cleanNum = query.trim().toUpperCase();
      const res = await api.searchVehicle(cleanNum);
      setSearchResult(res);
      setSearchedQuery(cleanNum);
    } catch (err) {
      setError(err.message || 'Search failed');
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const sampleSearches = ['KA01AB1234', 'KA03XY9988', 'MH12CD4567', 'KA09MN4321', 'DL99ZZ0000'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center">
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Vehicle Search & Traversal Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
          Traverse the Singly Linked List linearly from <code className="text-brand-300 font-bold">HEAD</code> to locate a parked vehicle node and inspect its slot assignment.
        </p>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="mt-6 max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              placeholder="Enter Vehicle Plate (e.g. KA01AB1234)"
              className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-white placeholder-slate-500 font-mono text-sm focus:outline-none"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-900/30 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            {loading ? 'Traversing...' : 'Search List'}
          </button>
        </form>

        {/* Quick Samples */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
          <span>Quick Test Samples:</span>
          <div className="flex flex-wrap gap-1.5">
            {sampleSearches.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Search Result Display */}
      {searchResult && (
        <div className="space-y-6">
          {searchResult.found ? (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-slate-900/90 shadow-xl shadow-emerald-950/20">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-400">Vehicle Found in Facility</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Target matched in Linked List node traversal
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  STATUS: PARKED
                </span>
              </div>

              {/* Data Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Vehicle Number</span>
                  <span className="font-mono font-black text-white text-base">
                    {searchResult.slot.vehicleNumber}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Assigned Slot</span>
                  <span className="font-mono font-black text-amber-400 text-base">
                    {searchResult.slot.slotId}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Vehicle Type</span>
                  <span className="font-semibold text-slate-200 text-sm">
                    {searchResult.slot.vehicleType}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Entry Time</span>
                  <span className="font-mono text-slate-200 text-sm">
                    {new Date(searchResult.slot.entryTime).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => onExitVehicle(searchResult.slot.vehicleNumber)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-950 transition-all flex items-center gap-1.5"
                >
                  <span>Checkout & Exit This Vehicle</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center">
              <XCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">
                Vehicle Not Currently Parked
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No active slot in the Linked List contains vehicle <strong className="text-white font-mono">{searchedQuery}</strong>.
              </p>
            </div>
          )}

          {/* Linked List Traversal Steps (Academic Demonstration) */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <GitBranch className="w-4 h-4 text-brand-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Linear Traversal Trace (Step-by-Step Linked List Search)
              </h4>
            </div>

            <div className="space-y-2">
              {searchResult.traversalSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex items-center justify-between text-xs font-mono transition-all ${
                    step.match
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Step {idx + 1}:</span>
                    <span>Node ({step.slotId})</span>
                    <span className="text-slate-400">➔ checked:</span>
                    <span className="font-bold text-white">{step.checkedVehicle}</span>
                  </div>

                  <div>
                    {step.match ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        MATCH FOUND ✓
                      </span>
                    ) : (
                      <span className="text-slate-400">Next Node ➔</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-right text-[11px] font-mono text-slate-400">
              Total Nodes Traversed: {searchResult.traversalSteps.length} • Complexity: O(n)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
