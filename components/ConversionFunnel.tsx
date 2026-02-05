
import React from 'react';
import { Lead } from '../types';

interface ConversionFunnelProps {
  leads: Lead[];
}

const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ leads }) => {
  const stats = {
    leads: leads.length,
    visits: leads.filter(l => (l.siteVisitStatus || '').toLowerCase().trim() === 'done').length,
    followUp: leads.filter(l => (l.discussion || '').toLowerCase().match(/call|follow|visit|site/)).length,
    hot: leads.filter(l => l.rating >= 4).length,
    closed: leads.filter(l => (l.status || '').toLowerCase().match(/sold|booked/)).length,
  };

  const stages = [
    { label: 'Leads', value: stats.leads, color: 'bg-indigo-500' },
    { label: 'Visits', value: stats.visits, color: 'bg-indigo-400' },
    { label: 'Follow-Up', value: stats.followUp, color: 'bg-orange-400' },
    { label: 'Hot List', value: stats.hot, color: 'bg-orange-500' },
    { label: 'Closed', value: stats.closed, color: 'bg-emerald-500' },
  ];

  return (
    <div className="bg-slate-900/60 rounded-3xl p-8 border border-white/5 shadow-2xl">
      <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Live Conversion Flow</h2>
      <div className="flex items-end gap-1 h-32">
        {stages.map((stage, i) => {
          const height = stats.leads > 0 ? (stage.value / stats.leads) * 100 : 0;
          const prevValue = i > 0 ? stages[i-1].value : stats.leads;
          const dropOff = prevValue > 0 ? (stage.value / prevValue) * 100 : 0;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
              <div className="relative w-full flex flex-col items-center justify-end h-full">
                <div 
                  className={`w-full ${stage.color} rounded-t-lg transition-all duration-1000 group-hover:brightness-125 shadow-lg`} 
                  style={{ height: `${Math.max(height, 2)}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-white tabular-nums">
                    {stage.value}
                  </div>
                </div>
                {i > 0 && (
                  <div className="absolute left-0 bottom-1/2 -translate-x-1/2 translate-y-1/2 z-10">
                    <div className="bg-slate-950 border border-white/10 px-1.5 py-0.5 rounded-full text-[8px] font-black text-slate-400">
                      {dropOff.toFixed(0)}%
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter text-center">{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversionFunnel;
