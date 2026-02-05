
import React from 'react';

interface LeaderboardProps {
  leaderboard: [string, { visits: number; leads: number }][];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {leaderboard.map(([name, stats]) => {
        const ratio = stats.leads > 0 ? (stats.visits / stats.leads) * 100 : 0;
        const radius = 24;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (ratio / 100) * circumference;
        
        const getStatusColor = (val: number) => {
          if (val >= 40) return 'text-emerald-500';
          if (val >= 25) return 'text-orange-500';
          return 'text-red-500';
        };

        return (
          <div key={name} className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center gap-4 transition-all hover:bg-white/10 group">
            <div className="relative shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="32" cy="32" r={radius} 
                  stroke="currentColor" strokeWidth="4" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={offset} 
                  strokeLinecap="round" 
                  fill="transparent" 
                  className={`transition-all duration-1000 ${getStatusColor(ratio)}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                {ratio.toFixed(0)}%
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-slate-100 uppercase truncate mb-1 group-hover:text-orange-400">{name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{stats.visits} Visits</span>
                <span className="text-[10px] text-slate-700">•</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{stats.leads} Leads</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Leaderboard;
