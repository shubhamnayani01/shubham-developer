import React from 'react';
import { CLIENT_LOGOS } from '../data/portfolioData';

export const MarqueeBanner: React.FC = () => {
  return (
    <div className="py-6 border-y border-[#1A1A1A]/10 bg-[#E0DDD8]/25 overflow-hidden select-none">
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee flex items-center space-x-12 whitespace-nowrap">
          {CLIENT_LOGOS.concat(CLIENT_LOGOS).map((client, idx) => (
            <div key={`${client.name}-${idx}`} className="flex items-center space-x-8 group">
              <span className="font-serif italic text-xl md:text-2xl font-medium tracking-tight text-[#1A1A1A] hover:opacity-60 transition-opacity">
                {client.name}
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/50">
                {client.label}
              </span>
              <span className="text-xs text-[#1A1A1A]/20">/</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

