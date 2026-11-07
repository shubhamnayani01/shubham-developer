import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../utils/soundEffects';

interface MagneticElementProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
  id?: string;
  playHoverSound?: boolean;
}

export const MagneticElement: React.FC<MagneticElementProps> = ({
  children,
  strength = 0.35,
  className = '',
  onClick,
  id,
  playHoverSound = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;
    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseEnter = () => {
    if (playHoverSound) {
      soundFx.playHoverTone();
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = () => {
    soundFx.playClick();
    if (onClick) onClick();
  };

  return (
    <motion.div
      ref={ref}
      id={id}
      className={`inline-block cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 20, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
