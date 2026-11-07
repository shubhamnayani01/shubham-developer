import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, type MotionValue } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { MagneticElement } from './MagneticElement';
import { soundFx } from '../utils/soundEffects';

interface HeaderProps {
  onOpenInquiry: () => void;
  onNavigate: (target: string) => void;
}

interface DockNavItemProps {
  item: { label: string; target: string };
  mouseX: MotionValue<number>;
  isActive: boolean;
  hasDot: boolean;
  onSelect: () => void;
  onHover: () => void;
}

const DockNavItem: React.FC<DockNavItemProps> = ({
  item,
  mouseX,
  isActive,
  hasDot,
  onSelect,
  onHover,
}) => {
  // Static anchor reference that NEVER transforms or scales
  const anchorRef = useRef<HTMLDivElement>(null);
  const centerXRef = useRef<number>(0);
  const [isFocused, setIsFocused] = useState(false);

  // Cache unscaled static center point to eliminate layout thrashing & jitter loops
  const updateCenter = useCallback(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      centerXRef.current = rect.left + rect.width / 2;
    }
  }, []);

  useEffect(() => {
    updateCenter();
    window.addEventListener('resize', updateCenter);
    window.addEventListener('scroll', updateCenter, { passive: true });
    return () => {
      window.removeEventListener('resize', updateCenter);
      window.removeEventListener('scroll', updateCenter);
    };
  }, [updateCenter]);

  // Pure arithmetic distance calculation with ZERO getBoundingClientRect calls during mouse movement
  const distance = useTransform(mouseX, (val: number) => {
    if (val === Infinity) return Infinity;
    if (centerXRef.current === 0 && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      centerXRef.current = rect.left + rect.width / 2;
    }
    return val - centerXRef.current;
  });

  // Authentic macOS dock magnification curve
  // Center item: scale 1.25x, -2.5px vertical lift
  // Neighbor item: scale 1.12x, -1.2px lift
  // Outer item: scale 1.0x, 0px lift
  const scaleSync = useTransform(
    distance,
    [-150, -75, 0, 75, 150],
    [1, 1.12, 1.25, 1.12, 1]
  );
  const scale = useSpring(scaleSync, {
    stiffness: 350,
    damping: 25,
    mass: 0.1,
  });

  const ySync = useTransform(
    distance,
    [-150, -75, 0, 75, 150],
    [0, -1.2, -2.5, -1.2, 0]
  );
  const y = useSpring(ySync, {
    stiffness: 350,
    damping: 25,
    mass: 0.1,
  });

  return (
    <div
      ref={anchorRef}
      className="relative py-1 px-1 flex items-center justify-center"
      onMouseEnter={() => {
        updateCenter();
        onHover();
      }}
    >
      <motion.button
        style={{
          scale: isFocused ? 1.2 : scale,
          y: isFocused ? -2 : y,
          transformOrigin: 'center bottom',
        }}
        onClick={onSelect}
        onFocus={() => {
          setIsFocused(true);
          onHover();
        }}
        onBlur={() => setIsFocused(false)}
        className={`relative transition-colors duration-150 focus:outline-none whitespace-nowrap cursor-pointer select-none ${
          isActive
            ? 'text-[#111111] font-semibold'
            : 'text-[#111111]/55 hover:text-[#111111]'
        }`}
        data-cursor="hover"
        aria-current={isActive ? 'page' : undefined}
      >
        <span className="block tracking-wide">{item.label}</span>
      </motion.button>

      {/* Shared animated black dot indicator anchored to the static slot (never scales or warps) */}
      {hasDot && (
        <motion.span
          layoutId="dockNavIndicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#111111] pointer-events-none"
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 30,
            mass: 0.35,
          }}
        />
      )}
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ onOpenInquiry, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('#hero');

  // Mouse X position for continuous macOS dock magnification
  const mouseX = useMotionValue(Infinity);
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);

  // Track scroll state for blur backdrop & accurate viewport scrollspy
  useEffect(() => {
    let ticking = false;
    const sectionIds = ['hero', 'portfolio', 'testimonials', 'about', 'experience', 'manifesto', 'skills', 'gallery', 'contact'];

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);

          // Accurate viewport-based active section detection (immune to GSAP pin-spacers and offsetParent shifts)
          if (window.scrollY < 80) {
            setActiveSection('#hero');
          } else if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
            setActiveSection('#contact');
          } else {
            const viewportAnchor = Math.min(260, window.innerHeight * 0.35);
            let activeId = 'hero';

            for (const id of sectionIds) {
              const el = document.getElementById(id);
              if (!el) continue;
              const rect = el.getBoundingClientRect();
              if (rect.top <= viewportAnchor && rect.bottom >= 100) {
                activeId = id === 'manifesto' ? 'experience' : id;
              }
            }

            setActiveSection(`#${activeId}`);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle Escape key and window resize for mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Works', target: '#portfolio' },
    { label: 'Reviews', target: '#testimonials' },
    { label: 'About', target: '#about' },
    { label: 'Journey', target: '#experience' },
    { label: 'Skills', target: '#skills' },
    { label: 'Gallery', target: '#gallery' },
    { label: 'Contact', target: '#contact' }
  ];

  // Active indicator destination:
  // When hovering, slides smoothly to hovered item.
  // When mouse leaves, returns smoothly to the currently active page.
  const effectiveActive = navItems.some((n) => n.target === activeSection)
    ? activeSection
    : '#portfolio';
  const activeDotTarget = hoveredTarget ?? effectiveActive;

  return (
    <>
      <header
        id="site-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          isScrolled
            ? 'py-3 sm:py-3.5 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#111111]/8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]'
            : 'py-3.5 sm:py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
          
          {/* Minimalist Brand / Name */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <MagneticElement strength={0.2} onClick={() => onNavigate('#hero')}>
              <button
                className="flex items-center space-x-2.5 text-left group focus:outline-none"
                data-cursor="hover"
                aria-label="Back to top"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#111111] group-hover:scale-125 transition-transform" />
                <span className="text-[13px] sm:text-sm font-semibold tracking-tight text-[#111111] whitespace-nowrap">
                  Shubham Nayani
                </span>
              </button>
            </MagneticElement>

            <span className="hidden xl:inline text-[11px] font-mono-tech text-[#111111]/40 tracking-wider whitespace-nowrap">
              / Kotda Jadodar
            </span>
          </div>

          {/* Minimalist Desktop & Tablet Navigation with macOS Dock Magnification & Sliding Dot */}
          <nav
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => {
              mouseX.set(Infinity);
              setHoveredTarget(null);
            }}
            className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-7 text-[11px] lg:text-[12px] font-medium tracking-wide py-1"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.target;
              const hasDot = activeDotTarget === item.target;

              return (
                <DockNavItem
                  key={item.label}
                  item={item}
                  mouseX={mouseX}
                  isActive={isActive}
                  hasDot={hasDot}
                  onHover={() => {
                    setHoveredTarget(item.target);
                  }}
                  onSelect={() => {
                    setActiveSection(item.target);
                    setHoveredTarget(null);
                    soundFx.playClick(900);
                    onNavigate(item.target);
                  }}
                />
              );
            })}
          </nav>

          {/* Minimalist Right CTA & Mobile Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <MagneticElement strength={0.2} onClick={onOpenInquiry}>
              <button
                id="header-inquire-button"
                className="inline-flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-full border border-[#111111]/20 text-[#111111] hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-all text-[10px] sm:text-[11px] font-medium tracking-wide shadow-none active:scale-95"
                data-cursor="hover"
              >
                <span>Inquire</span>
                <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </MagneticElement>

            {/* Mobile Nav Toggle */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#111111] hover:bg-[#111111]/5 transition-colors focus:outline-none active:scale-95"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Clean Minimalist Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#FBFBFA] pt-20 sm:pt-24 px-6 flex flex-col justify-between pb-8 md:hidden text-[#111111] overflow-y-auto"
          >
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] font-mono-tech uppercase text-[#111111]/40 tracking-widest mb-4 block">
                Navigation
              </span>
              {navItems.map((item, idx) => {
                const isActive = activeSection === item.target;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate(item.target);
                    }}
                    className={`text-left font-serif text-2xl font-light flex items-center justify-between py-3 border-b border-[#111111]/8 transition-colors ${
                      isActive ? 'text-[#111111] font-normal pl-2 border-l-2 border-l-[#111111]' : 'text-[#111111]/70 hover:text-[#111111]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono-tech text-[10px] text-[#111111]/40">
                      0{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-[#111111]/10 flex flex-col space-y-3 mt-6">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiry();
                }}
                className="w-full py-3.5 rounded-full bg-[#111111] text-white text-xs font-medium tracking-widest uppercase flex items-center justify-center space-x-2 shadow-sm active:scale-[0.98] transition-transform"
              >
                <span>Initiate Project Inquiry</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </button>
              <div className="text-center text-[10px] font-mono-tech text-[#111111]/40 uppercase tracking-widest">
                Kotda Jadodar, Gujarat, India
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

