import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { MagneticElement } from './MagneticElement';

interface HeroProps {
  onExploreClick: () => void;
  onInquireClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onInquireClick }) => {
  const containerRef = useRef<HTMLElement>(null);
  const [portraitMouse, setPortraitMouse] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.1]);

  const handleMouseMovePortrait = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setPortraitMouse({
      x: x * 14,
      y: y * 14,
      rotateX: -y * 8,
      rotateY: x * 8
    });
  };

  const handleMouseLeavePortrait = () => {
    setPortraitMouse({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[92vh] sm:min-h-[95vh] pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16 flex flex-col justify-between overflow-hidden bg-[#F4F3F1] text-[#1A1A1A]"
    >
      {/* Main Central Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 w-full relative z-10 flex-grow flex flex-col justify-between pb-6 sm:pb-8 md:pb-10">
        
        {/* Top Minimal Status */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#1A1A1A]/10 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/60"
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#111111]" />
            <span>Available for New Projects</span>
          </div>

          <div className="hidden sm:flex items-center space-x-6 text-[#1A1A1A]/50">
            <span>Kotda Jadodar, Kutch & Gujarat</span>
            <span>•</span>
            <span className="text-[#1A1A1A] font-semibold">2026 Edition</span>
          </div>
        </motion.div>

        {/* Centerpiece Composition */}
        <div className="relative py-3 sm:py-5 md:py-6 flex items-center justify-center min-h-[360px] sm:min-h-[480px] my-auto">
          
          {/* Headline (Over portrait: z-20) */}
          <motion.div
            style={{ y: textY, opacity }}
            className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-20 select-none text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(34px,10vw,46px)] sm:text-[80px] md:text-[110px] lg:text-[145px] leading-[0.88] font-serif tracking-[-0.04em] italic text-[#1A1A1A] flex flex-col items-center w-full"
            >
              <span className="-translate-x-[clamp(60px,18vw,95px)] sm:-translate-x-[150px] md:-translate-x-[220px] lg:-translate-x-[290px]">
                Visionary
              </span>
              <span className="translate-x-[clamp(55px,17vw,90px)] sm:translate-x-[140px] md:translate-x-[210px] lg:translate-x-[280px] text-[#1A1A1A]/95">
                Websites
              </span>
            </motion.h1>
          </motion.div>

          {/* Centerpiece Portrait (z-10) */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[clamp(180px,52vw,210px)] sm:w-[290px] md:w-[340px] h-[clamp(275px,80vw,315px)] sm:h-[420px] md:h-[480px] bg-[#E0DDD8] overflow-hidden grayscale contrast-100 shadow-xl rounded-[clamp(90px,26vw,105px)] sm:rounded-[145px] md:rounded-[170px] group cursor-pointer border border-[#1A1A1A]/10 transition-all duration-300"
            onMouseMove={handleMouseMovePortrait}
            onMouseLeave={handleMouseLeavePortrait}
            onClick={onExploreClick}
            data-cursor="explore"
            data-cursor-text="EXPLORE"
          >
            <motion.img
              src="/images/prsnl.jpg"
              alt="Shubham Nayani"
              className="w-full h-full object-cover object-[50%_15%] group-hover:scale-105 transition-transform duration-700 ease-out opacity-100"
              style={{
                transform: `translate3d(${portraitMouse.x}px, ${portraitMouse.y}px, 0) rotateX(${portraitMouse.rotateX}deg) rotateY(${portraitMouse.rotateY}deg) scale(1)`,
              }}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white pointer-events-none w-full px-4">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase block text-white/95">
                Shubham Nayani
              </span>
              <span className="text-[8px] font-mono-tech tracking-widest text-white/80 uppercase block mt-0.5">
                Frontend Web Developer • 18+ Months Exp
              </span>
            </div>
          </motion.div>

        </div>

        {/* Narrative & Action Bar */}
        <div className="mt-8 sm:mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-center md:text-left w-full">
          <div className="max-w-md">
            <p className="text-xs sm:text-sm leading-relaxed text-[#1A1A1A]/75 font-normal">
              High-performance digital storefronts and modern web experiences built with 2–5 day turnaround.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <MagneticElement strength={0.3} onClick={onExploreClick}>
              <button
                id="hero-explore-works"
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#1A1A1A] text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#333333] transition-colors shadow-sm"
                data-cursor="hover"
              >
                Selected Works
              </button>
            </MagneticElement>

            <MagneticElement strength={0.3} onClick={onInquireClick}>
              <button
                id="hero-inquire-btn"
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-[#1A1A1A]/20 hover:border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-bold tracking-[0.2em] uppercase flex items-center space-x-1.5 transition-colors bg-white/50"
                data-cursor="hover"
              >
                <span>Inquire</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#111111]" />
              </button>
            </MagneticElement>
          </div>
        </div>

      </div>

      {/* Bottom Minimalist Scroll Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 w-full pt-4 sm:pt-5 flex justify-between items-center gap-4 sm:gap-6 lg:gap-8 relative z-10 border-t border-[#1A1A1A]/10 text-[9px] sm:text-[10px] font-bold tracking-[0.18em] uppercase text-[#1A1A1A]/50">
        <div className="shrink-0 flex items-center">
          <span className="hidden xl:inline whitespace-nowrap">Frontend Engineering & Digital Solutions</span>
          <span className="xl:hidden whitespace-nowrap">Frontend Engineering</span>
        </div>

        <button
          onClick={onExploreClick}
          className="flex items-center space-x-2 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors shrink-0 whitespace-nowrap"
          data-cursor="hover"
        >
          <span>Scroll to explore</span>
          <ArrowDown className="w-3 h-3 animate-bounce" />
        </button>

        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-[#1A1A1A]/50 shrink-0 whitespace-nowrap">
          <a href="https://wa.me/919427209737" target="_blank" rel="noreferrer" className="hover:text-[#1A1A1A] transition-colors whitespace-nowrap">WhatsApp</a>
          <a href="https://github.com/shubhamnayani01" target="_blank" rel="noreferrer" className="hover:text-[#1A1A1A] transition-colors whitespace-nowrap">GitHub</a>
          <a href="https://www.instagram.com/shubhm_nayani" target="_blank" rel="noreferrer" className="hover:text-[#1A1A1A] transition-colors whitespace-nowrap">Instagram</a>
          <a href="tel:+919427209737" className="hover:text-[#1A1A1A] transition-colors whitespace-nowrap">Call Direct</a>
        </div>
      </div>
    </section>
  );
};

