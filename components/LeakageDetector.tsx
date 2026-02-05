
import React from 'react';
import { Lead } from '../types';

interface LeakageDetectorProps {
  leads: Lead[];
}

const LeakageDetector: React.FC<LeakageDetectorProps> = ({ leads }) => {
  const getDaysOld = (dateStr: string) => {
    const leadDate = new Date(dateStr);
    if (isNaN(leadDate.getTime())) return 0;
    const diffTime = Math.abs(new Date().getTime() - leadDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const highValueAging = leads.filter(l => {
    const budgetVal = parseFloat(l.budget.replace(/[^0-9.]/g, '')) || 0;
    const unit = l.budget.toLowerCase().includes('cr') ? 100 : 1;
    const totalVal = budgetVal * unit;
    const age = getDaysOld(l.date);
    const isSold = (l.status || '').toLowerCase() === 'sold';
    return totalVal >= 60 && age > 5 && !isSold;
  }).slice(0, 4);

  if (highValueAging.length === 0) return null;

  return (
    <div className="bg-red-950/20 border border-red-500/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.1)]">
      <div className="bg-red-500/10 px-6 py-2 border-b border-red-500/20 flex justify-between items-center">
        <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          Revenue Leakage Alert (High-Value Aging)
        </h3>
        <span className="text-[8px] font-bold text-red-500 uppercase">Immediate Intervention Required</span>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {highValueAging.map((lead) => (
          <div key={lead.id} className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl hover:bg-red-500/10 transition-all group cursor-default">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-black text-slate-100 group-hover:text-red-400">{lead.name}</span>
              <span className="text-[10px] font-black text-red-500">{lead.budget}</span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
              <span>{lead.employeeName}</span>
              <span className="text-red-400">{getDaysOld(lead.date)} Days Old</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeakageDetector;
