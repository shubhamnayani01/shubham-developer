import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  MapPin,
  Sliders,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Compass,
  Info
} from 'lucide-react';
import { INITIAL_PHOTOGRAPHY_ARCHIVE, PhotoItem } from '../data/photographyData';

gsap.registerPlugin(ScrollTrigger);

interface SpatialPosition {
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
}

interface FloatingCardItem {
  instanceId: string;
  photo: PhotoItem;
  originalIndex: number;
  spatial: SpatialPosition;
}

export const EditorialGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stage3dRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [archive] = useState<PhotoItem[]>(INITIAL_PHOTOGRAPHY_ARCHIVE);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<PhotoItem | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [showMetadataHud, setShowMetadataHud] = useState<boolean>(true);
  const [activeFrameNumber, setActiveFrameNumber] = useState<number>(1);
  const [mouseParallax, setMouseParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch swipe support for Lightbox
  const lightboxTouchStartXRef = useRef<number | null>(null);
  const lightboxTouchEndXRef = useRef<number | null>(null);

  const displayedPhotos = archive;
  const generateSpatialCards = useCallback((photos: PhotoItem[], isMobile: boolean, isTablet: boolean): FloatingCardItem[] => {
    if (photos.length === 0) return [];

    const workingPhotos = [...photos];

    const items: FloatingCardItem[] = [];
    const occupiedPositions: { x: number; y: number }[] = [];
    const desktopLanes = [-440, -150, 150, 440];
    const tabletLanes = [-220, 220];
    const mobileLanes = [-45, 45];
    const lanes = isMobile ? mobileLanes : isTablet ? tabletLanes : desktopLanes;
    const minVerticalGap = isMobile ? 280 : 340;
    const minHorizontalGap = isMobile ? 100 : 220;
    let currentBaseY = isMobile ? -80 : -100;
    workingPhotos.forEach((photo, idx) => {
      const laneIndex = idx % lanes.length;
      const baseLaneX = lanes[laneIndex];
      const jitterX = Math.sin((idx + 1) * 3.7) * (isMobile ? 12 : 45);
      let candidateX = baseLaneX + jitterX;
      let candidateY = currentBaseY + (Math.cos((idx + 1) * 2.3) * (isMobile ? 30 : 55));
      let attempts = 0;
      let collision = true;
      while (collision && attempts < 20) {
        collision = occupiedPositions.some((pos) => {
          const dx = Math.abs(pos.x - candidateX);
          const dy = Math.abs(pos.y - candidateY);
          return dx < minHorizontalGap && dy < minVerticalGap;
        });

        if (collision) {
          candidateY += 90; // push down vertically until safe
          candidateX += (attempts % 2 === 0 ? 25 : -25);
        }
        attempts++;
      }

      occupiedPositions.push({ x: candidateX, y: candidateY });
      currentBaseY = candidateY + (minVerticalGap * 0.65);

      // Depth layers (Z)
      const isForeground = idx % 3 === 1;
      const baseZ = isMobile
        ? (isForeground ? 35 : -50)
        : (isForeground ? 100 + (idx % 2) * 30 : -130 - (idx % 3) * 25);

      // Rotations: natural physical photograph tilt
      const xRatio = candidateX / (isMobile ? 150 : 500);
      const rotateY = -xRatio * (isMobile ? 6 : 10) + (Math.sin(idx * 1.9) * 2.5);
      const rotateZ = (idx % 2 === 0 ? -1 : 1) * (1.5 + (idx % 3) * 0.8);
      const rotateX = (idx % 3 === 0 ? -2 : 2);
      const scale = isMobile ? 0.92 : (baseZ > 0 ? 1.02 : 0.96);

      items.push({
        instanceId: `photo-card-${photo.id}`,
        photo,
        originalIndex: idx,
        spatial: {
          x: candidateX,
          y: candidateY,
          z: baseZ,
          rotateX,
          rotateY,
          rotateZ,
          scale
        }
      });
    });

    return items;
  }, []);

  const [windowDimensions, setWindowDimensions] = useState<{ isMobile: boolean; isTablet: boolean }>({
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    isTablet: typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const spatialCards = useMemo(() => {
    return generateSpatialCards(displayedPhotos, windowDimensions.isMobile, windowDimensions.isTablet);
  }, [displayedPhotos, generateSpatialCards, windowDimensions.isMobile, windowDimensions.isTablet]);

  // GSAP 100% Scroll-Linked Scrub Physics Animation (Finite for exact photo count)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !cardsContainerRef.current || spatialCards.length === 0) return;

      const isMobile = window.innerWidth < 768;
      const totalCards = spatialCards.length;

      // Calculate total flight span based on exact card count and furthest card Y
      const maxY = Math.max(...spatialCards.map(c => c.spatial.y));
      const totalScrollFlight = maxY + (isMobile ? 180 : 240);
      // Comfortable scroll pin distance so user smoothly glides through each frame without abrupt ejection
      const scrollDistance = isMobile
        ? Math.max(totalCards * 280, 1200)
        : Math.max(totalCards * 360, 2200);

      // Pinned GSAP ScrollTrigger with scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${scrollDistance}`,
          pin: true,
          scrub: 1.0, // Direct 1:1 scroll responsiveness with zero autoplay
          anticipatePin: 0, // Disable anticipatePin to prevent premature snap-teleporting
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.round(self.progress * 100)}%`;
            }
            const activeIdx = Math.min(
              Math.floor(self.progress * displayedPhotos.length) + 1,
              displayedPhotos.length
            );
            setActiveFrameNumber(activeIdx);
          }
        }
      });

      spatialCards.forEach((item, idx) => {
        const el = cardElementsRef.current[idx];
        if (!el) return;

        const { x, y, z, rotateX, rotateY, rotateZ, scale } = item.spatial;
        const targetY = y - totalScrollFlight;

        // Set initial true 3D spatial position
        gsap.set(el, {
          x: x,
          y: y,
          z: z,
          rotationX: rotateX,
          rotationY: rotateY,
          rotationZ: rotateZ,
          scale: scale,
          transformPerspective: isMobile ? 1800 : 2200,
          transformStyle: 'preserve-3d',
          force3D: true,
          willChange: 'transform, opacity'
        });

        // 100% Scroll-driven vertical flight through camera space
        tl.to(el, {
          y: targetY,
          rotationX: rotateX * -0.5,
          rotationY: rotateY * 0.9,
          rotationZ: rotateZ * 1.1,
          ease: 'none',
          force3D: true
        }, 0);
      });
    }, containerRef);

    return () => ctx.revert();
  }, [spatialCards, displayedPhotos.length]);

  // Subtle Mouse Parallax camera tilt on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseParallax({
      x: xRatio * 2.2, // Subtle ±2.2 deg camera rotation
      y: -yRatio * 1.8
    });
  };

  const handleMouseLeave = () => {
    setMouseParallax({ x: 0, y: 0 });
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeLightboxPhoto) return;

      if (e.key === 'Escape') {
        setActiveLightboxPhoto(null);
        setIsZoomed(false);
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxPhoto, displayedPhotos]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (activeLightboxPhoto) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [activeLightboxPhoto]);

  const handleOpenLightbox = (photo: PhotoItem) => {
    setActiveLightboxPhoto(photo);
    setIsZoomed(false);
  };

  const handleCloseLightbox = () => {
    setActiveLightboxPhoto(null);
    setIsZoomed(false);
  };

  const handleNextPhoto = () => {
    if (!activeLightboxPhoto) return;
    const currentIndex = displayedPhotos.findIndex((p) => p.id === activeLightboxPhoto.id);
    const nextIndex = (currentIndex + 1) % displayedPhotos.length;
    setActiveLightboxPhoto(displayedPhotos[nextIndex]);
    setIsZoomed(false);
  };

  const handlePrevPhoto = () => {
    if (!activeLightboxPhoto) return;
    const currentIndex = displayedPhotos.findIndex((p) => p.id === activeLightboxPhoto.id);
    const prevIndex = (currentIndex - 1 + displayedPhotos.length) % displayedPhotos.length;
    setActiveLightboxPhoto(displayedPhotos[prevIndex]);
    setIsZoomed(false);
  };

  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxTouchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleLightboxTouchMove = (e: React.TouchEvent) => {
    lightboxTouchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleLightboxTouchEnd = () => {
    if (!lightboxTouchStartXRef.current || !lightboxTouchEndXRef.current) return;
    const diff = lightboxTouchStartXRef.current - lightboxTouchEndXRef.current;
    const minSwipe = 40;

    if (diff > minSwipe) {
      // Swiped Left -> Next Photo
      handleNextPhoto();
    } else if (diff < -minSwipe) {
      // Swiped Right -> Prev Photo
      handlePrevPhoto();
    }

    lightboxTouchStartXRef.current = null;
    lightboxTouchEndXRef.current = null;
  };

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative w-full bg-[#FBFBFA] text-[#111111] border-t border-[#111111]/8 select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Pinned Virtual Camera Viewport Stage (100dvh for mobile address bar safety) */}
      <div className="w-full h-[100dvh] sm:h-screen sm:min-h-[700px] flex flex-col justify-between relative overflow-hidden px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-[#F9F8F5] via-[#FBFBFA] to-[#F5F4F0]">

        {/* TOP TITLE ROW */}
        <div className="relative z-40 max-w-7xl mx-auto w-full flex items-center justify-between pt-16 sm:pt-24 pb-3 sm:pb-4 border-b border-[#111111]/10">
          <span className="font-sans font-extrabold text-base sm:text-2xl tracking-tight text-[#111111]">
            Shubham's 3D Gallery©
          </span>
        </div>

        {/* 3D SCENE PERSPECTIVE VIEWPORT (Virtual Camera Space) */}
        <div
          className="relative w-full flex-1 flex items-center justify-center overflow-visible z-20 pointer-events-auto"
          style={{
            perspective: windowDimensions.isMobile ? '1800px' : '2200px',
            perspectiveOrigin: '50% 50%',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Interactive Mouse Tilt Gyro Layer */}
          <div
            ref={stage3dRef}
            className="relative w-full max-w-7xl h-full flex items-center justify-center transition-transform duration-700 ease-out will-change-transform pointer-events-none"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${mouseParallax.x}deg) rotateX(${mouseParallax.y}deg)`
            }}
          >
            {/* FLOATING DISTRIBUTED 3D CARDS CONTAINER */}
            <div
              ref={cardsContainerRef}
              className="relative w-full h-full flex items-center justify-center pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {spatialCards.map((item, index) => {
                const { photo, spatial, instanceId } = item;
                const isForeground = spatial.z > 50;
                const isLandscape = photo.aspectRatio.startsWith('landscape');

                return (
                  <div
                    key={instanceId}
                    ref={(el) => {
                      cardElementsRef.current[index] = el;
                    }}
                    className="absolute pointer-events-auto cursor-pointer group select-none"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden'
                    }}
                    onClick={() => handleOpenLightbox(photo)}
                    data-cursor="view"
                    data-cursor-text="VIEW"
                  >
                    {/* Palmer Photography Card: Unique Distributed Canvas Item */}
                    <div
                      className={`relative rounded-[18px] sm:rounded-[24px] bg-white/95 backdrop-blur-sm border border-[#111111]/12 p-3 sm:p-4 overflow-hidden transition-all duration-400 ease-out hover:border-[#111111]/40 hover:scale-[1.025] ${isLandscape
                          ? isForeground
                            ? 'w-[250px] sm:w-[370px] lg:w-[430px] shadow-[0_28px_60px_-15px_rgba(0,0,0,0.12)] ring-1 ring-black/5'
                            : 'w-[230px] sm:w-[340px] lg:w-[390px] shadow-[0_20px_45px_-12px_rgba(0,0,0,0.08)] opacity-95'
                          : isForeground
                            ? 'w-[210px] sm:w-[310px] lg:w-[360px] shadow-[0_28px_60px_-15px_rgba(0,0,0,0.12)] ring-1 ring-black/5'
                            : 'w-[195px] sm:w-[280px] lg:w-[330px] shadow-[0_20px_45px_-12px_rgba(0,0,0,0.08)] opacity-95'
                        }`}
                    >
                      {/* Image Frame with Dynamic Aspect Ratio */}
                      <div
                        className={`relative w-full rounded-[14px] sm:rounded-[18px] overflow-hidden bg-[#ECE8E1] border border-black/5 ${isLandscape ? 'aspect-[16/10]' : 'aspect-[4/5]'
                          }`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-105"
                        />

                        {/* Series Badge in Top Corner */}
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/5 text-[9px] font-mono-tech font-bold uppercase tracking-wider text-[#111111]">
                          {photo.series}
                        </div>

                        {/* Expand Indicator on Hover */}
                        <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md border border-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                          <Maximize2 className="w-3.5 h-3.5 text-[#111111]" />
                        </div>
                      </div>

                      {/* Card Footer Metadata (Palmer Minimalist Layout) */}
                      <div className="pt-3 pb-0.5 px-1 flex items-center justify-between">
                        <div className="overflow-hidden pr-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono-tech font-bold text-[#9E7D47]">
                              {item.originalIndex < 9 ? `0${item.originalIndex + 1}` : item.originalIndex + 1}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-[#111111] truncate tracking-tight">
                              {photo.title}
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-[10.5px] text-[#111111]/60 block truncate font-light mt-0.5">
                            {photo.location}
                          </span>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-[10px] font-mono-tech uppercase text-[#111111]/70 font-semibold block">
                            {photo.year}
                          </span>
                          {photo.camera && (
                            <span className="text-[8.5px] sm:text-[9px] font-mono-tech text-[#111111]/45 block">
                              {photo.camera.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM HUD CONTROLS & SCROLL PROGRESS BAR */}
        <div className="relative z-40 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-6 sm:pb-8 border-t border-[#111111]/10 text-[10px] font-bold tracking-[0.2em] uppercase text-[#111111]/50">

          {/* Scroll Direction Prompt */}
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 animate-spin [animation-duration:12s]" />
              <span>SCROLL TO DRIFT THROUGH 3D VIRTUAL SPACE</span>
            </span>
            <div className="w-20 h-1 rounded-full bg-[#111111]/10 overflow-hidden hidden sm:block">
              <div
                ref={progressBarRef}
                className="h-full bg-[#111111] w-0 transition-all duration-75"
              />
            </div>
          </div>

          {/* Active Telemetry & Index */}
          <div className="flex items-center space-x-4">
            <span className="font-mono-tech text-[#111111]">
              FRAME {activeFrameNumber < 10 ? `0${activeFrameNumber}` : activeFrameNumber} / {displayedPhotos.length < 10 ? `0${displayedPhotos.length}` : displayedPhotos.length}
            </span>
            <span>•</span>
            <span className="hidden sm:inline">60 FPS HARDWARE ACCELERATED</span>
          </div>

        </div>

      </div>

      {/* FULLSCREEN MUSEUM LIGHTBOX INSPECTOR - PORTALED TO DOCUMENT.BODY */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeLightboxPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => {
                // Clicking the dark backdrop outside controls closes the lightbox
                if (e.target === e.currentTarget) {
                  handleCloseLightbox();
                }
              }}
              className="fixed inset-0 z-[99999] bg-[#0A0A0D]/95 backdrop-blur-2xl text-white flex flex-col justify-between h-[100dvh] w-screen overflow-y-auto overflow-x-hidden p-3 sm:p-6 select-none"
            >
              {/* PROMINENT ALWAYS-VISIBLE FLOATING EXIT BUTTON */}
              <button
                onClick={handleCloseLightbox}
                className="fixed top-3 right-3 sm:top-5 sm:right-6 z-[100000] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 active:scale-95 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.6)] border border-white/50 flex items-center space-x-1.5 cursor-pointer font-mono text-xs font-bold uppercase tracking-wider"
                aria-label="Close photo preview"
                title="Exit (Esc)"
              >
                <X className="w-4 h-4 text-black stroke-[2.5]" />
                <span>EXIT</span>
              </button>

              {/* Top Lightbox Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-3 pr-24 sm:pr-28">
                <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
                  <span className="text-[10px] sm:text-xs font-mono uppercase text-white/50 tracking-widest shrink-0">
                    EXHIBITION
                  </span>
                  <span className="text-xs text-white/30 hidden sm:inline">•</span>
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {activeLightboxPhoto.title}
                  </span>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
                    title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                    aria-label="Toggle zoom"
                  >
                    {isZoomed ? <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                  <button
                    onClick={() => setShowMetadataHud(!showMetadataHud)}
                    className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white hidden sm:flex cursor-pointer"
                    title="Toggle Telemetry HUD"
                    aria-label="Toggle metadata"
                  >
                    <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Central Stage: High-Resolution Photo */}
              <div
                className="relative flex-1 flex items-center justify-center overflow-hidden my-2 sm:my-3 touch-pan-y min-h-[40vh] max-h-[56vh] sm:max-h-[66vh]"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    handleCloseLightbox();
                  }
                }}
                onTouchStart={handleLightboxTouchStart}
                onTouchMove={handleLightboxTouchMove}
                onTouchEnd={handleLightboxTouchEnd}
              >
                {/* Prev Button */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-2 sm:left-6 z-30 p-2.5 sm:p-3 rounded-full bg-black/75 hover:bg-black border border-white/25 text-white transition-transform active:scale-90 cursor-pointer shadow-xl"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Main Image Container */}
                <motion.div
                  key={activeLightboxPhoto.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: isZoomed ? 1.35 : 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`relative max-w-5xl max-h-[54vh] sm:max-h-[64vh] transition-all cursor-${isZoomed ? 'zoom-out' : 'zoom-in'}`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <img
                    src={activeLightboxPhoto.url}
                    alt={activeLightboxPhoto.title}
                    decoding="async"
                    className="w-full h-full object-contain max-h-[52vh] sm:max-h-[62vh] rounded-xl shadow-2xl select-none"
                  />
                </motion.div>

                {/* Next Button */}
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-2 sm:right-6 z-30 p-2.5 sm:p-3 rounded-full bg-black/75 hover:bg-black border border-white/25 text-white transition-transform active:scale-90 cursor-pointer shadow-xl"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Bottom Telemetry HUD Details */}
              {showMetadataHud && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-5xl mx-auto w-full grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-md text-xs shrink-0"
                >
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-mono-tech uppercase text-white/50 block mb-0.5 sm:mb-1">
                      Location & Year
                    </span>
                    <div className="flex items-center space-x-1 font-medium text-white text-[11px] sm:text-xs">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70 shrink-0" />
                      <span className="truncate">{activeLightboxPhoto.location}, {activeLightboxPhoto.year}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] sm:text-[10px] font-mono-tech uppercase text-white/50 block mb-0.5 sm:mb-1">
                      Camera & Body
                    </span>
                    <div className="flex items-center space-x-1 font-medium text-white text-[11px] sm:text-xs">
                      <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70 shrink-0" />
                      <span className="truncate">{activeLightboxPhoto.camera || 'Leica Optics'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] sm:text-[10px] font-mono-tech uppercase text-white/50 block mb-0.5 sm:mb-1">
                      Lens & Exposure
                    </span>
                    <div className="flex items-center space-x-1 font-medium text-white text-[11px] sm:text-xs">
                      <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70 shrink-0" />
                      <span className="truncate">{activeLightboxPhoto.settings || '1/500s · f/2.8'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] sm:text-[10px] font-mono-tech uppercase text-white/50 block mb-0.5 sm:mb-1">
                      Edition Series
                    </span>
                    <div className="flex items-center space-x-1 font-medium text-white font-mono-tech text-[11px] sm:text-xs">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70 shrink-0" />
                      <span className="truncate">{activeLightboxPhoto.edition || 'Edition 01/10'}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Bottom Quick Dismiss Helper Note for Mobile */}
              <div className="pt-1.5 text-center text-[9px] sm:text-[10px] font-mono text-white/40">
                Tap background or tap [EXIT] button to close
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};
