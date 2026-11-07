import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useLenisSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Only enable heavy Lenis smooth scrolling on desktop devices with fine pointers
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    
    if (isTouch) {
      // On mobile/touch devices, use native browser acceleration for buttery 120Hz/60Hz scrolling
      return;
    }

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
      infinite: false,
      allowNestedScroll: true,
      prevent: (node) => {
        // Prevent Lenis from intercepting wheel/scroll events if the element has data-lenis-prevent
        // or is inside a scrollable modal / drawer
        return (
          node.hasAttribute?.('data-lenis-prevent') ||
          !!node.closest?.('[data-lenis-prevent]') ||
          !!node.closest?.('#case-study-modal') ||
          !!node.closest?.('#project-inquiry-modal')
        );
      },
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (target: string | HTMLElement, offset = 0) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset, duration: 1.2 });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const stop = () => {
    lenisRef.current?.stop();
  };

  const start = () => {
    lenisRef.current?.start();
  };

  return { lenis: lenisRef.current, scrollTo, stop, start };
}

