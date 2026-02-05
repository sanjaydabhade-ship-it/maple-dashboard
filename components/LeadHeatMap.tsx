
import React from 'react';
import { Lead } from '../types';

interface LeadHeatMapProps {
  leads: Lead[];
}

const LeadHeatMap: React.FC<LeadHeatMapProps> = ({ leads }) => {
  const getDaysOld = (dateStr: string) => {
    const leadDate = new Date(dateStr);
    if (isNaN(leadDate.getTime())) return 0;
    const diffTime = Math.abs(new Date().getTime() - leadDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getBudgetTier = (budget: string) => {
    const val = parseFloat(budget.replace(/[^0-9.]/g, '')) || 0;
    const unit = budget.toLowerCase().includes('cr') ? 100 : 1;
    const totalVal = val * unit;
    if (totalVal >= 100) return 4; // 1Cr+
    if (totalVal >= 75) return 3; // 75L+
    if (totalVal >= 50) return 2; // 50L+
    return 1; // <50L
  };

  const yLabels = ["< 50L", "50L - 75L", "75L - 1Cr", "1Cr +"];
  const xLabels = ["0-2d", "3-5d", "6-10d", "11-15d", "15d+"];

  const getAgeBucket = (days: number) => {
    if (days <= 2) return 0;
    if (days <= 5) return 1;
    if (days <= 10) return 2;
    if (days <= 15) return 3;
    return 4;
  };

  const getDotColor = (days: number) => {
    if (days <= 2) return 'bg-emerald-500 shadow-emerald-500/50';
    if (days <= 7) return 'bg-orange-500 shadow-orange-500/50';
    return 'bg-red-500 shadow-red-500/50';
  };

  return (
    <div className="bg-slate-900/60 rounded-3xl p-6 border border-white/5 shadow-2xl backdrop-blur-xl">
      <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Revenue Heat Map (Aging vs Budget)</h2>
      <div className="relative h-64 flex flex-col">
        <div className="flex-1 grid grid-cols-5 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-4 pointer-events-none border-l border-b border-white/10">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="border-t border-r border-white/5"></div>
            ))}
          </div>

          {/* Leads as dots */}
          {leads.slice(0, 50).map((lead) => {
            const days = getDaysOld(lead.date);
            const ageBucket = getAgeBucket(days);
            const budgetTier = getBudgetTier(lead.budget) - 1;
            
            // Random offset for visibility if they land in same cell
            const randomX = (Math.random() - 0.5) * 15;
            const randomY = (Math.random() - 0.5) * 15;

            return (
              <div 
                key={lead.id}
                className="absolute transition-all hover:scale-150 cursor-pointer group"
                style={{
                  left: `${(ageBucket * 20) + 10}%`,
                  bottom: `${(budgetTier * 25) + 12.5}%`,
                  transform: `translate(${randomX}px, ${randomY}px)`
                }}
              >
                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${getDotColor(days)} animate-pulse`}></div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                  <div className="bg-slate-950 border border-white/10 p-3 rounded-xl shadow-2xl text-[10px] whitespace-nowrap">
                    <p className="font-black text-white">{lead.name}</p>
                    <p className="text-slate-400">{lead.employeeName} | {lead.budget}</p>
                    <p className="text-slate-500 italic mt-1 max-w-[150px] truncate">{lead.discussion}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Labels */}
        <div className="grid grid-cols-5 mt-3">
          {xLabels.map((l, i) => (
            <div key={i} className="text-[9px] font-bold text-slate-600 text-center uppercase tracking-tighter">{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadHeatMap;
