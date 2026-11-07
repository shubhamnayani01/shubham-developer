import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Smartphone, 
  Zap, 
  Clock 
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface PrincipleItem {
  number: string;
  title: string;
  statement: string;
  icon: React.ComponentType<{ className?: string }>;
  stat: {
    value: string;
    label: string;
  };
}

const PRINCIPLES_DATA: PrincipleItem[] = [
  {
    number: '01',
    title: 'Conversion Architecture',
    statement: 'Strategic layouts calibrated to turn visitors into paying clients.',
    icon: Users,
    stat: {
      value: '+3.4x',
      label: 'Client Inquiries'
    }
  },
  {
    number: '02',
    title: 'Mobile-First Velocity',
    statement: 'Thumb-friendly navigation, instant calling, and direct WhatsApp routing.',
    icon: Smartphone,
    stat: {
      value: '84%',
      label: 'Handheld Traffic'
    }
  },
  {
    number: '03',
    title: 'Sub-Second Performance',
    statement: 'Lightweight architecture delivering instant page loads and peak search ranks.',
    icon: Zap,
    stat: {
      value: '99/100',
      label: 'Lighthouse Score'
    }
  },
  {
    number: '04',
    title: 'Rapid 48h Turnaround',
    statement: 'From concept to live deployment in 2 to 5 business days.',
    icon: Clock,
    stat: {
      value: '48–120h',
      label: 'Deployment Window'
    }
  }
];

export const DesignManifesto: React.FC = () => {
  const [activePrinciple, setActivePrinciple] = useState<number>(0);
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={containerRef}
      id="manifesto"
      className="py-14 sm:py-18 md:py-24 px-5 sm:px-8 md:px-10 bg-[#E0DDD8]/20 border-y border-[#1A1A1A]/10 relative overflow-hidden text-[#1A1A1A]"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 max-w-3xl">
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#1A1A1A]/50 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
            <span>Core Standards</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif italic text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#1A1A1A] leading-[1.08]"
          >
            Built different. Engineered to perform from day one.
          </motion.h2>
        </div>

        {/* Principles Grid - Balanced 2x2 Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-9 md:gap-10">
          {PRINCIPLES_DATA.map((principle, index) => {
            const isActive = activePrinciple === index;
            const Icon = principle.icon;

            return (
              <div
                key={principle.number}
                onClick={() => {
                  soundFx.playClick(850 + index * 60);
                  setActivePrinciple(index);
                }}
                className={`p-6 sm:p-10 md:p-11 rounded-2xl transition-all duration-300 cursor-pointer border relative flex flex-col justify-between min-h-0 sm:min-h-[220px] ${
                  isActive
                    ? 'bg-white border-[#111111] shadow-xl ring-1 ring-[#111111]/10'
                    : 'bg-white/60 border-[#1A1A1A]/10 hover:bg-white hover:border-[#1A1A1A]/30 shadow-xs'
                }`}
                data-cursor="hover"
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          isActive
                            ? 'bg-[#111111] text-white'
                            : 'bg-[#111111]/5 text-[#111111]/70'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex items-baseline space-x-2">
                        <span className={`font-mono text-xs font-bold shrink-0 ${
                          isActive ? 'text-[#111111]' : 'text-[#111111]/40'
                        }`}>
                          {principle.number}
                        </span>
                        <span className="text-black/30 font-mono text-xs">/</span>
                        <h3 className="font-serif italic text-lg sm:text-2xl font-normal tracking-tight text-[#1A1A1A] leading-tight">
                          {principle.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-baseline sm:flex-col sm:items-end justify-between sm:justify-start shrink-0 pt-1 sm:pt-0 border-t border-[#1A1A1A]/5 sm:border-t-0">
                      <span className="font-serif italic font-semibold text-lg sm:text-2xl text-[#111111] leading-none">
                        {principle.stat.value}
                      </span>
                      <span className="text-[9px] sm:text-[9px] font-mono uppercase tracking-widest text-[#111111]/50 mt-0.5 sm:mt-1">
                        {principle.stat.label}
                      </span>
                    </div>
                  </div>

                  {/* Concise Statement */}
                  <p className="text-xs sm:text-base text-[#1A1A1A]/75 font-light leading-relaxed">
                    {principle.statement}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
