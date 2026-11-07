import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowUpRight, Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { MagneticElement } from './MagneticElement';

gsap.registerPlugin(ScrollTrigger);

interface ClientTestimonialsProps {
  onOpenInquiry?: () => void;
}

interface TestimonialLayoutConfig {
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  badge: string;
  sector: string;
  // Dynamic non-centered position configuration
  positionClass: string;
  // Direction from which it enters & exits
  entrance: { x: number; y: number; rotate: number };
  exit: { x: number; y: number; rotate: number };
}

export const ClientTestimonials: React.FC<ClientTestimonialsProps> = ({ onOpenInquiry }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const textRowTopRef = useRef<HTMLDivElement>(null);
  const textRowBottomRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);
  const [mobileIndex, setMobileIndex] = useState<number>(0);

  // Touch swipe handling for mobile
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Real verified client testimonials from live projects
  const stories: TestimonialLayoutConfig[] = [
    {
      quote: "Built our water platform in 3 days. Customers find us directly on Google, driving daily orders straight to WhatsApp.",
      author: "Chaudhary Dev",
      role: "Managing Director & Owner",
      company: "Dharashuddhjal, Mathal",
      initials: "CD",
      badge: "Dharashuddh",
      sector: "Commercial Water Supply",
      positionClass: "top-[14%] left-[6%] lg:left-[8%] w-[360px] lg:w-[420px]",
      entrance: { x: -60, y: 80, rotate: -2 },
      exit: { x: -30, y: -100, rotate: -1 }
    },
    {
      quote: "Clean, robust corporate catalog delivered in under 3 days. Regional clients browse our inventory effortlessly.",
      author: "Dhirendra Nayani",
      role: "Managing Director",
      company: "Shiv Enterprise, Kotda Jadodar",
      initials: "DN",
      badge: "ShivEnt®",
      sector: "Hardware & B2B Supplies",
      positionClass: "bottom-[12%] right-[5%] lg:right-[8%] w-[380px] lg:w-[440px]",
      entrance: { x: 70, y: 90, rotate: 2 },
      exit: { x: 40, y: -90, rotate: 1 }
    },
    {
      quote: "Instant mobile catalog speed and WhatsApp inquiries doubled within weeks. Flawless execution from branding to launch.",
      author: "Kirit Patel",
      role: "Proprietor",
      company: "Family Footwear, Nakhatrana",
      initials: "KP",
      badge: "FamilyFootwear",
      sector: "Retail Showroom",
      positionClass: "bottom-[16%] left-[8%] lg:left-[12%] w-[360px] lg:w-[420px]",
      entrance: { x: -50, y: 90, rotate: 1.5 },
      exit: { x: -20, y: -100, rotate: 1 }
    },
    {
      quote: "Understood our studio aesthetic instantly. Clients browse our bridal catalog and book appointments directly on WhatsApp.",
      author: "Pratha Dayani",
      role: "Lead Artist & Founder",
      company: "Mehandi Art by PN, Surat",
      initials: "PD",
      badge: "MehandiPN",
      sector: "Bridal Artistry",
      positionClass: "top-[18%] right-[10%] lg:right-[14%] w-[350px] lg:w-[410px]",
      entrance: { x: 50, y: 70, rotate: -1.5 },
      exit: { x: 20, y: -90, rotate: -2 }
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!pinSectionRef.current || !containerRef.current) return;

      const isMobile = window.innerWidth < 768;

      if (!isMobile) {
        const total = stories.length;
        // Pinned sequential scroll storytelling timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: `+=${Math.max(total * 500, 1500)}`,
            pin: pinSectionRef.current,
            scrub: 0.15,
            anticipatePin: 0,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.width = `${Math.round(self.progress * 100)}%`;
              }
              const currentIdx = Math.min(
                Math.floor(self.progress * total),
                total - 1
              );
              setActiveStoryIndex(currentIdx);
            }
          }
        });

        // 1. Continuous scroll-driven drift of the massive Palmer background typography spanning the entire scroll until the end of all cards
        if (textRowTopRef.current) {
          tl.to(textRowTopRef.current, {
            xPercent: -42,
            ease: 'none',
            duration: 1.0,
            force3D: true
          }, 0);
        }

        if (textRowBottomRef.current) {
          tl.to(textRowBottomRef.current, {
            xPercent: 36,
            ease: 'none',
            duration: 1.0,
            force3D: true
          }, 0);
        }

        // 2. Strict 1-at-a-time Sequential Storytelling (Butter-smooth GPU transitions)
        const step = 1 / total;

        stories.forEach((story, i) => {
          const cardEl = cardRefs.current[i];
          if (!cardEl) return;

          const startProgress = i * step;
          const isFirst = i === 0;
          const isLast = i === total - 1;

          if (isFirst) {
            // First card starts in place, settles, then exits upward
            gsap.set(cardEl, {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              visibility: 'visible',
              pointerEvents: 'auto'
            });

            // Smooth exit upward & slightly sideways
            tl.to(cardEl, {
              opacity: 0,
              x: story.exit.x,
              y: story.exit.y,
              scale: 0.96,
              rotation: story.exit.rotate,
              pointerEvents: 'none',
              ease: 'power2.inOut',
              duration: step * 0.45,
              force3D: true
            }, startProgress + step * 0.55);
          } else {
            // Cards initially hidden & offset based on their unique entrance trajectory
            gsap.set(cardEl, {
              opacity: 0,
              x: story.entrance.x,
              y: story.entrance.y,
              scale: 0.94,
              rotation: story.entrance.rotate,
              pointerEvents: 'none'
            });

            // Clean entrance into active focus
            tl.to(cardEl, {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              pointerEvents: 'auto',
              ease: 'power2.out',
              duration: step * 0.45,
              force3D: true
            }, startProgress);

            // Exit sequence (unless it's the final endorsement)
            if (!isLast) {
              tl.to(cardEl, {
                opacity: 0,
                x: story.exit.x,
                y: story.exit.y,
                scale: 0.96,
                rotation: story.exit.rotate,
                pointerEvents: 'none',
                ease: 'power2.inOut',
                duration: step * 0.45,
                force3D: true
              }, startProgress + step * 0.55);
            } else {
              // Final card lingers gracefully
              tl.to(cardEl, {
                scale: 1.01,
                duration: step * 0.5,
                ease: 'none',
                force3D: true
              }, startProgress + step * 0.45);
            }
          }
        });
      } else {
        // Mobile scroll-driven typography drift with responsive scrub
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.2,
          }
        });
        if (textRowTopRef.current) {
          mobileTl.to(textRowTopRef.current, { xPercent: -25, ease: 'none', duration: 1 }, 0);
        }
        if (textRowBottomRef.current) {
          mobileTl.to(textRowBottomRef.current, { xPercent: 22, ease: 'none', duration: 1 }, 0);
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleNextMobile = () => {
    setMobileIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrevMobile = () => {
    setMobileIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next
      handleNextMobile();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev
      handlePrevMobile();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="relative w-full bg-[#FBFBFA] text-[#111111] selection:bg-[#111111] selection:text-white border-t border-[#111111]/8"
    >
      {/* Viewport Stage: Fluid responsive height on mobile, pinned height on desktop */}
      <div
        ref={pinSectionRef}
        className="w-full min-h-0 h-auto pt-20 sm:pt-24 md:pt-24 pb-8 sm:pb-10 md:pb-8 md:h-screen md:min-h-[720px] flex flex-col justify-between relative overflow-hidden px-4 sm:px-8 lg:px-14 bg-gradient-to-b from-[#F9F8F5] via-[#FBFBFA] to-[#F5F4F0]"
      >
        {/* Top Header Row (Exact Palmer Style: Brand on left, Rating in center, Location on right) */}
        <div className="relative z-30 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#111111]/10 pb-4 sm:pb-5">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-2">
            <span className="font-sans font-extrabold text-lg sm:text-xl tracking-tight text-[#111111]">
              Shubham®
            </span>
          </div>

          {/* Quick Links / Rating */}
          <div className="flex sm:flex-col items-center sm:items-center justify-between w-full sm:w-auto text-left sm:text-center">
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#111111]/40 mb-0.5 hidden sm:block">
              Endorsements & Reputation
            </span>
            <div className="flex items-center space-x-2 text-xs font-medium text-[#111111]">
              <span className="text-[11px] sm:text-xs">Verified Client Reviews</span>
              <span>•</span>
              <span className="text-[#111111] flex items-center space-x-1 font-semibold text-[11px] sm:text-xs">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#111111]" />
                <span>5.0 Rating</span>
              </span>
            </div>
          </div>

          {/* Location & Title */}
          <div className="hidden sm:block text-right">
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#111111]/40 block mb-0.5">
              Based in Gujarat, India
            </span>
            <span className="text-xs font-semibold text-[#111111]">
              Web Developer + UI Architect
            </span>
          </div>
        </div>

        {/* MASSIVE PALMER BACKGROUND TYPOGRAPHY (Low contrast, repeating across canvas, independent scroll motion) */}
        <div className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none z-0 overflow-hidden">
          
          {/* Top Row - Drifting Left */}
          <div
            ref={textRowTopRef}
            className="whitespace-nowrap font-sans font-black tracking-[-0.04em] uppercase text-[16vw] sm:text-[18vw] leading-none text-[#111111]/[0.05] will-change-transform"
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            Reviews Testimonial© — Reviews Testimonial© — Reviews Testimonial© — Reviews Testimonial© — Reviews Testimonial© — Reviews Testimonial© —
          </div>

          {/* Bottom Row - Drifting Right */}
          <div
            ref={textRowBottomRef}
            className="whitespace-nowrap font-serif italic font-normal tracking-[-0.03em] uppercase text-[15vw] sm:text-[17vw] leading-none text-[#111111]/[0.04] -mt-6 sm:-mt-10 will-change-transform"
            style={{ transform: 'translate3d(-35%, 0, 0)' }}
          >
            Trusted • Endorsements • Proven Results • Reputation • Verified Reviews • High Impact • Trusted • Endorsements • Proven Results • Reputation •
          </div>

        </div>

        {/* DESKTOP ASYMMETRICAL 1-AT-A-TIME STORYTELLING STAGE */}
        <div className="relative z-20 w-full max-w-7xl mx-auto h-[480px] hidden md:block">
          
          {/* Dynamic Positioned Cards: Only one is active at any given scroll point */}
          {stories.map((story, idx) => (
            <div
              key={idx}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className={`absolute ${story.positionClass} will-change-[transform,opacity]`}
            >
              <div
                className="p-7 lg:p-8 rounded-[22px] bg-white/98 backdrop-blur-md border border-[#111111]/12 shadow-[0_25px_55px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_30px_65px_rgba(0,0,0,0.09)] hover:border-[#111111]/25 group"
                data-cursor-text="VERIFIED"
              >
                {/* 5-Star Row + Sector */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-[#111111]">
                    <Star className="w-3.5 h-3.5 fill-[#111111]" />
                    <Star className="w-3.5 h-3.5 fill-[#111111]" />
                    <Star className="w-3.5 h-3.5 fill-[#111111]" />
                    <Star className="w-3.5 h-3.5 fill-[#111111]" />
                    <Star className="w-3.5 h-3.5 fill-[#111111]" />
                  </div>
                  <span className="text-[10px] font-mono-tech tracking-wider text-[#111111]/50 uppercase">
                    {story.sector}
                  </span>
                </div>

                <p className="text-[13px] lg:text-[14px] text-[#111111] leading-[1.65] font-normal mb-8">
                  "{story.quote}"
                </p>

                {/* Author Info with Initial Monogram Badge (No Face Photo) */}
                <div className="flex items-center justify-between pt-5 border-t border-[#111111]/8">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-mono-tech font-bold text-xs tracking-wider shadow-sm flex-shrink-0">
                      {story.initials}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-bold text-[#111111] tracking-tight">{story.author}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#111111]" />
                      </div>
                      <span className="text-[11px] text-[#111111]/60 block font-light mt-0.5">
                        {story.role}, {story.company.split(',')[0]}
                      </span>
                    </div>
                  </div>

                  <div className="font-serif italic font-bold text-sm tracking-tight text-[#111111]/80">
                    {story.badge}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* CENTER PILL: GET IN TOUCH */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto">
            <MagneticElement strength={0.35}>
              <button
                onClick={() => {
                  if (onOpenInquiry) {
                    onOpenInquiry();
                  } else {
                    window.location.href = 'https://wa.me/919427209737';
                  }
                }}
                className="group relative px-9 py-4 rounded-full bg-white border-2 border-[#111111] text-[#111111] font-sans font-extrabold tracking-[0.2em] text-xs uppercase flex items-center space-x-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-300 hover:bg-[#111111] hover:text-white active:scale-95"
                data-cursor="hover"
              >
                <span>GET IN TOUCH</span>
                <ArrowUpRight className="w-4 h-4 text-[#111111] group-hover:text-white transition-colors" />
              </button>
            </MagneticElement>
          </div>

        </div>

        {/* MOBILE RESPONSIVE VERSION (Optimized for handheld phone UX & touch gestures) */}
        <div
          className="relative z-20 max-w-md mx-auto w-full md:hidden flex flex-col justify-center flex-1 my-6"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Quick Client Filter Chips for Mobile Instant Navigation */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-3 mb-3 no-scrollbar -mx-2 px-2">
            {stories.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setMobileIndex(idx)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase whitespace-nowrap transition-all flex-shrink-0 ${
                  mobileIndex === idx
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'bg-white/80 text-[#111111]/65 border border-[#111111]/10 hover:bg-white'
                }`}
              >
                {s.badge}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mobileIndex}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 sm:p-7 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#111111]/10 shadow-[0_15px_40px_rgba(0,0,0,0.06)] space-y-4 sm:space-y-5"
            >
              {/* Header inside card: Stars + Index */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-[#111111]">
                  <Star className="w-3.5 h-3.5 fill-[#111111]" />
                  <Star className="w-3.5 h-3.5 fill-[#111111]" />
                  <Star className="w-3.5 h-3.5 fill-[#111111]" />
                  <Star className="w-3.5 h-3.5 fill-[#111111]" />
                  <Star className="w-3.5 h-3.5 fill-[#111111]" />
                  <span className="ml-1.5 text-[10px] font-bold tracking-wider text-[#111111]/60 uppercase">
                    5.0 Verified
                  </span>
                </div>
                <span className="text-[10px] font-mono-tech text-[#111111]/50 bg-[#111111]/5 px-2 py-0.5 rounded-md">
                  0{mobileIndex + 1} / 0{stories.length}
                </span>
              </div>

              {/* Quote text with fluid typography */}
              <div className="relative">
                <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-[#111111]/15 absolute -top-1 -left-1" />
                <p className="text-[clamp(0.8125rem,3.2vw,0.9375rem)] text-[#111111] leading-relaxed font-normal pt-2 break-words">
                  "{stories[mobileIndex].quote}"
                </p>
              </div>

              {/* Author Row with Typographic Monogram (No Face Photo) */}
              <div className="flex items-center justify-between pt-4 border-t border-[#111111]/8 gap-3">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-mono-tech font-bold text-xs tracking-wider shadow-sm flex-shrink-0">
                    {stories[mobileIndex].initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs sm:text-sm font-bold text-[#111111] truncate">
                        {stories[mobileIndex].author}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#111111]" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-[#111111]/60 block font-light leading-tight mt-0.5 truncate">
                      {stories[mobileIndex].role} — {stories[mobileIndex].company}
                    </span>
                  </div>
                </div>

                <div className="font-serif italic font-bold text-xs text-[#111111]/80 flex-shrink-0">
                  {stories[mobileIndex].badge}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Nav Controls: Dots + Prev/Next Buttons */}
          <div className="flex items-center justify-between mt-4 sm:mt-5 px-1">
            {/* Pagination Indicators */}
            <div className="flex items-center space-x-1.5">
              {stories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setMobileIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    mobileIndex === idx ? 'w-7 bg-[#111111]' : 'w-2 bg-[#111111]/20'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev/Next Touch Buttons (44px min touch target size) */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevMobile}
                className="w-10 h-10 rounded-full bg-white border border-[#111111]/15 flex items-center justify-center text-[#111111] shadow-sm active:scale-90 hover:bg-[#111111] hover:text-white transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMobile}
                className="w-10 h-10 rounded-full bg-white border border-[#111111]/15 flex items-center justify-center text-[#111111] shadow-sm active:scale-90 hover:bg-[#111111] hover:text-white transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Direct CTA on Mobile */}
          <div className="mt-5 sm:mt-6 flex justify-center">
            <button
              onClick={() => {
                if (onOpenInquiry) {
                  onOpenInquiry();
                } else {
                  window.location.href = 'https://wa.me/919979707246';
                }
              }}
              className="w-full py-3.5 sm:py-4 rounded-full bg-[#111111] text-white font-extrabold text-xs tracking-widest uppercase flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-transform"
            >
              <span>GET IN TOUCH</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Section Bottom Status & Progress Indicator */}
        <div className="relative z-30 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#111111]/10 text-[10px] font-bold tracking-[0.2em] uppercase text-[#111111]/45">
          <div className="hidden sm:flex items-center space-x-3">
            <span>SCROLL TO PROGRESS ENDORSEMENTS</span>
            <div className="w-16 h-1 rounded-full bg-[#111111]/10 overflow-hidden">
              <div ref={progressBarRef} className="h-full bg-[#111111] w-0 transition-all duration-75" />
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="font-mono-tech text-[#111111]/80">0{activeStoryIndex + 1} / 0{stories.length}</span>
            <span>•</span>
            <span className="text-[9.5px] sm:text-[10px]">100% VERIFIED CLIENT SATISFACTION</span>
          </div>
        </div>

      </div>
    </section>
  );
};
