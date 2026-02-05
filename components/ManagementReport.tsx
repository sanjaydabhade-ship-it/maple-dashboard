
import React from 'react';
import { Lead, DashboardMetrics } from '../types';

interface ManagementReportProps {
  metrics: { today: DashboardMetrics; mtd: DashboardMetrics; ytd: DashboardMetrics };
  leads: Lead[];
  topProspects: Lead[];
  leaderboard: [string, { visits: number; leads: number }][];
  currentTime: Date;
}

const ManagementReport: React.FC<ManagementReportProps> = ({ metrics, leads, topProspects, leaderboard, currentTime }) => {
  const getDaysOld = (dateStr: string) => {
    const leadDate = new Date(dateStr);
    if (isNaN(leadDate.getTime())) return 0;
    const diffTime = Math.abs(new Date().getTime() - leadDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const urgentLeads = leads.filter(l => getDaysOld(l.date) > 7 && (l.siteVisitStatus || '').toLowerCase().trim() !== 'done').slice(0, 4);
  const followUpLeads = leads.filter(l => getDaysOld(l.date) >= 3 && getDaysOld(l.date) <= 7 && (l.siteVisitStatus || '').toLowerCase().trim() !== 'done').slice(0, 4);

  const getRatingColor = (rating: number) => {
    if (rating >= 5) return 'text-amber-500'; // Gold
    if (rating >= 3) return 'text-yellow-500'; // Yellow
    return 'text-red-500'; // Red
  };

  const generateStrategicSummary = () => {
    const conversion = metrics.mtd.ratio;
    const urgentCount = leads.filter(l => getDaysOld(l.date) > 7 && (l.siteVisitStatus || '').toLowerCase() !== 'done').length;
    let summary = `MTD Conversion is at ${conversion.toFixed(1)}%. `;
    if (conversion < 40) summary += "Conversion is below benchmark; team must pivot to site-visit centric follow-ups. ";
    else summary += "Strong performance in site conversion. Keep the momentum. ";
    if (urgentCount > 0) summary += `Attention: ${urgentCount} leads leaking past 7 days. `;
    summary += "Prioritize Hot List for immediate bookings.";
    return summary;
  };

  return (
    <div 
      className="bg-white text-slate-900 p-6 font-sans flex flex-col overflow-hidden border-[12px] border-slate-50 box-border"
      style={{ width: '420mm', height: '296mm' }} // Slightly less than 297mm to avoid overflow page split
    >
      {/* Header Area - More Compact */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">EXECUTIVE SALES INTELLIGENCE</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.4em] mt-1">MAPLE DASHBOARD | DURGA VIHAR RESIDENCY</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">REPORT GENERATED</p>
          <p className="text-lg font-black text-slate-800 tabular-nums">
            {currentTime.toLocaleDateString('en-IN')} @ {currentTime.toLocaleTimeString('en-IN')}
          </p>
        </div>
      </div>

      <div className="h-0.5 bg-slate-900 w-full mb-6"></div>

      {/* Primary KPI Row - Compacted */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 rounded-2xl p-5 text-white">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">TODAY'S LEADS</p>
          <h3 className="text-4xl font-black">{metrics.today.totalLeads}</h3>
        </div>
        <div className="bg-indigo-600 rounded-2xl p-5 text-white">
          <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest mb-2">TODAY'S VISITS</p>
          <h3 className="text-4xl font-black">{metrics.today.siteVisits}</h3>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">MTD CONVERSION</p>
          <h3 className="text-4xl font-black text-emerald-600">{metrics.mtd.ratio.toFixed(1)}%</h3>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">TOTAL MTD LEADS</p>
          <h3 className="text-4xl font-black text-slate-900">{metrics.mtd.totalLeads}</h3>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left Column: Prospects & Leaderboard */}
        <div className="col-span-8 flex flex-col gap-6 min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-amber-500 rounded text-white flex items-center justify-center text-[10px]">★</span>
              TOP 10 PRIORITY CLOSING LIST
            </h2>
            <div className="border border-slate-200 rounded-2xl overflow-hidden h-full">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="py-2 px-5 text-[9px] font-black uppercase text-slate-500 w-1/3">CLIENT NAME</th>
                    <th className="py-2 px-5 text-[9px] font-black uppercase text-slate-500">BUDGET</th>
                    <th className="py-2 px-5 text-[9px] font-black uppercase text-slate-500">REP</th>
                    <th className="py-2 px-5 text-[9px] font-black uppercase text-slate-500 text-right w-24">RATING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topProspects.slice(0, 10).map((lead) => (
                    <tr key={lead.id} className="even:bg-slate-50/30">
                      <td className="py-2 px-5 font-black text-base text-slate-800 truncate">{lead.name}</td>
                      <td className="py-2 px-5 font-bold text-slate-500 uppercase text-xs">{lead.budget}</td>
                      <td className="py-2 px-5 font-bold text-indigo-600 uppercase text-xs truncate">{lead.employeeName}</td>
                      <td className="py-2 px-5 text-right">
                        <span className={`text-base font-black ${getRatingColor(lead.rating)}`}>★ {lead.rating}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="h-1/4">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-3">EXECUTIVE LEADERBOARD</h2>
            <div className="grid grid-cols-4 gap-3">
              {leaderboard.map(([name, stats]) => (
                <div key={name} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase mb-0.5 truncate">{name}</span>
                  <span className="text-base font-black text-indigo-600 leading-none">{stats.visits} VISITS</span>
                  <span className="text-[9px] font-bold text-slate-400 mt-1">{stats.leads} Leads handled</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Strategic Summary & Aging Panels */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0 overflow-hidden">
          <div className="bg-indigo-900 rounded-[1.5rem] p-6 text-white shrink-0">
            <h2 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-2">ACTIONABLE SUMMARY</h2>
            <p className="text-base font-medium leading-snug italic text-indigo-50">
              "{generateStrategicSummary()}"
            </p>
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">
            <div className="bg-red-50 border border-red-100 rounded-[1.5rem] p-4 flex-1 min-h-0 flex flex-col overflow-hidden">
              <h3 className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>URGENT ACTION (&gt;7D)</span>
                <span className="bg-red-200 text-red-700 px-2 py-0.5 rounded-full">{urgentLeads.length}</span>
              </h3>
              <div className="space-y-2 flex-1 overflow-hidden">
                {urgentLeads.map(l => (
                  <div key={l.id} className="bg-white p-2.5 rounded-xl border border-red-100 shadow-sm flex justify-between items-center">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">{l.name}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase truncate">{l.employeeName} | {l.budget}</p>
                    </div>
                    <span className="text-[9px] font-black text-red-500 shrink-0 ml-2">{getDaysOld(l.date)}d OLD</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-[1.5rem] p-4 flex-1 min-h-0 flex flex-col overflow-hidden">
              <h3 className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>FOLLOW-UP PIPELINE (3-7D)</span>
                <span className="bg-amber-200 text-amber-700 px-2 py-0.5 rounded-full">{followUpLeads.length}</span>
              </h3>
              <div className="space-y-2 flex-1 overflow-hidden">
                {followUpLeads.map(l => (
                  <div key={l.id} className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-sm flex justify-between items-center">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">{l.name}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase truncate">{l.employeeName} | {l.budget}</p>
                    </div>
                    <span className="text-[9px] font-black text-amber-500 shrink-0 ml-2">{getDaysOld(l.date)}d OLD</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Area - Smaller */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
          INTERNAL MANAGEMENT DOCUMENT | SYSTEM ID: MAPLE-E-SUMMARY-ONE
        </p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          EXECUTIVE ONE-PAGE SUMMARY | PAGE 01
        </p>
      </div>
    </div>
  );
};

export default ManagementReport;
