
import React from 'react';
import { Lead } from '../types';

interface KanbanBoardProps {
  leads: Lead[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads }) => {
  const columns = [
    { title: 'New / Untouched', filter: (l: Lead) => l.rating === 0 && !(l.discussion || '').toLowerCase().includes('lost'), color: 'border-t-slate-500 bg-slate-500/5' },
    { title: 'Hot (Follow-up)', filter: (l: Lead) => l.rating === 5, color: 'border-t-red-500 bg-red-500/5' },
    { title: 'Warm (Nurture)', filter: (l: Lead) => l.rating === 4, color: 'border-t-orange-500 bg-orange-500/5' },
    { title: 'Negotiation', filter: (l: Lead) => l.rating === 3, color: 'border-t-yellow-500 bg-yellow-500/5' },
    { title: 'Cold', filter: (l: Lead) => l.rating === 1 || l.rating === 2, color: 'border-t-blue-500 bg-blue-500/5' },
    { title: 'Lost', filter: (l: Lead) => (l.discussion || '').toLowerCase().includes('lost') || (l.rating === 0 && (l.discussion || '').length > 0), color: 'border-t-slate-800 bg-slate-800/5' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {columns.map((col, idx) => {
        const columnLeads = leads.filter(col.filter);
        return (
          <div key={idx} className={`flex-shrink-0 w-64 rounded-xl border-t-4 p-4 shadow-xl ${col.color}`}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-black text-[11px] text-slate-300 uppercase tracking-wider">{col.title}</h3>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded-full font-bold text-slate-500">{columnLeads.length}</span>
            </div>
            <div className="space-y-3">
              {columnLeads.map((lead) => (
                <div key={lead.id} className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/50 shadow-sm hover:border-indigo-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-slate-100 text-[13px] group-hover:text-indigo-400">{lead.name}</div>
                    <div className="text-[8px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-black uppercase tracking-tighter">{lead.source}</div>
                  </div>
                  <div className="text-[9px] text-slate-500 mb-2 font-medium">Sales: {lead.employeeName}</div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 italic mb-2 leading-relaxed opacity-80 group-hover:opacity-100">"{lead.discussion}"</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/40">
                    <span className="text-[10px] font-black text-emerald-500/80">{lead.budget}</span>
                    <span className="text-[10px] font-bold text-yellow-500/80 flex items-center gap-1">★ {lead.rating}</span>
                  </div>
                </div>
              ))}
              {columnLeads.length === 0 && (
                <div className="text-center text-slate-700 text-[10px] py-10 uppercase font-black tracking-widest opacity-20">No Leads</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
