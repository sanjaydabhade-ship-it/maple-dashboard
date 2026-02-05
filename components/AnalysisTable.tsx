
import React from 'react';
import { DashboardMetrics } from '../types';

interface AnalysisTableProps {
  metrics: {
    today: DashboardMetrics;
    mtd: DashboardMetrics;
    ytd: DashboardMetrics;
  };
}

const AnalysisTable: React.FC<AnalysisTableProps> = ({ metrics }) => {
  const rows = [
    { label: 'Social Media', key: 'socialMedia' },
    { label: 'Walk-ins', key: 'walkins' },
    { label: 'Reference', key: 'reference' },
    { label: 'Broker', key: 'broker' },
    { label: 'Total Leads', key: 'totalLeads', highlight: true, bold: true },
    { label: 'Site Visits', key: 'siteVisits', success: true, bold: true },
    { label: 'Ratio (%)', key: 'ratio', percent: true, bold: true },
  ];

  return (
    <div className="w-full">
      <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 px-1">LEAD MATRIX PANEL</h2>
      <div className="w-full overflow-hidden border border-white/5 rounded-2xl bg-slate-950/20 shadow-inner">
        <table className="w-full text-left table-fixed border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[8px] md:text-[11px] font-black text-slate-500 uppercase tracking-tighter md:tracking-[0.2em]">
              <th className="py-4 md:py-6 px-4 md:px-6 w-[35%] md:w-auto">Metric</th>
              <th className="py-4 md:py-6 px-4 md:px-6 text-center bg-white/[0.03] w-[20%] md:w-auto text-orange-400">Today</th>
              <th className="py-4 md:py-6 px-4 md:px-6 text-center w-[20%] md:w-auto">MTD</th>
              <th className="py-4 md:py-6 px-4 md:px-6 text-center w-[25%] md:w-auto">YTD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, idx) => (
              <tr 
                key={idx} 
                className={`
                  transition-all duration-300
                  ${row.highlight ? 'bg-indigo-500/5' : 'hover:bg-white/[0.02]'}
                  ${row.success ? 'bg-emerald-500/5' : ''}
                `}
              >
                <td className={`py-3 md:py-5 px-4 md:px-6 truncate ${row.bold ? 'font-black text-slate-200' : 'font-medium text-slate-400'} ${row.success ? 'text-emerald-400' : ''} text-[9px] md:text-sm uppercase tracking-tight`}>
                  {row.label}
                </td>
                <td className={`py-3 md:py-5 px-4 md:px-6 text-center font-black bg-white/[0.03] ${row.percent ? 'text-indigo-400' : 'text-slate-100'} ${row.success ? 'text-emerald-400' : ''} text-[10px] md:text-base tabular-nums`}>
                  {row.percent ? `${(metrics.today[row.key as keyof DashboardMetrics] as number).toFixed(0)}%` : metrics.today[row.key as keyof DashboardMetrics]}
                </td>
                <td className={`py-3 md:py-5 px-4 md:px-6 text-center font-bold ${row.bold ? 'text-slate-300' : 'text-slate-500'} ${row.success ? 'text-emerald-400/70' : ''} text-[9px] md:text-sm tabular-nums`}>
                  {row.percent ? `${(metrics.mtd[row.key as keyof DashboardMetrics] as number).toFixed(0)}%` : metrics.mtd[row.key as keyof DashboardMetrics]}
                </td>
                <td className={`py-3 md:py-5 px-4 md:px-6 text-center font-bold ${row.bold ? 'text-slate-300' : 'text-slate-500'} ${row.success ? 'text-emerald-400/70' : ''} text-[9px] md:text-sm tabular-nums`}>
                  {row.percent ? `${(metrics.ytd[row.key as keyof DashboardMetrics] as number).toFixed(0)}%` : metrics.ytd[row.key as keyof DashboardMetrics]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalysisTable;
