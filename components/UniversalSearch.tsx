
import React, { useState, useMemo } from 'react';
import { Lead } from '../types';

interface UniversalSearchProps {
  leads: Lead[];
  inputRef?: React.RefObject<HTMLInputElement>;
}

const UniversalSearch: React.FC<UniversalSearchProps> = ({ leads, inputRef }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeads = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lowerSearch = searchTerm.toLowerCase();
    return leads.filter((lead) => {
      return (
        lead.name.toLowerCase().includes(lowerSearch) ||
        lead.mobile.toLowerCase().includes(lowerSearch) ||
        lead.source.toLowerCase().includes(lowerSearch) ||
        lead.employeeName.toLowerCase().includes(lowerSearch) ||
        lead.discussion.toLowerCase().includes(lowerSearch) ||
        lead.date.toLowerCase().includes(lowerSearch) ||
        lead.budget.toLowerCase().includes(lowerSearch) ||
        lead.flatType.toLowerCase().includes(lowerSearch) ||
        (lead.siteVisitStatus || '').toLowerCase().includes(lowerSearch)
      );
    });
  }, [leads, searchTerm]);

  return (
    <div className="bg-slate-900/60 rounded-3xl lg:rounded-[2.5rem] p-6 md:p-8 lg:p-10 border border-white/5 shadow-2xl space-y-8 glass-morphism">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Omnichannel Database Access</h2>
          <p className="text-[8px] lg:text-[10px] text-orange-400 font-bold uppercase tracking-[0.2em] animate-pulse">Live Query Active</p>
        </div>
        <div className="relative flex-1 max-w-xl group">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Intelligence... (Press / to focus)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl py-4 pl-6 pr-12 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] focus:shadow-[0_0_20px_rgba(249,115,22,0.2)]"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/5 shadow-2xl">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="py-5 px-6 text-[9px] font-black text-slate-500 uppercase tracking-widest w-28">Entry</th>
              <th className="py-5 px-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Prospect</th>
              <th className="py-5 px-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Contact</th>
              <th className="py-5 px-6 text-[9px] font-black text-slate-500 uppercase tracking-widest w-24">Yield</th>
              <th className="py-5 px-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Channel</th>
              <th className="py-5 px-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Visit</th>
              <th className="py-5 px-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Rep</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-white/5 transition-all group">
                <td className="py-5 px-6 text-[10px] text-slate-500 font-mono tracking-tighter">{lead.date}</td>
                <td className="py-5 px-6 text-[12px] font-black text-slate-100 group-hover:text-orange-400 transition-colors">{lead.name}</td>
                <td className="py-5 px-6 text-[11px] text-indigo-400 font-bold tabular-nums">{lead.mobile}</td>
                <td className="py-5 px-6 text-[11px] text-emerald-400 font-black">{lead.budget}</td>
                <td className="py-5 px-6">
                  <span className="text-[9px] font-black text-slate-400 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10 group-hover:bg-white/10">{lead.source}</span>
                </td>
                <td className="py-5 px-6">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border transition-colors ${
                    (lead.siteVisitStatus || '').toLowerCase().trim() === 'done' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : 'bg-white/5 text-slate-600 border-white/10'
                  }`}>
                    {(lead.siteVisitStatus || 'PENDING')}
                  </span>
                </td>
                <td className="py-5 px-6 text-[11px] text-slate-400 group-hover:text-slate-200 transition-colors">{lead.employeeName}</td>
              </tr>
            ))}
            {searchTerm && filteredLeads.length === 0 && (
              <tr>
                <td colSpan={7} className="py-32 text-center">
                  <div className="text-4xl mb-4 opacity-10">🔍</div>
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">No Intelligence Matching Query</p>
                </td>
              </tr>
            )}
            {!searchTerm && (
              <tr>
                <td colSpan={7} className="py-20 text-center opacity-30">
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] italic">Search across name, mobile, rep, or discussion logs</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UniversalSearch;
