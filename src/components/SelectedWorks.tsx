import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  ChevronRight,
  ChevronLeft,
  Pause,
  Play,
  LayoutGrid,
  Columns3,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { CASE_STUDIES } from '../data/portfolioData';
import { CaseStudy } from '../types';
import { soundFx } from '../utils/soundEffects';

interface SelectedWorksProps {
  onSelectCaseStudy: (study: CaseStudy) => void;
}

export const SelectedWorks: React.FC<SelectedWorksProps> = ({ onSelectCaseStudy }) => {
  const containerRef = useRef<HTMLElement>(null);
  const carouselStageRef = useRef<HTMLDivElement>(null);

  // States
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeIndex, setActiveIndex] = useState<number>(1); // Start on a featured project
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(1200);

  // Touch & Drag state
  const dragStartXRef = useRef<number | null>(null);
  const dragDistanceRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Screen resize listener for responsive metrics
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = [
    'All',
    'Brand Systems',
    'Digital Direction',
    'Creative Engineering'
  ];

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return CASE_STUDIES;
    return CASE_STUDIES.filter((cs) => cs.category === activeCategory);
  }, [activeCategory]);

  const total = filteredProjects.length;

  // Safe activeIndex clamp when filtering
  useEffect(() => {
    if (activeIndex >= total) {
      setActiveIndex(0);
    }
  }, [total, activeIndex]);

  // Infinite next / prev helpers
  const handleNext = useCallback(() => {
    if (total === 0) return;
    soundFx.playClick(900);
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    soundFx.playClick(850);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-scroll every 5 seconds (pauses on hover or drag)
  useEffect(() => {
    if (!isAutoPlaying || isHovered || isDragging || viewMode !== 'carousel' || total <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, isDragging, viewMode, total]);

  // Pointer Drag Handlers (Mouse + Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartXRef.current = e.clientX;
    dragDistanceRef.current = 0;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartXRef.current === null) return;
    dragDistanceRef.current = e.clientX - dragStartXRef.current;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartXRef.current !== null) {
      const dist = dragDistanceRef.current;
      if (dist < -50) {
        handleNext();
      } else if (dist > 50) {
        handlePrev();
      }
    }
    dragStartXRef.current = null;
    dragDistanceRef.current = 0;
    setIsDragging(false);
  };

  const handlePointerCancel = () => {
    dragStartXRef.current = null;
    dragDistanceRef.current = 0;
    setIsDragging(false);
  };

  // Card transform math for Apple-style 5-card horizontal carousel
  const getCardTransform = (index: number) => {
    if (total === 0) return { transform: 'none', opacity: 0, zIndex: 0, isVisible: false };

    // Circular relative offset: -total/2 ... +total/2
    let offset = (index - activeIndex) % total;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const isMobile = screenWidth < 640;
    const isTablet = screenWidth >= 640 && screenWidth < 1024;

    // Responsive horizontal step distance between card centers (tuned for wide landscape cards)
    let stepX: number;
    if (isMobile) {
      stepX = Math.min(320, screenWidth * 0.88);
    } else if (isTablet) {
      stepX = Math.min(390, screenWidth * 0.48);
    } else if (screenWidth < 1440) {
      stepX = 440;
    } else {
      stepX = 520;
    }

    const posX = offset * stepX;

    // Visibility bounds:
    // Desktop: 5 cards (offsets -2, -1, 0, 1, 2)
    // Tablet: 3 cards (offsets -1, 0, 1)
    // Mobile: 1.2 cards (offsets -1, 0, 1)
    const maxVisibleOffset = isMobile ? 1 : isTablet ? 1 : 2;
    const isVisible = Math.abs(offset) <= maxVisibleOffset;

    let scale = 1;
    let opacity = 1;
    let rotateY = 0;
    let zIndex = 10;

    if (offset === 0) {
      // Center Active Card: 15-20% larger, full opacity, elevated z-index
      scale = isMobile ? 1.08 : 1.18;
      opacity = 1;
      rotateY = 0;
      zIndex = 30;
    } else if (Math.abs(offset) === 1) {
      // Immediate adjacent cards: scaled down, slightly faded, subtle 3D perspective angle
      scale = isMobile ? 0.88 : 0.92;
      opacity = isMobile ? 0.45 : 0.68;
      rotateY = offset > 0 ? -10 : 10;
      zIndex = 20;
    } else if (Math.abs(offset) === 2) {
      // Outer flanking cards (desktop only)
      scale = 0.78;
      opacity = 0.32;
      rotateY = offset > 0 ? -18 : 18;
      zIndex = 10;
    } else {
      scale = 0.65;
      opacity = 0;
      rotateY = offset > 0 ? -24 : 24;
      zIndex = 0;
    }

    return {
      transform: `translate3d(calc(-50% + ${posX.toFixed(1)}px), -50%, 0px) scale(${scale.toFixed(3)}) rotateY(${rotateY}deg)`,
      opacity: isVisible ? opacity : 0,
      zIndex,
      isVisible,
      offset
    };
  };

  const activeProject = filteredProjects[activeIndex] || filteredProjects[0];

  return (
    <section 
      id="portfolio" 
      ref={containerRef}
      className="relative w-full bg-black text-white pt-10 sm:pt-14 md:pt-16 pb-16 sm:pb-24 md:pb-28 px-3.5 sm:px-8 md:px-12 overflow-hidden select-none"
    >
      {/* Soft Radial Spotlight Glow behind Active Card (Monochrome pure white/silver glow) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] sm:h-[650px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_45%,transparent_75%)] blur-[90px] pointer-events-none z-0"
      />

      {/* Subtle Grain Overlay for Organic Luxury Texture */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-0" 
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 sm:pb-10 border-b border-white/10">
          <div>
            {/* Small Badge above title */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 mb-3.5 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-white/70" />
              <span className="text-[10px] font-mono-tech tracking-[0.25em] text-white/80 uppercase font-semibold">
                MY WORK
              </span>
            </div>

            {/* Large Section Title */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              Featured Projects
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-sans mt-2 max-w-sm">
              High-impact web applications crafted with precision.
            </p>
          </div>

          {/* Controls & Category Filters */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* View Mode Toggle (Carousel / Grid) */}
            <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <button
                onClick={() => {
                  soundFx.playClick(900);
                  setViewMode('carousel');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.15em] uppercase transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
                title="Horizontal 3D Carousel"
              >
                <Columns3 className="w-3 h-3" />
                <span>Carousel</span>
              </button>
              <button
                onClick={() => {
                  soundFx.playClick(900);
                  setViewMode('grid');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.15em] uppercase transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
                title="Showcase Grid"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Grid</span>
              </button>
            </div>

            {/* Auto-play toggle */}
            {viewMode === 'carousel' && (
              <button
                onClick={() => {
                  soundFx.playClick(800);
                  setIsAutoPlaying(!isAutoPlaying);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-[9px] font-mono-tech uppercase transition-all ${
                  isAutoPlaying 
                    ? 'bg-white/10 border-white/20 text-white' 
                    : 'bg-transparent border-white/10 text-white/40'
                }`}
                title={isAutoPlaying ? 'Pause auto-scroll' : 'Resume auto-scroll'}
              >
                {isAutoPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                <span className="hidden sm:inline">{isAutoPlaying ? 'Auto' : 'Paused'}</span>
              </button>
            )}

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    soundFx.playClick(950);
                    setActiveCategory(cat);
                    setActiveIndex(0);
                  }}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase transition-all ${
                    activeCategory === cat
                      ? 'bg-white text-black shadow-md'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* VIEW 1: HORIZONTAL PROJECT CAROUSEL (Primary Apple-inspired Showcase) */}
        {/* =================================================================== */}
        {viewMode === 'carousel' ? (
          <div 
            className="relative w-full py-8 sm:py-16 md:py-20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Floating Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-1 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-13 sm:h-13 rounded-full bg-[#141414]/90 hover:bg-white hover:text-black border border-white/15 backdrop-blur-xl flex items-center justify-center text-white transition-all duration-200 shadow-2xl active:scale-90 cursor-pointer group"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-1 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-13 sm:h-13 rounded-full bg-[#141414]/90 hover:bg-white hover:text-black border border-white/15 backdrop-blur-xl flex items-center justify-center text-white transition-all duration-200 shadow-2xl active:scale-90 cursor-pointer group"
              aria-label="Next project"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Central 3D Carousel Stage */}
            <div 
              ref={carouselStageRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              className="relative w-full h-[clamp(280px,58vw,340px)] sm:h-[360px] md:h-[400px] lg:h-[430px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
              style={{ perspective: '1200px' }}
            >
              {filteredProjects.map((project, index) => {
                const { transform, opacity, zIndex, isVisible, offset } = getCardTransform(index);
                const isActive = offset === 0;

                return (
                  <div
                    key={project.id}
                    onClick={() => {
                      if (isActive) {
                        soundFx.playClick(900);
                        onSelectCaseStudy(project);
                      } else {
                        soundFx.playClick(850);
                        setActiveIndex(index);
                      }
                    }}
                    style={{
                      transform,
                      opacity,
                      zIndex,
                      pointerEvents: isVisible ? 'auto' : 'none',
                      transition: isDragging 
                        ? 'none' 
                        : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease, box-shadow 0.5s ease'
                    }}
                    className={`absolute top-1/2 left-1/2 w-[clamp(300px,86vw,380px)] sm:w-[480px] md:w-[540px] lg:w-[600px] h-[clamp(240px,50vw,280px)] sm:h-[320px] md:h-[350px] lg:h-[380px] rounded-[24px] overflow-hidden cursor-pointer group will-change-transform ${
                      isActive
                        ? 'ring-1 ring-white/40 shadow-[0_0_50px_rgba(255,255,255,0.12),0_25px_60px_rgba(0,0,0,0.95)]'
                        : 'shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:opacity-90'
                    }`}
                  >
                    {/* Glassmorphic Background Card Container */}
                    <div className="relative w-full h-full bg-[#111111]/90 backdrop-blur-xl border border-white/15 rounded-[24px] overflow-hidden flex flex-col justify-between">
                      
                      {/* High-Resolution Project Hero Image with Browser Mockup Header */}
                      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0D0D11] flex flex-col">
                        {/* Browser window chrome dots */}
                        <div className="w-full h-6 bg-black/75 backdrop-blur-md border-b border-white/10 px-3 flex items-center space-x-1.5 shrink-0 z-10">
                          <span className="w-2 h-2 rounded-full bg-[#FF5F56]/80" />
                          <span className="w-2 h-2 rounded-full bg-[#FFBD2E]/80" />
                          <span className="w-2 h-2 rounded-full bg-[#27C93F]/80" />
                          <span className="ml-2 text-[8px] font-mono text-white/30 truncate">
                            {project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '') : project.title.toLowerCase()}
                          </span>
                        </div>

                        {/* Image stage */}
                        <div className="relative flex-1 w-full h-full overflow-hidden bg-[#16161D]">
                          <img
                            src={project.heroImage}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          {/* Multi-Stop Vignette Overlay for bottom text legibility */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                          {isActive && (
                            <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
                          )}
                        </div>
                      </div>

                      {/* Top Unboxed Metadata */}
                      <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/80 drop-shadow-sm">
                          <span>{project.category}</span>
                          <span className="text-white/40">·</span>
                          <span className="text-white/60">{project.year}</span>
                        </div>

                        {project.liveUrl && (
                          <div className="flex items-center space-x-1.5 text-[9px] font-mono uppercase tracking-wider text-white/90 drop-shadow-sm bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/15">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>Live</span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Content Area: Project Name + Description + Launch Arrow */}
                      <div className="relative z-10 p-4 sm:p-6 space-y-2">
                        <div className="flex items-end justify-between gap-4">
                          <div className="pr-2 min-w-0 flex-1">
                            <h3 className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-white font-normal leading-tight group-hover:text-white/90 transition-colors truncate">
                              {project.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/70 line-clamp-1 leading-relaxed font-light mt-0.5">
                              {project.subtitle || project.overview}
                            </p>
                          </div>

                          <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                            isActive
                              ? 'bg-white text-black scale-105 shadow-white/10'
                              : 'bg-white/15 text-white backdrop-blur-sm group-hover:bg-white group-hover:text-black'
                          }`}>
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Active Card Subtle Edge Sheen */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-[24px] pointer-events-none border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Indicator Bar: Dots + Hint */}
            <div className="flex flex-col items-center justify-center space-y-3 pt-6 z-20">
              {/* Pagination Dots */}
              <div className="flex items-center space-x-2">
                {filteredProjects.map((proj, idx) => {
                  const isCurrent = idx === activeIndex;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => {
                        soundFx.playClick(900);
                        setActiveIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        isCurrent 
                          ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' 
                          : 'w-2 bg-white/25 hover:bg-white/50'
                      }`}
                      aria-label={`Go to project ${idx + 1}`}
                    />
                  );
                })}
              </div>

              {/* Exploration Hint */}
              <div className="text-center text-white/40 text-[9.5px] sm:text-[10px] font-mono-tech tracking-[0.2em] uppercase">
                Scroll or use arrows to explore • Tap to inspect case study
              </div>
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* VIEW 2: SHOWCASE GRID (Clean Multi-Card Editorial Catalog) */
          /* =================================================================== */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-10"
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  soundFx.playClick(900);
                  onSelectCaseStudy(project);
                }}
                className="group relative rounded-[24px] overflow-hidden bg-[#111111]/90 backdrop-blur-xl border border-white/15 p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all duration-300 cursor-pointer"
              >
                {/* Image Showcase */}
                <div className="relative w-full aspect-[16/10] rounded-[18px] overflow-hidden bg-[#16161D] border border-white/10 flex flex-col">
                  {/* Browser top pill */}
                  <div className="w-full h-5 bg-black/80 px-2.5 flex items-center space-x-1.5 shrink-0 border-b border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F]/80" />
                  </div>
                  <div className="relative flex-1 w-full h-full overflow-hidden bg-[#16161D]">
                    <img
                      src={project.heroImage}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-contain object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                  
                  {project.liveUrl && (
                    <span className="absolute top-2.5 right-2.5 z-10 flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-[9px] font-mono-tech text-white uppercase font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>LIVE</span>
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-tech text-white/70 font-bold uppercase tracking-wider">
                      {project.category}
                    </span>
                    <span className="text-[10px] font-mono-tech text-white/40">
                      {project.year}
                    </span>
                  </div>
                  <h3 className="font-serif italic text-2xl text-white group-hover:text-white/90 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                    {project.overview || project.subtitle}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono-tech text-white/70">
                  <span className="group-hover:text-white transition-colors">Launch Case Study</span>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
};
