import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { MOTION_EASINGS } from '../../lib/motionConfig';
import { applyMode, readStoredMode, type ColorMode } from '../../lib/themes';

interface ModeToggleProps {
  reducedMotion: boolean;
}

/** Light/dark switch: shows the moon in light mode and the sun in dark mode. */
export function ModeToggle({ reducedMotion }: ModeToggleProps) {
  const [mode, setMode] = useState<ColorMode>(() => readStoredMode());
  const target: ColorMode = mode === 'dark' ? 'light' : 'dark';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    applyMode(target, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, reducedMotion);
    setMode(target);
  };

  const Icon = mode === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Switch to ${target} mode`}
      title={`Switch to ${target} mode`}
      data-cursor="button"
      className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 backdrop-blur-xl transition-[border-color,background-color,color,transform] duration-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode}
          initial={reducedMotion ? false : { rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { rotate: 90, scale: 0.5, opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: MOTION_EASINGS.appleEase }}
          className="flex"
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
