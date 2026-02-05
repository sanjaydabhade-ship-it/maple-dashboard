
import React from 'react';

interface MoodBadgeProps {
  discussion: string;
}

const MoodBadge: React.FC<MoodBadgeProps> = ({ discussion }) => {
  const text = (discussion || '').toLowerCase();
  
  const getMood = () => {
    if (text.includes('visit') || text.includes('interested')) return { label: 'Warm', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (text.includes('negotiate') || text.includes('price')) return { label: 'Sensitive', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    if (text.includes('not interested')) return { label: 'Cold', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (text.includes('call') || text.includes('follow')) return { label: 'Follow-up', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' };
    return { label: 'Active', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
  };

  const mood = getMood();

  return (
    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border tracking-widest ${mood.color}`}>
      {mood.label}
    </span>
  );
};

export default MoodBadge;
