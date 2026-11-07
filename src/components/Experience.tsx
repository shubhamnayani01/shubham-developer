import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Terminal, 
  Store, 
  Rocket, 
  Sparkles,
  ArrowDown,
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

gsap.registerPlugin(ScrollTrigger);

interface MilestoneData {
  id: string;
  phase: string;
  period: string;
  title: string;
  description: string;
  stack: string;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MILESTONES: MilestoneData[] = [
  {
    id: 'card-1',
    phase: 'PHASE 01',
    period: 'AUG 2025 — GENESIS',
    title: 'Started Web Development',
    description: 'Began learning HTML, CSS and JavaScript from the ground up. Built my first practice websites and discovered my love for clean interfaces.',
    stack: 'Stack: HTML5 / CSS3 / Modern JS',
    status: '● ORIGIN',
    icon: Terminal
  },
  {
    id: 'card-2',
    phase: 'PHASE 02',
    period: 'SEP 2025 — TRIAL',
    title: 'First Real Client Website',
    description: 'Built my first commercial website for a local business in Gujarat. Seeing real footfall and customer inquiries flow through the site proved real-world impact.',
    stack: 'Scope: Commercial Storefront',
    status: 'DELIVERED',
    icon: Store
  },
  {
    id: 'card-3',
    phase: 'PHASE 03',
    period: 'DEC 2025 — EXPANSION',
    title: 'Helping Local Businesses',
    description: 'Started building fast websites for shops, purified water suppliers, and regional services across Kutch with guaranteed 2 to 5-day turnaround.',
    stack: 'Impact: 5+ Live Client Platforms',
    status: 'REGIONAL',
    icon: Rocket
  },
  {
    id: 'card-4',
    phase: 'PHASE 04',
    period: 'TODAY — CRAFT',
    title: 'Building Websites That Grow Businesses',
    description: 'Focused on creating modern, mobile-first websites with direct WhatsApp ordering that bring real customers, enquiries, and measurable revenue.',
    stack: 'Standard: Production-Grade',
    status: '● ACTIVE CRAFT',
    icon: Sparkles
  }
];

export const Experience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  
  // Card elements
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  // SVG Pin elements
  const pin2Ref = useRef<SVGGElement>(null);
  const pin3Ref = useRef<SVGGElement>(null);
  const pin4Ref = useRef<SVGGElement>(null);

  // Status & Telemetry elements
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const chapterLabelRef = useRef<HTMLSpanElement>(null);

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const lastActiveNodeRef = useRef<number>(0);

  // SVG S-Curve Path for Desktop: Connects (180, 160) -> (1240, 360) -> (240, 640) -> (1220, 840)
  const desktopPathD = `M 180 160
                 C 480 80, 840 120, 1020 220
                 C 1140 280, 1200 320, 1240 360
                 C 1280 430, 1160 540, 880 500
                 C 580 460, 420 540, 240 640
                 C 100 720, 260 880, 520 870
                 C 800 860, 1020 850, 1220 840`;

