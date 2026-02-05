
import React from 'react';

interface ConversionMeterProps {
  current: number;
  target: number;
}

const ConversionMeter: React.FC<ConversionMeterProps> = ({ current, target }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min((current / target) * 100, 100);
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-40 h-40 transform -rotate-90">
        {/* Background track */}
        <circle
          cx="80" cy="80" r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="12"
          fill="transparent"
        />
        {/* Progress arc */}
        <circle
          cx="80" cy="80" r={radius}
          stroke="currentColor"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className={`transition-all duration-1000 ${current >= target ? 'text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-orange-500'}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black text-white leading-none">{current.toFixed(0)}%</span>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Current</span>
      </div>
    </div>
  );
};

export default ConversionMeter;
