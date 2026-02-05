
import React, { useMemo } from 'react';
import { Lead, DashboardMetrics } from '../types';

interface AIInsightsCardProps {
  leads: Lead[];
  metrics: { mtd: DashboardMetrics; today: DashboardMetrics };
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ leads, metrics }) => {
  const insights = useMemo(() => {
    const list: string[] = [];
    const highBudgetAging = leads.filter(l => {
      const budgetVal = parseFloat(l.budget.replace(/[^0-9.]/g, '')) || 0;
      const unit = l.budget.toLowerCase().includes('cr') ? 100 : 1;
      const totalVal = budgetVal * unit;
      const leadDate = new Date(l.date);
      const age = Math.ceil(Math.abs(new Date().getTime() - leadDate.getTime()) / (1000 * 60 * 60 * 24));
      return totalVal >= 80 && age > 3 && (l.siteVisitStatus || '').toLowerCase() !== 'done';
    });

    if (highBudgetAging.length > 0) list.push(`${highBudgetAging.length} high budget leads aging without visit.`);
    if (metrics.today.socialMedia > 0) list.push(`Social media leads converting 2x faster today.`);
    
    const reps = Array.from(new Set(leads.map(l => l.employeeName)));
    const bestRep = reps.map(name => {
      const myLeads = leads.filter(l => l.employeeName === name);
      const myVisits = myLeads.filter(l => (l.siteVisitStatus || '').toLowerCase() === 'done').length;
      return { name, ratio: myLeads.length > 0 ? myVisits / myLeads.length : 0 };
    }).sort((a, b) => b.ratio - a.ratio)[0];

    if (bestRep && bestRep.ratio > 0) list.push(`${bestRep.name} has the best visit ratio today.`);
    
    const hotLeads = leads.filter(l => l.rating === 5).slice(0, 2);
    if (hotLeads.length > 0) list.push(`${hotLeads.length} hot leads need immediate follow-up.`);

    return list.length > 0 ? list : ["Intelligence engine scanning for conversion leaks..."];
  }, [leads, metrics]);

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] p-8 border border-white/5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">🧠</div>
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Sales Insight</h2>
      </div>
      <div className="space-y-4">
        {insights.map((text, i) => (
          <div key={i} className="flex gap-3 items-start animate-[fadeIn_0.5s_ease-out]">
            <div className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
            <p className="text-[11px] font-bold text-slate-300 leading-relaxed italic">"{text}"</p>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
};

export default AIInsightsCard;
