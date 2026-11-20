import type { ReactNode } from 'react';
import { MOTION_DURATIONS } from '../../lib/motionConfig';
import { Reveal } from './Reveal';

interface RevealBlockProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  /** Kept for API compatibility; reduced motion is handled by Framer Motion's MotionConfig */
  reducedMotion?: boolean;
}

/** Fade/slide-up block revealed on scroll (thin wrapper over <Reveal>). */
export function RevealBlock({
  children,
  className = '',
  delay = 0,
  yOffset = 24,
  duration = MOTION_DURATIONS.complex,
}: RevealBlockProps) {
  return (
    <Reveal className={className} delay={delay} distance={yOffset} duration={duration} blur>
      {children}
    </Reveal>
  );
}
