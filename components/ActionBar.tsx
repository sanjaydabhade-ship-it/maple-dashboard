
import React, { useMemo } from 'react';
import { Lead } from '../types';

interface ActionBarProps {
  leads: Lead[];
  onSelect: (id: number) => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ leads, onSelect }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const actions = useMemo(() => {
    return leads.filter(l => {
      const disc = (l.discussion || '').toLowerCase();
      const isToday = l.date === today;
      const needsFollowUp = disc.includes('call') || disc.includes('follow') || disc.includes('visit') || disc.includes('visit again');
      const isHot = l.rating >= 4;
      return isToday && (needsFollowUp || isHot);
    }).slice(0, 5);
  }, [leads, today]);

  if (actions.length === 0) return null;

  return (
    <div className="bg-orange-500/5 border-y border-white/5 py-3 relative overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.1)] animate-pulse-subtle">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-orange-500/20 to-transparent"></div>
      <div className="max-w-[1920px] mx-auto px-4 md:px-10 flex items-center gap-6">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            Critical Action Strip
          </span>
          <div className="h-4 w-px bg-white/10 ml-4"></div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar flex-1">
          {actions.map(lead => (
            <button
              key={lead.id}
              onClick={() => onSelect(lead.id)}
              className="group flex items-center gap-3 bg-white/5 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/30 px-4 py-2 rounded-xl transition-all shrink-0 active:scale-95"
            >
              <div className="text-left">
                <div className="text-[11px] font-black text-white group-hover:text-orange-400 transition-colors">{lead.name}</div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter truncate max-w-[120px]">
                  {lead.discussion.length > 30 ? lead.discussion.substring(0, 30) + '...' : lead.discussion}
                </div>
              </div>
              <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${lead.rating >= 5 ? 'bg-orange-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                {lead.rating >= 5 ? 'Hot' : 'Pending'}
              </div>
            </button>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { box-shadow: 0 0 15px rgba(249,115,22,0.05); }
          50% { box-shadow: 0 0 25px rgba(249,115,22,0.15); }
        }
        .animate-pulse-subtle { animation: pulse-subtle 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default ActionBar;
