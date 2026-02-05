
import React from 'react';
import { Lead } from '../types';
import MoodBadge from './MoodBadge';
import Timeline from './Timeline';

interface ClientDetailsProps {
  lead: Lead;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ lead }) => {
  const getStatusRing = () => {
    if (lead.rating >= 5) return 'ring-2 ring-orange-500 ring-offset-4 ring-offset-slate-950';
    if (lead.rating >= 4) return 'ring-2 ring-indigo-500 ring-offset-4 ring-offset-slate-950';
    return 'ring-1 ring-white/10 ring-offset-2 ring-offset-slate-950';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lead Profile</label>
          <MoodBadge discussion={lead.discussion} />
        </div>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-xl shadow-lg ${getStatusRing()}`}>
             👤
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight leading-none">{lead.name}</h3>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">ID: #{lead.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Mobile</label>
          <div className="text-sm font-bold text-indigo-400 cursor-pointer hover:underline transition-all active:scale-95">{lead.mobile}</div>
        </div>
        <div>
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Budget</label>
          <div className="text-sm font-black text-emerald-400">{lead.budget}</div>
        </div>
        <div>
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Source</label>
          <div className="text-[10px] font-black text-slate-300 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10 inline-block">{lead.source}</div>
        </div>
        <div>
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Executive</label>
          <div className="text-sm font-bold text-slate-200">{lead.employeeName}</div>
        </div>
      </div>

      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2 group hover:border-orange-500/20 transition-all shadow-inner">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Strategic Log</label>
        <p className="text-xs text-slate-400 italic leading-relaxed">"{lead.discussion || 'Awaiting first strategy log update.'}"</p>
      </div>

      <Timeline lead={lead} />

      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quality Rating</div>
        <div className="flex gap-1.5 text-base text-amber-500">
           {[...Array(5)].map((_, i) => (
             <span key={i} className={i < lead.rating ? 'opacity-100 animate-[bounceIn_0.3s_ease-out]' : 'opacity-10'}>★</span>
           ))}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceIn { 0% { scale: 0; } 80% { scale: 1.2; } 100% { scale: 1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default ClientDetails;
