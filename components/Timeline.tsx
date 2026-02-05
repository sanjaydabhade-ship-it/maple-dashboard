
import React from 'react';
import { Lead } from '../types';

interface TimelineProps {
  lead: Lead;
}

const Timeline: React.FC<TimelineProps> = ({ lead }) => {
  // Mocking journey steps based on current lead data since we have 1 discussion record per lead
  // In a real app, this would be a separate array of interaction logs.
  const steps = [
    { date: lead.date, event: lead.source, type: 'Inquiry' },
    ...(lead.siteVisitStatus?.toLowerCase() === 'done' ? [{ date: lead.date, event: 'Site Visit Completed', type: 'Visit' }] : []),
    { date: 'Today', event: lead.discussion || 'Awaiting update', type: 'Current Status' }
  ];

  return (
    <div className="space-y-4 pt-4">
      <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Client Journey</h4>
      <div className="relative pl-6 border-l border-white/5 space-y-6">
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            <div className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${idx === steps.length - 1 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-slate-700'}`}></div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tabular-nums">{step.date}</span>
              <span className="text-[11px] font-bold text-slate-200">{step.event}</span>
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{step.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
