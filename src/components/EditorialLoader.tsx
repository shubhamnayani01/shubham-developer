import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { soundFx } from '../utils/soundEffects';

interface EditorialLoaderProps {
  onComplete: () => void;
  onRevealStart?: () => void;
}

export const EditorialLoader: React.FC<EditorialLoaderProps> = ({
  onComplete,
  onRevealStart,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLDivElement>(null);
  const maskLayerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const onCompleteRef = useRef(onComplete);
  const onRevealStartRef = useRef(onRevealStart);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onRevealStartRef.current = onRevealStart;
  });

  const progressNumberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Keep scroll locked while loader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Setup initial states
      gsap.set(logoWrapperRef.current, {
        y: isMobile ? -30 : -70,
        scale: 0.95,
        opacity: 0,
        willChange: 'transform, opacity',
      });

      gsap.set(logoTextRef.current, {
        color: '#8A8780',
        willChange: 'color, transform',
      });

      gsap.set(sublineRef.current, {
        y: 10,
        opacity: 0,
        willChange: 'transform, opacity',
      });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          setIsFinished(true);
          document.body.style.overflow = originalOverflow;
          onCompleteRef.current?.();
        },
      });

      timelineRef.current = tl;

      // STAGE 1: Smooth Entrance of Logo & Stage
      tl.to(
        logoWrapperRef.current,
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: isMobile ? 0.6 : 0.7,
          ease: 'power3.out',
        },
        0.05
      );

      // STAGE 2: Deep Ink Saturation
      tl.to(
        logoTextRef.current,
        {
          color: '#111111',
          duration: 0.45,
          ease: 'power2.out',
        },
        '-=0.3'
      );

      // STAGE 3: Subline Reveal & Subtle Counter
      tl.to(
        sublineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.25'
      );

      // Micro Numeric Counter
      const counterObj = { value: 0 };
      tl.to(
        counterObj,
        {
          value: 100,
          duration: isMobile ? 0.75 : 0.85,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (progressNumberRef.current) {
              progressNumberRef.current.textContent = `${Math.round(counterObj.value)}%`;
            }
          },
        },
        '-=0.3'
      );

      // STAGE 4: Elegant Exit Transition
      tl.to(
        sublineRef.current,
        {
          opacity: 0,
          y: -8,
          duration: 0.25,
          ease: 'power2.in',
        },
        '+=0.15'
      );

      // Scale zoom and reveal site
      tl.to(
        logoWrapperRef.current,
        {
          scale: isMobile ? 6 : 10,
          opacity: 0,
          duration: isMobile ? 0.55 : 0.65,
          ease: 'power3.inOut',
        },
        'revealStage'
      );

      // Signal parent to emerge the main content cleanly
      tl.add(() => {
        onRevealStartRef.current?.();
      }, 'revealStage+=0.15');

      // Fade out loader backdrop
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out',
          pointerEvents: 'none',
        },
        'revealStage+=0.2'
      );
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleSkip = () => {
    soundFx.playClick(900);
    if (timelineRef.current) {
      timelineRef.current.timeScale(4);
    }
  };

  if (isFinished) return null;

  return (
    <div
      ref={containerRef}
      id="editorial-loader"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F4F3F1] text-[#111111] select-none overflow-hidden touch-none"
      style={{
        background:
          'radial-gradient(ellipse at 50% 50%, #FAF9F6 0%, #F4F3F1 60%, #EBE8E2 100%)',
      }}
    >
      {/* Subtle architectural film grain */}
      <div className="absolute inset-0 pointer-events-none opacity-40 grain-overlay" />

      {/* Skip Button in upper corner */}
      <button
        onClick={handleSkip}
        className="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-[#111111]/50 hover:text-[#111111] transition-all px-3 py-1.5 rounded-full border border-[#111111]/15 hover:border-[#111111]/40 bg-white/70 backdrop-blur-md active:scale-95 shadow-sm"
        aria-label="Skip Intro"
      >
        Skip
      </button>

      {/* Soft Vignette Mask */}
      <div
        ref={maskLayerRef}
        className="absolute inset-0 pointer-events-none bg-radial from-transparent via-transparent to-[#111111]/[0.03]"
      />

      {/* Center Cinematic Stage */}
      <div
        ref={logoWrapperRef}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-sm sm:max-w-md mx-auto will-change-transform"
      >
        {/* Master Name */}
        <h1
          ref={logoTextRef}
          className="font-serif italic text-5xl sm:text-7xl md:text-8xl tracking-[-0.03em] font-normal leading-none"
        >
          Shubham
        </h1>

        {/* Dynamic Subline with Micro percentage and location */}
        <div
          ref={sublineRef}
          className="mt-4 flex items-center justify-center space-x-3 text-[9px] sm:text-[10px] font-bold tracking-[0.25em] uppercase text-[#111111]/75"
        >
          <span>Gujarat, India</span>
          <span className="w-1 h-1 rounded-full bg-[#111111]/30" />
          <span ref={progressNumberRef} className="font-mono text-[#111111] font-semibold">0%</span>
        </div>
      </div>
    </div>
  );
};
