import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-slide-up">
      <div className={`p-4 rounded-2xl glass-panel border shadow-2xl flex items-start gap-3 ${
        isSuccess
          ? 'bg-slate-900 border-emerald-500/50 text-emerald-200'
          : isError
          ? 'bg-slate-900 border-rose-500/50 text-rose-200'
          : 'bg-slate-900 border-brand-500/50 text-slate-200'
      }`}>
        <div className="mt-0.5 flex-shrink-0">
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isError ? (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          ) : (
            <Info className="w-5 h-5 text-brand-400" />
          )}
        </div>

        <div className="flex-1">
          <p className="font-bold text-xs uppercase tracking-wider text-white">
            {toast.title || (isSuccess ? 'Success' : isError ? 'Error' : 'Notice')}
          </p>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
          {toast.dsaBadge && (
            <span className="inline-block mt-1.5 font-mono text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
              DSA: {toast.dsaBadge}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
