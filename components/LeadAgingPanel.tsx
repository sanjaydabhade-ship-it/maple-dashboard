
import React, { useMemo } from 'react';
import { Lead } from '../types';
import MoodBadge from './MoodBadge';

interface LeadAgingPanelProps {
  leads: Lead[];
  onSelectLead: (id: number) => void;
  selectedLeadId: number | null;
}

const LeadAgingPanel: React.FC<LeadAgingPanelProps> = ({ leads, onSelectLead, selectedLeadId }) => {
  const getDaysOld = (dateStr: string) => {
    const leadDate = new Date(dateStr);
    if (isNaN(leadDate.getTime())) return 0;
    const diffTime = Math.abs(new Date().getTime() - leadDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const categories = [
    { title: 'Urgent Action (>7 Days)', filter: (l: Lead) => getDaysOld(l.date) > 7 && (l.siteVisitStatus || '').toLowerCase().trim() !== 'done', color: 'text-red-400', bg: 'bg-red-500/5', animate: true },
    { title: 'Follow-up (3-7 Days)', filter: (l: Lead) => getDaysOld(l.date) >= 3 && getDaysOld(l.date) <= 7 && (l.siteVisitStatus || '').toLowerCase().trim() !== 'done', color: 'text-orange-400', bg: 'bg-orange-500/5', animate: false },
    { title: 'Fresh Leads (0-2 Days)', filter: (l: Lead) => getDaysOld(l.date) < 3, color: 'text-indigo-400', bg: 'bg-indigo-500/5', animate: false },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {categories.map((cat, idx) => {
        const catLeads = useMemo(() => {
          return leads
            .filter(cat.filter)
            .sort((a, b) => {
              if (b.rating !== a.rating) return b.rating - a.rating;
              return getDaysOld(b.date) - getDaysOld(a.date);
            })
            .slice(0, 10);
        }, [leads, cat.filter]);

        return (
          <div key={idx} className={`rounded-3xl p-6 border border-white/5 ${cat.bg} flex flex-col group/panel transition-all hover:border-white/10 ${cat.animate ? 'animate-vibrate-subtle' : ''}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${cat.color}`}>{cat.title}</h3>
              <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">{catLeads.length}</span>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {catLeads.map((lead) => {
                const age = getDaysOld(lead.date);
                return (
                  <button
                    key={lead.id}
                    onClick={() => onSelectLead(lead.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-2 ${
                      selectedLeadId === lead.id ? 'bg-white/10 border-white/20 shadow-lg' : 'bg-slate-900/40 border-transparent hover:border-white/10 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-100 truncate pr-2 group-hover:text-orange-400 transition-colors">{lead.name}</span>
                      <span className="text-[9px] font-black text-slate-500 tabular-nums uppercase">{age}d Old</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-black uppercase text-indigo-400/70">{lead.employeeName}</span>
                       <span className="text-[8px] text-slate-700">•</span>
                       <span className="text-[8px] font-black uppercase text-emerald-400">{lead.budget}</span>
                       <div className="flex-1"></div>
                       <MoodBadge discussion={lead.discussion} />
                    </div>
                    
                    <p className="text-[10px] text-slate-500 line-clamp-2 italic leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">"{lead.discussion || 'Awaiting update...'}"</p>
                  </button>
                );
              })}
              {catLeads.length === 0 && (
                <div className="text-center py-20 text-[10px] font-black text-slate-700 uppercase tracking-widest opacity-20 italic">No Active Pipeline</div>
              )}
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes vibrate-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }
        .animate-vibrate-subtle { animation: vibrate-subtle 4s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default LeadAgingPanel;
