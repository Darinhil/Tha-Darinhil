import { motion } from 'motion/react';
import { REVEAL_VIEWPORT } from '../motion/Reveal';

interface SectionBadge3DProps {
  src: string;
  width: number;
  height: number;
  reducedMotion: boolean;
  className?: string;
}

/** Decorative 3D illustration beside a section label: pops in on scroll, then idles with a gentle float. */
export function SectionBadge3D({ src, width, height, reducedMotion, className = '' }: SectionBadge3DProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={`relative h-24 w-28 shrink-0 sm:h-32 sm:w-36 ${className}`}
      initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ type: 'spring', stiffness: 180, damping: 14 }}
    >
      <div className="absolute inset-2 rounded-full bg-brand-500/30 blur-2xl" />
      <div className={reducedMotion ? 'relative h-full w-full' : 'animate-hero-float relative h-full w-full'}>
        <img
          src={src}
          alt=""
          width={width}
          height={height}
          loading="lazy"
          draggable={false}
          className="h-full w-full select-none object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.45)]"
        />
      </div>
    </motion.div>
  );
}
