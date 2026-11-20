import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { splitTextWords } from '../../lib/motionConfig';
import { REVEAL_EASE, REVEAL_VIEWPORT } from './Reveal';

interface SectionHeaderProps {
  kicker: string;
  title: string;
  /** Consecutive words of `title` rendered in a muted tone for two-tone headings */
  accent?: string;
  /** Kept for API compatibility; reduced motion is handled by Framer Motion's MotionConfig */
  reducedMotion?: boolean;
  /** Decorative element (e.g. a titled 3D illustration) shown instead of the text label */
  badge?: ReactNode;
  className?: string;
  titleClassName?: string;
}

function parseKicker(kicker: string): { index: string | null; label: string } {
  const match = /^(\d+)\.\s*(.*)$/.exec(kicker);
  return match ? { index: match[1], label: match[2] } : { index: null, label: kicker };
}

function findAccentRange(words: string[], accent?: string): [number, number] | null {
  if (!accent) return null;
  const accentWords = splitTextWords(accent);
  for (let i = 0; i <= words.length - accentWords.length; i += 1) {
    if (accentWords.every((word, offset) => words[i + offset] === word)) {
      return [i, i + accentWords.length - 1];
    }
  }
  return null;
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } },
};

const kickerVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: REVEAL_EASE } },
};

// Each word rises out of its own clipping line
const wordVariants: Variants = {
  hidden: { y: '110%', opacity: 0, rotate: 2 },
  show: { y: '0%', opacity: 1, rotate: 0, transition: { duration: 0.9, ease: REVEAL_EASE } },
};

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

export function SectionHeader({ kicker, title, accent, badge, className = '', titleClassName = '' }: SectionHeaderProps) {
  const reduce = useReducedMotion();
  const words = splitTextWords(title);
  const accentRange = findAccentRange(words, accent);
  const { index, label } = parseKicker(kicker);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={REVEAL_VIEWPORT}
      variants={containerVariants}
    >
      {/* The 3D badge already names the section, so it replaces the text label */}
      {badge ?? (
        <motion.p
          variants={reduce ? fadeVariants : kickerVariants}
          className="flex items-center gap-2 text-sm font-medium text-slate-400"
        >
          {index && <span className="text-brand-400 tabular-nums">{index}</span>}
          {index && (
            <motion.span
              aria-hidden="true"
              className="h-px w-5 origin-left bg-white/15"
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.7, ease: REVEAL_EASE } } }}
            />
          )}
          <span className="whitespace-nowrap">{label}</span>
        </motion.p>
      )}

      <h2
        aria-label={title}
        className={`mt-4 font-display text-[2rem] leading-[1.08] sm:text-[2.75rem] lg:text-[3.25rem] font-semibold tracking-[-0.035em] text-white text-balance ${titleClassName}`}
      >
        {words.map((word, i) => {
          const isAccent = accentRange !== null && i >= accentRange[0] && i <= accentRange[1];
          return (
            <span
              key={`${word}-${i}`}
              aria-hidden="true"
              className="inline-block overflow-hidden align-top mr-[0.24em] pb-[0.08em]"
            >
              <motion.span
                variants={reduce ? fadeVariants : wordVariants}
                className={`inline-block ${isAccent ? 'text-slate-500' : ''}`}
              >
                {word}
              </motion.span>
            </span>
          );
        })}
      </h2>
    </motion.div>
  );
}
