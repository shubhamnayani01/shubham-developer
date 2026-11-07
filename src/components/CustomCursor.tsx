import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export type CursorMode = 'default' | 'hover' | 'view' | 'drag' | 'explore' | 'copy' | 'hidden';

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [cursorText, setCursorText] = useState('');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for high-end inertia feel
  const springConfig = { damping: 28, stiffness: 450, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device supports hover/fine pointer
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Listen to data-cursor attribute changes across the DOM
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const mode = cursorTarget.getAttribute('data-cursor') as CursorMode;
        const text = cursorTarget.getAttribute('data-cursor-text') || '';
        setCursorMode(mode || 'hover');
        setCursorText(text);
      } else if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button'
      ) {
        setCursorMode('hover');
        setCursorText('');
      } else {
        setCursorMode('default');
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  const getCursorSize = () => {
    switch (cursorMode) {
      case 'view':
      case 'explore':
      case 'copy':
        return 88;
      case 'drag':
        return 72;
      case 'hover':
        return 48;
      case 'hidden':
        return 0;
      default:
        return 12;
    }
  };

  const size = getCursorSize();

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Outer Smooth Morphing Circle */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none z-50"
        style={{
          x: smoothX,
          y: smoothY,
          width: size,
          height: size,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor:
            cursorMode === 'view' || cursorMode === 'explore'
              ? '#111111'
              : cursorMode === 'copy'
              ? '#FFFFFF'
              : cursorMode === 'hover'
              ? 'rgba(17, 17, 17, 0.12)'
              : '#111111',
          border: cursorMode === 'hover' ? '1px solid rgba(17, 17, 17, 0.25)' : cursorMode === 'copy' ? '1px solid rgba(17, 17, 17, 0.2)' : 'none',
          backdropFilter: cursorMode === 'hover' ? 'blur(2px)' : 'none',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      >
        {/* Context Text Display (e.g., VIEW, EXPLORE, COPY) */}
        {(cursorMode === 'view' || cursorMode === 'explore' || cursorMode === 'copy' || cursorMode === 'drag') && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className={`text-[11px] font-semibold tracking-widest uppercase font-mono-tech ${
              cursorMode === 'copy' ? 'text-black' : 'text-white'
            }`}
          >
            {cursorText || (cursorMode === 'view' ? 'VIEW' : cursorMode === 'copy' ? 'COPY' : 'DRAG')}
          </motion.span>
        )}
      </motion.div>

      {/* Tiny Instant Center Dot for high-precision clicking feedback */}
      {cursorMode === 'default' && (
        <motion.div
          className="fixed top-0 left-0 w-1.5 h-1.5 bg-black rounded-full pointer-events-none z-50"
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
          }}
        />
      )}
    </div>
  );
};
