import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'motion/react';

/**
 * Scroll-reveal toolkit (Framer Motion `whileInView` / `useScroll`).
 * Every reveal plays once, when roughly a fifth of the element has cleared the
 * bottom 10% of the viewport. With prefers-reduced-motion, movement is dropped
 * and only opacity fades remain.
 */

export const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

export const REVEAL_VIEWPORT = { once: true, amount: 0.2, margin: '0px 0px -10% 0px' } as const;

const MOTION_TAGS = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
  section: motion.section,
  ul: motion.ul,
} as const;

type RevealTag = keyof typeof MOTION_TAGS;
type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case 'up':
      return { y: distance };
    case 'down':
      return { y: -distance };
    case 'left':
      return { x: -distance };
    case 'right':
      return { x: distance };
    default:
      return {};
  }
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: RevealTag;
  direction?: Direction;
  distance?: number;
  delay?: number;
  duration?: number;
  /** Soft focus-pull as it appears (used for headings/copy) */
  blur?: boolean;
  /** Share of the element that must be visible before it plays */
  amount?: number;
}

/** Fade + slide into place when scrolled into view. */
export function Reveal({
  children,
  className,
  as = 'div',
  direction = 'up',
  distance = 28,
  delay = 0,
  duration = 0.9,
  blur = false,
  amount,
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = MOTION_TAGS[as];

  const hidden = reduce
    ? { opacity: 0 }
    : { opacity: 0, ...offsetFor(direction, distance), ...(blur ? { filter: 'blur(8px)' } : {}) };
  const shown = reduce
    ? { opacity: 1 }
    : { opacity: 1, x: 0, y: 0, ...(blur ? { filter: 'blur(0px)' } : {}) };

  return (
    <Tag
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ ...REVEAL_VIEWPORT, ...(amount !== undefined ? { amount } : {}) }}
      transition={{ duration: reduce ? 0.4 : duration, delay, ease: REVEAL_EASE }}
    >
      {children}
    </Tag>
  );
}

/* ---------- Staggered groups ---------- */

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: REVEAL_EASE } },
};

const reducedItemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

interface StaggerProps {
  children: ReactNode;
  className?: string;
  as?: RevealTag;
  stagger?: number;
  delay?: number;
  amount?: number;
}

/** Parent that reveals its <StaggerItem> children one after another. */
export function Stagger({ children, className, as = 'div', stagger = 0.09, delay = 0, amount }: StaggerProps) {
  const reduce = useReducedMotion();
  const Tag = MOTION_TAGS[as];

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ ...REVEAL_VIEWPORT, ...(amount !== undefined ? { amount } : {}) }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } },
      }}
    >
      {children}
    </Tag>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  as?: RevealTag;
  onMouseEnter?: () => void;
}

export function StaggerItem({ children, className, as = 'div', onMouseEnter }: StaggerItemProps) {
  const reduce = useReducedMotion();
  const Tag = MOTION_TAGS[as];
  return (
    <Tag className={className} onMouseEnter={onMouseEnter} variants={reduce ? reducedItemVariants : staggerItemVariants}>
      {children}
    </Tag>
  );
}

/* ---------- Image curtain reveal ---------- */

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Media un-clips from the centre while the content inside settles from a slight zoom. */
export function ImageReveal({ children, className, delay = 0 }: ImageRevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={REVEAL_VIEWPORT}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(10% 8% 10% 8%)', opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 1.25, delay, ease: REVEAL_EASE }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.14 }}
        whileInView={{ scale: 1 }}
        viewport={REVEAL_VIEWPORT}
        transition={{ duration: 1.6, delay, ease: REVEAL_EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ---------- Parallax ---------- */

const PARALLAX_QUERY = '(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)';

/** Parallax only on large, pointer-driven screens without reduced-motion. */
export function useParallaxEnabled(): boolean {
  const [enabled, setEnabled] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(PARALLAX_QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia(PARALLAX_QUERY);
    const update = () => setEnabled(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return enabled;
}

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Pixels travelled across the element's pass through the viewport (positive = moves up) */
  offset?: number;
}

/** Drifts its content slower than the page scroll while it passes through the viewport. */
export function Parallax({ children, className, offset = 60 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useParallaxEnabled();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} className={className} style={enabled ? { y } : undefined}>
      {children}
    </motion.div>
  );
}
