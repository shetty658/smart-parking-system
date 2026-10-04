import React, { useState } from 'react';
import { 
  X, 
  LogOut, 
  Car, 
  Layers, 
  Clock, 
  AlertCircle,
  ArrowRight,
  GitBranch
} from 'lucide-react';

export default function ExitVehicleModal({ isOpen, onClose, onExit, parkedSlots, waitingCount }) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const occupiedSlots = parkedSlots.filter(s => s.status === 'OCCUPIED');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      setError('Please provide a vehicle number.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onExit(vehicleNumber.trim().toUpperCase());
      setVehicleNumber('');
      onClose();
    } catch (err) {
      setError(err.message || 'Vehicle exit failed');
    } finally {
      setLoading(false);
    }
  };

  const selectParked = (num) => {
    setVehicleNumber(num);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg glass-panel bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Vehicle Exit & Checkout</h3>
            <p className="text-xs text-slate-400">
              DSA Action: Linked List Release ➔ Stack PUSH ➔ Queue DEQUEUE (if waiting)
            </p>
          </div>
        </div>

        {/* DSA Mechanics Explainer */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs mb-5 space-y-1.5 text-slate-300">
          <div className="flex items-center gap-2 text-brand-300 font-bold">
            <GitBranch className="w-4 h-4" />
            <span>Underlying DSA Algorithm Workflow:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1 text-[11px]">
            <li>Search Linked List by vehicle number (O(n) linear traversal).</li>
            <li>Free slot node: set status = 'AVAILABLE', clear vehicle data.</li>
            <li>Push exit record to TOP of Parking History Stack (O(1) LIFO).</li>
            {waitingCount > 0 && (
              <li className="text-cyan-300 font-semibold">
                Waiting Queue has {waitingCount} vehicles: Dequeue FRONT node and auto-assign to freed slot!
              </li>
            )}
          </ol>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Enter Vehicle Number to Exit
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              placeholder="e.g. KA01AB1234"
              required
              className="w-full px-4 py-2.5 rounded-xl glass-input text-white placeholder-slate-500 font-mono text-sm focus:outline-none"
            />
          </div>

          {/* Quick Click Parked Vehicles */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Or Click a Currently Parked Vehicle ({occupiedSlots.length} available):
            </label>
            {occupiedSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-800 rounded-xl bg-slate-950/40">
                {occupiedSlots.map((s) => (
                  <button
                    type="button"
                    key={s.slotId}
                    onClick={() => selectParked(s.vehicleNumber)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-all ${
                      vehicleNumber === s.vehicleNumber
                        ? 'bg-rose-500/20 border-rose-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-mono font-bold text-white block">{s.vehicleNumber}</span>
                      <span className="text-[10px] text-slate-400">{s.ownerName || 'Guest'}</span>
                    </div>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
                      {s.slotId}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No vehicles currently parked.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 font-bold text-sm text-white shadow-lg shadow-rose-950/30 transition-all active:scale-[0.98]"
            >
              {loading ? 'Processing...' : 'Confirm Exit & Push'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
