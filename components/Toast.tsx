
import React, { useEffect } from 'react';

interface ToastProps {
  id: number;
  name: string;
  source: string;
  budget: string;
  onRemove: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ id, name, source, budget, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div className="bg-slate-900 border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.15)] rounded-2xl p-4 flex gap-4 items-center animate-[slideInToast_0.3s_ease-out]">
      <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-lg">✨</div>
      <div className="flex-1">
        <h4 className="text-[11px] font-black text-white uppercase tracking-widest">New Lead Detected</h4>
        <p className="text-[13px] font-bold text-slate-300">{name} • {source}</p>
        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter mt-0.5">{budget}</p>
      </div>
      <button onClick={() => onRemove(id)} className="text-slate-600 hover:text-white transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
      <style>{`
        @keyframes slideInToast {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: any[], onRemove: (id: number) => void }> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[200] w-full max-w-sm px-4">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onRemove={onRemove} />
      ))}
    </div>
  );
};

export default ToastContainer;
