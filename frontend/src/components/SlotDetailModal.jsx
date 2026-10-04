import React from 'react';
import { 
  X, 
  Car, 
  User, 
  Clock, 
  CreditCard, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  GitBranch
} from 'lucide-react';

export default function SlotDetailModal({ slot, onClose, onExitVehicle, onParkInSlot }) {
  if (!slot) return null;

  const isOccupied = slot.status === 'OCCUPIED';

  const calculateDuration = (entryTime) => {
    if (!entryTime) return 0;
    const start = new Date(entryTime).getTime();
    const diff = Math.max(0, Date.now() - start);
    return Math.max(1, Math.round(diff / (1000 * 60)));
  };

  const durationMins = calculateDuration(slot.entryTime);
  const hourlyRate = slot.vehicleType === 'Bike' ? 10 : slot.vehicleType === 'SUV' ? 40 : 30;
  const estimatedFee = Math.ceil(durationMins / 60) * hourlyRate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md glass-panel bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-lg border ${
            isOccupied ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
          }`}>
            {slot.slotId}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">Parking Slot {slot.slotId}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                isOccupied ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {slot.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Linked List Node #{slot.index !== undefined ? slot.index + 1 : '—'}
            </p>
          </div>
        </div>

        {/* DSA Pointer Info */}
        <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-brand-400" />
              <span>Current Node Pointer:</span>
            </span>
            <span className="font-bold text-brand-300">slotNode({slot.slotId})</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className="text-slate-400">Next Node (`.next`):</span>
            <span className="text-amber-400 font-bold">
              {slot.nextSlotId ? `➔ ${slot.nextSlotId}` : '➔ NULL (Tail)'}
            </span>
          </div>
        </div>

        {/* Occupied Details */}
        {isOccupied ? (
          <div className="space-y-3 mb-6">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center gap-2">
                  <Car className="w-4 h-4 text-indigo-400" />
                  Vehicle Number
                </span>
                <span className="font-mono font-bold text-white text-base tracking-wider">
                  {slot.vehicleNumber}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Vehicle Type</span>
                <span className="font-medium text-slate-200 px-2 py-0.5 rounded bg-slate-800 text-xs">
                  {slot.vehicleType || 'Car'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  Owner Name
                </span>
                <span className="font-medium text-slate-200">{slot.ownerName || 'Guest'}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Parked Since
                </span>
                <span className="font-mono text-slate-300 text-xs">
                  {slot.entryTime ? new Date(slot.entryTime).toLocaleTimeString() : 'N/A'}
                  <span className="text-slate-400 ml-1">({durationMins} mins ago)</span>
                </span>
              </div>

              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-700/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  Estimated Parking Fee
                </span>
                <span className="font-black text-emerald-400 text-base">
                  ₹{estimatedFee}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onExitVehicle(slot.vehicleNumber);
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <LogOut className="w-4 h-4" />
              <span>Process Exit & Push to Stack</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-white text-base mb-1">Slot is Completely Free</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-5">
              This slot is ready to receive a new vehicle or auto-assign from the waiting queue.
            </p>

            <button
              onClick={() => {
                onParkInSlot(slot);
                onClose();
              }}
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 inline-flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Park Vehicle Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