  // SVG Path for Mobile: Elegant vertical guide with subtle curve points at nodes
  // Coordinates in 400x120 viewBox: Node 1 (60, 60) -> Node 2 (160, 60) -> Node 3 (260, 60) -> Node 4 (360, 60)
  const mobilePathD = `M 40 60
                 C 100 35, 120 85, 150 60
                 C 180 35, 220 85, 255 60
                 C 290 35, 330 85, 360 60`;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !pinSectionRef.current || !activePathRef.current) return;

      const path = activePathRef.current;
      const pathLength = path.getTotalLength();

      // Initialize path stroke dash
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
      });

      // Initialize card states
      if (card1Ref.current) {
        gsap.set(card1Ref.current, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' });
      }
      if (card2Ref.current) {
        gsap.set(card2Ref.current, { opacity: 0, y: isMobile ? 16 : 24, scale: 0.96, pointerEvents: 'none' });
      }
      if (card3Ref.current) {
        gsap.set(card3Ref.current, { opacity: 0, y: isMobile ? 16 : 24, scale: 0.96, pointerEvents: 'none' });
      }
      if (card4Ref.current) {
        gsap.set(card4Ref.current, { opacity: 0, y: isMobile ? 16 : 24, scale: 0.96, pointerEvents: 'none' });
      }

      // GSAP Pinned ScrollTrigger Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: isMobile ? '+=1800' : '+=2000',
          pin: pinSectionRef.current,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;

            // Update Progress Bar
            const pct = Math.round(p * 100);
            if (progressTextRef.current) {
              progressTextRef.current.textContent = `${pct}%`;
            }
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${pct}%`;
            }

            // Update Chapter Label
            if (chapterLabelRef.current) {
              if (p >= 0.88) {
                chapterLabelRef.current.textContent = isMobile 
                  ? '04: Scale & Active Craft' 
                  : 'Chapter 04: Building Websites That Grow Businesses';
              } else if (p >= 0.58) {
                chapterLabelRef.current.textContent = isMobile 
                  ? '03: Helping Local Businesses' 
                  : 'Chapter 03: Helping Local Businesses';
              } else if (p >= 0.26) {
                chapterLabelRef.current.textContent = isMobile 
                  ? '02: First Real Client Website' 
                  : 'Chapter 02: First Real Client Website';
              } else {
                chapterLabelRef.current.textContent = isMobile 
                  ? '01: Started Web Development' 
                  : 'Chapter 01: Started Web Development';
              }
            }

            // Audio cues on node milestone reach
            let currentNode = 0;
            if (p >= 0.88) currentNode = 3;
            else if (p >= 0.58) currentNode = 2;
            else if (p >= 0.26) currentNode = 1;

            if (currentNode !== lastActiveNodeRef.current) {
              soundFx.playClick(850 + currentNode * 70);
              lastActiveNodeRef.current = currentNode;
            }
          }
        }
      });

      // 1. Draw SVG Active Path smoothly across the entire timeline
      tl.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        duration: 1.0
      }, 0);

      if (isMobile) {
        // MOBILE TRANSITIONS (Single central viewport card presentation)
        // Transition 1 -> 2
        tl.to(card1Ref.current, {
          opacity: 0,
          y: -16,
          scale: 0.95,
          pointerEvents: 'none',
          duration: 0.08,
          ease: 'power2.in'
        }, 0.22);

        tl.to(card2Ref.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: 'auto',
          duration: 0.1,
          ease: 'power2.out'
        }, 0.26);

        if (pin2Ref.current) {
          tl.to(pin2Ref.current.querySelectorAll('circle'), {
            stroke: '#111111',
            fill: (i) => (i === 1 ? '#111111' : '#F4F3F1'),
            duration: 0.08
          }, 0.26);
        }

        // Transition 2 -> 3
        tl.to(card2Ref.current, {
          opacity: 0,
          y: -16,
          scale: 0.95,
          pointerEvents: 'none',
          duration: 0.08,
          ease: 'power2.in'
        }, 0.52);

        tl.to(card3Ref.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: 'auto',
          duration: 0.1,
          ease: 'power2.out'
        }, 0.56);

        if (pin3Ref.current) {
          tl.to(pin3Ref.current.querySelectorAll('circle'), {
            stroke: '#111111',
            fill: (i) => (i === 1 ? '#111111' : '#F4F3F1'),
            duration: 0.08
          }, 0.56);
        }

        // Transition 3 -> 4
        tl.to(card3Ref.current, {
          opacity: 0,
          y: -16,
          scale: 0.95,
          pointerEvents: 'none',
          duration: 0.08,
          ease: 'power2.in'
        }, 0.82);

        tl.to(card4Ref.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: 'auto',
          duration: 0.1,
          ease: 'power2.out'
        }, 0.86);

        if (pin4Ref.current) {
          tl.to(pin4Ref.current.querySelectorAll('circle'), {
            stroke: '#111111',
            fill: (i) => (i === 1 ? '#111111' : '#F4F3F1'),
            duration: 0.08
          }, 0.86);
        }

      } else {
        // DESKTOP TRANSITIONS (4 corners Pathfinder canvas)
        // 2. Milestone 2 (Upper Right) reveals at ~0.24 - 0.32
        if (card2Ref.current) {
          tl.to(card2Ref.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: 'auto',
            duration: 0.12,
            ease: 'power2.out'
          }, 0.24);
        }
        if (pin2Ref.current) {
          tl.to(pin2Ref.current.querySelectorAll('circle'), {
            stroke: '#111111',
            fill: (i) => (i === 1 ? '#111111' : '#F4F3F1'),
            duration: 0.08
          }, 0.26);
        }

        // 3. Card 1 on Left gracefully exits before Card 3 enters (~0.46)
        if (card1Ref.current) {
          tl.to(card1Ref.current, {
            opacity: 0,
            y: -20,
            scale: 0.96,
            pointerEvents: 'none',
            duration: 0.1,
            ease: 'power2.in'
          }, 0.46);
        }

        // 4. Milestone 3 (Lower Left) reveals at ~0.54 - 0.62
        if (card3Ref.current) {
          tl.to(card3Ref.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: 'auto',
            duration: 0.12,
            ease: 'power2.out'
          }, 0.54);
        }
        if (pin3Ref.current) {
          tl.to(pin3Ref.current.querySelectorAll('circle'), {
            stroke: '#111111',
            fill: (i) => (i === 1 ? '#111111' : '#F4F3F1'),
            duration: 0.08
          }, 0.56);
        }

        // 5. Card 2 on Right gracefully exits before Card 4 enters (~0.76)
        if (card2Ref.current) {
          tl.to(card2Ref.current, {
            opacity: 0,
            y: -20,
            scale: 0.96,
            pointerEvents: 'none',
            duration: 0.1,
            ease: 'power2.in'
          }, 0.76);
        }

        // 6. Milestone 4 (Lower Right) reveals at ~0.84 - 0.94
        if (card4Ref.current) {
          tl.to(card4Ref.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: 'auto',
            duration: 0.12,
            ease: 'power2.out'
          }, 0.84);
        }
        if (pin4Ref.current) {
          tl.to(pin4Ref.current.querySelectorAll('circle'), {
            stroke: '#111111',
            fill: (i) => (i === 1 ? '#111111' : '#F4F3F1'),
            duration: 0.08
          }, 0.86);
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      ref={containerRef}
      id="experience"
      className="relative w-full bg-[#F4F3F1] text-[#111111] border-t border-[#111111]/8"
    >
      {/* Hidden backward-compatible anchor for legacy manifesto links */}
      <span id="manifesto" className="sr-only" aria-hidden="true" />

      {/* =========================================================================
          DESKTOP VIEW: GSAP ScrollTrigger Pinned Pathfinder Stage
         ========================================================================= */}
      {!isMobile ? (
        <div
          ref={pinSectionRef}
          className="w-full h-screen min-h-[720px] max-h-[1080px] flex flex-col justify-between items-center overflow-hidden px-6 lg:px-14 py-6 select-none relative"
        >
          {/* Subtle Stage Coordinates Watermark */}
          <div className="absolute inset-0 pointer-events-none flex justify-between px-8 lg:px-16 py-20 opacity-20 font-mono text-[10px] text-neutral-500">
            <div className="flex flex-col justify-between">
              <span>BHUJ, GUJARAT · 23.2420° N</span>
              <span>CHPT // 01–04</span>
              <span>TIMELINE_KINETIC_TRACK</span>
            </div>
            <div className="flex flex-col justify-between text-right">
              <span>ORIGIN // KOTDA JADODAR</span>
              <span>BEZIER_INTERPOLATION</span>
              <span>STATUS: LIVE</span>
            </div>
          </div>

          {/* Top Header Row */}
          <div className="relative z-30 max-w-7xl mx-auto w-full flex items-center justify-between pt-16 lg:pt-20 pb-3 border-b border-[#111111]/10">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#111111] inline-block animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-[#111111]">
                TIMELINE // 01–04
              </span>
              <span className="text-black/30 font-mono text-xs">·</span>
              <span className="font-serif italic text-base lg:text-lg text-[#111111]">
                My Journey as a Web Developer
              </span>
            </div>
          </div>

          <div className="relative w-full max-w-7xl h-[68vh] min-h-[520px] max-h-[800px] flex items-center justify-center my-auto">
            
            {/* SVG Path Layer */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 1440 1000"
            >
              {/* Inactive Track */}
              <path
                d={desktopPathD}
                fill="none"
                stroke="#D8D5D0"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Active Drawing Path */}
              <path
                ref={activePathRef}
                d={desktopPathD}
                fill="none"
                stroke="#111111"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Node 1 Pin: (180, 160) */}
              <g className="transition-transform duration-300">
                <circle cx="180" cy="160" r="10" fill="#F4F3F1" stroke="#111111" strokeWidth="2.25" />
                <circle cx="180" cy="160" r="4.5" fill="#111111" />
              </g>

              {/* Node 2 Pin: (1240, 360) */}
              <g ref={pin2Ref} className="transition-transform duration-300">
                <circle cx="1240" cy="360" r="9.5" fill="#F4F3F1" stroke="#D8D5D0" strokeWidth="2" />
                <circle cx="1240" cy="360" r="4.5" fill="#D8D5D0" />
              </g>

              {/* Node 3 Pin: (240, 640) */}
              <g ref={pin3Ref} className="transition-transform duration-300">
                <circle cx="240" cy="640" r="9.5" fill="#F4F3F1" stroke="#D8D5D0" strokeWidth="2" />
                <circle cx="240" cy="640" r="4.5" fill="#D8D5D0" />
              </g>

              {/* Node 4 Pin: (1220, 840) */}
              <g ref={pin4Ref} className="transition-transform duration-300">
                <circle cx="1220" cy="840" r="9.5" fill="#F4F3F1" stroke="#D8D5D0" strokeWidth="2" />
                <circle cx="1220" cy="840" r="4.5" fill="#D8D5D0" />
              </g>
            </svg>

            {/* Milestone Cards positioned around S-Curve nodes */}
            
            {/* Card 1: Top-Left */}
            <div
              ref={card1Ref}
              className="absolute top-[5%] left-[4%] z-20 w-[290px] lg:w-[330px]"
            >
              <MilestoneCard milestone={MILESTONES[0]} />
            </div>

            {/* Card 2: Upper-Right */}
            <div
              ref={card2Ref}
              className="absolute top-[16%] right-[4%] z-20 w-[290px] lg:w-[330px]"
            >
              <MilestoneCard milestone={MILESTONES[1]} />
            </div>

            {/* Card 3: Lower-Left */}
            <div
              ref={card3Ref}
              className="absolute bottom-[16%] left-[5%] z-20 w-[290px] lg:w-[330px]"
            >
              <MilestoneCard milestone={MILESTONES[2]} />
            </div>

            {/* Card 4: Lower-Right */}
            <div
              ref={card4Ref}
              className="absolute bottom-[4%] right-[5%] z-20 w-[300px] lg:w-[340px]"
            >
              <MilestoneCard milestone={MILESTONES[3]} isFinal />
            </div>

          </div>

          {/* Bottom Status Bar */}
          <div className="w-full max-w-7xl px-4 flex items-center justify-between text-[11px] font-mono text-neutral-600 border-t border-black/10 pt-3">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#111111]" />
              <span ref={chapterLabelRef} className="font-medium text-[#111111]">
                Chapter 01: Started Web Development
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-neutral-500 tracking-wider uppercase text-[10px]">
              <span>Scroll to trace trajectory</span>
              <ArrowDown className="w-3 h-3 animate-bounce" />
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            MOBILE VIEW: GSAP ScrollTrigger Pinned Mobile Pathfinder Experience
           ========================================================================= */
        <div
          ref={pinSectionRef}
          className="w-full h-screen min-h-[580px] max-h-[850px] flex flex-col justify-between overflow-hidden px-4 py-4 select-none relative"
        >
          {/* Top Header & Telemetry */}
          <div className="relative z-30 w-full pt-12 pb-3 border-b border-black/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111]">
                <span className="w-2 h-2 rounded-full bg-[#111111] animate-pulse" />
                <span>TIMELINE // 01–04</span>
              </div>

              {/* Progress pill */}
              <div className="flex items-center space-x-2 bg-white/90 px-3 py-1 rounded-full border border-black/10 text-[10px] font-mono text-[#111111] shadow-xs">
                <span className="text-neutral-500 text-[9px]">PROGRESS</span>
                <span ref={progressTextRef} className="font-semibold tabular-nums">0%</span>
                <div className="w-10 h-[2px] bg-[#D8D5D0] relative overflow-hidden rounded-full">
                  <div
                    ref={progressBarRef}
                    className="absolute left-0 top-0 h-full w-0 bg-[#111111]"
                  />
                </div>
              </div>
            </div>

            <h2 className="font-serif italic text-2xl font-normal text-[#111111] leading-tight">
              My Journey as a Web Developer
            </h2>
          </div>

          {/* Animated SVG Mini-Track Tracker */}
          <div className="w-full py-1 relative z-20">
            <svg
              className="w-full h-10 overflow-visible"
              viewBox="0 0 400 120"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Inactive Track */}
              <path
                d={mobilePathD}
                fill="none"
                stroke="#D8D5D0"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Active Animated Track */}
              <path
                ref={activePathRef}
                d={mobilePathD}
                fill="none"
                stroke="#111111"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Node 1 Pin: (40, 60) */}
              <g className="transition-transform duration-300">
                <circle cx="40" cy="60" r="10" fill="#F4F3F1" stroke="#111111" strokeWidth="2.5" />
                <circle cx="40" cy="60" r="4.5" fill="#111111" />
                <text x="40" y="90" textAnchor="middle" className="text-[10px] font-mono fill-neutral-600 font-bold">1</text>
              </g>

              {/* Node 2 Pin: (150, 60) */}
              <g ref={pin2Ref} className="transition-transform duration-300">
                <circle cx="150" cy="60" r="9.5" fill="#F4F3F1" stroke="#D8D5D0" strokeWidth="2" />
                <circle cx="150" cy="60" r="4.5" fill="#D8D5D0" />
                <text x="150" y="90" textAnchor="middle" className="text-[10px] font-mono fill-neutral-400 font-bold">2</text>
              </g>

              {/* Node 3 Pin: (255, 60) */}
              <g ref={pin3Ref} className="transition-transform duration-300">
                <circle cx="255" cy="60" r="9.5" fill="#F4F3F1" stroke="#D8D5D0" strokeWidth="2" />
                <circle cx="255" cy="60" r="4.5" fill="#D8D5D0" />
                <text x="255" y="90" textAnchor="middle" className="text-[10px] font-mono fill-neutral-400 font-bold">3</text>
              </g>

              {/* Node 4 Pin: (360, 60) */}
              <g ref={pin4Ref} className="transition-transform duration-300">
                <circle cx="360" cy="60" r="9.5" fill="#F4F3F1" stroke="#D8D5D0" strokeWidth="2" />
                <circle cx="360" cy="60" r="4.5" fill="#D8D5D0" />
                <text x="360" y="90" textAnchor="middle" className="text-[10px] font-mono fill-neutral-400 font-bold">4</text>
              </g>
            </svg>
          </div>

          {/* Dynamic Card Display Stage */}
          <div className="relative w-full flex-1 flex items-center justify-center my-auto min-h-[300px]">
            {/* Card 1 */}
            <div
              ref={card1Ref}
              className="absolute inset-x-0 mx-auto w-full max-w-sm px-1"
            >
              <MilestoneCard milestone={MILESTONES[0]} />
            </div>

            {/* Card 2 */}
            <div
              ref={card2Ref}
              className="absolute inset-x-0 mx-auto w-full max-w-sm px-1 opacity-0 pointer-events-none"
            >
              <MilestoneCard milestone={MILESTONES[1]} />
            </div>

            {/* Card 3 */}
            <div
              ref={card3Ref}
              className="absolute inset-x-0 mx-auto w-full max-w-sm px-1 opacity-0 pointer-events-none"
            >
              <MilestoneCard milestone={MILESTONES[2]} />
            </div>

            {/* Card 4 */}
            <div
              ref={card4Ref}
              className="absolute inset-x-0 mx-auto w-full max-w-sm px-1 opacity-0 pointer-events-none"
            >
              <MilestoneCard milestone={MILESTONES[3]} isFinal />
            </div>
          </div>

          {/* Mobile Bottom Status Bar */}
          <div className="w-full pt-3 pb-2 border-t border-black/10 flex items-center justify-between text-[10px] font-mono text-neutral-600">
            <div className="flex items-center space-x-1.5 truncate pr-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#111111] shrink-0" />
              <span ref={chapterLabelRef} className="font-medium text-[#111111] truncate">
                01: Started Web Development
              </span>
            </div>

            <div className="flex items-center space-x-1 text-neutral-500 uppercase tracking-wider shrink-0 text-[9px]">
              <span>Scroll</span>
              <ArrowDown className="w-3 h-3 animate-bounce" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Reusable Desktop Milestone Card
interface MilestoneCardProps {
  milestone: MilestoneData;
  isFinal?: boolean;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, isFinal }) => {
  const Icon = milestone.icon;

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 lg:p-5 transition-all duration-300 backdrop-blur-md border ${
        isFinal
          ? 'bg-[#0B0B0E] text-white border-white/15 shadow-xl'
          : 'bg-white/95 text-[#111111] border-black/12 shadow-md'
      } hover:border-black/30`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.2em] font-medium ${
          isFinal ? 'text-white/60' : 'text-neutral-500'
        }`}>
          {milestone.phase}
        </span>
        <span className={`font-mono text-[10px] lg:text-[11px] ${
          isFinal ? 'text-white/50' : 'text-neutral-400'
        }`}>
          {milestone.period}
        </span>
      </div>

      <div className="flex items-start space-x-2.5 mb-2.5">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
          isFinal ? 'bg-white/10 text-white' : 'bg-black/5 text-[#111111]'
        }`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <h3 className={`font-serif italic text-lg lg:text-xl font-normal tracking-tight leading-snug ${
          isFinal ? 'text-white' : 'text-[#111111]'
        }`}>
          {milestone.title}
        </h3>
      </div>

      <p className={`text-xs lg:text-[13px] leading-relaxed font-light ${
        isFinal ? 'text-white/75' : 'text-neutral-700'
      }`}>
        {milestone.description}
      </p>

      <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[10.5px] lg:text-[11px] font-mono ${
        isFinal ? 'border-white/10 text-white/60' : 'border-black/10 text-neutral-600'
      }`}>
        <span className="truncate pr-2">{milestone.stack}</span>
        <span className={`shrink-0 font-semibold ${
          isFinal ? 'text-emerald-400' : 'text-[#111111]'
        }`}>
          {milestone.status}
        </span>
      </div>
    </div>
  );
};
