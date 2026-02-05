
import React from 'react';
import { Lead } from '../types';

interface TickerProps {
  items: Lead[];
}

const Ticker: React.FC<TickerProps> = ({ items }) => {
  if (items.length === 0) return null;

  // Duplicate items for seamless loop
  const list = [...items, ...items, ...items];

  return (
    <div className="bg-slate-900 border-b border-white/5 py-2 overflow-hidden whitespace-nowrap relative">
      <div className="inline-block animate-ticker-scroll hover:pause">
        {list.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-2 px-12 border-r border-white/5 group">
            <span className="text-[10px] font-black text-slate-500 group-hover:text-orange-400 transition-colors uppercase tracking-widest">{item.name}</span>
            <span className="text-[11px] font-black text-emerald-400">{item.budget}</span>
            <span className="text-[10px] font-bold text-slate-600 italic">via {item.source}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-ticker-scroll {
          animation: ticker-scroll 60s linear infinite;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Ticker;
