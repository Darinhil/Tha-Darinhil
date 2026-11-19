import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  splitTextWords,
} from '../../lib/motionConfig';

interface SectionHeaderProps {
  kicker: string;
  title: string;
  reducedMotion?: boolean;
  className?: string;
  titleClassName?: string;
}

export function SectionHeader({
  kicker,
  title,
  reducedMotion = false,
  className = '',
  titleClassName = '',
}: SectionHeaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);
  const words = splitTextWords(title);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    if (reducedMotion) {
      animatedRef.current = true;
      return;
    }

    const play = () => {
      if (animatedRef.current || !rootRef.current) return;
      animatedRef.current = true;

      const kickerEl = rootRef.current.querySelector('.sh-kicker');
      const ruleEl = rootRef.current.querySelector('.sh-rule');
      const wordEls = rootRef.current.querySelectorAll('.sh-word');

      const tl = gsap.timeline();
      if (kickerEl) {
        tl.fromTo(
          kickerEl,
          { x: -12, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: MOTION_EASINGS.power3Out, clearProps: 'transform,opacity' }
        );
      }
      if (ruleEl) {
        tl.fromTo(
          ruleEl,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.55, ease: MOTION_EASINGS.expoOut, clearProps: 'transform' },
          '-=0.25'
        );
      }
      if (wordEls.length > 0) {
        tl.fromTo(
          wordEls,
          { yPercent: 108, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: MOTION_DURATIONS.complex,
            stagger: 0.035,
            ease: MOTION_EASINGS.expoOut,
            clearProps: 'transform,opacity',
          },
          '-=0.35'
        );
      }
    };

    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.96) {
      play();
      return;
    }

    const wordEls = el.querySelectorAll('.sh-word');
    const kickerEl = el.querySelector('.sh-kicker');
    const ruleEl = el.querySelector('.sh-rule');
    if (kickerEl) gsap.set(kickerEl, { x: -12, opacity: 0 });
    if (ruleEl) gsap.set(ruleEl, { scaleX: 0 });
    if (wordEls.length > 0) gsap.set(wordEls, { yPercent: 108, opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight) {
            play();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 40px 0px' }
    );

    observer.observe(el);

    const onScroll = () => {
      if (animatedRef.current || !rootRef.current) return;
      if (rootRef.current.getBoundingClientRect().top <= window.innerHeight * 0.98) {
        play();
        observer.disconnect();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className={className}>
      <div className="flex items-center gap-3">
        <p className="sh-kicker font-mono text-xs text-[#60A5FA] tracking-wide whitespace-nowrap">
          {kicker}
        </p>
        <span
          aria-hidden="true"
          className="sh-rule h-[1px] w-12 origin-left bg-[#3B82F6]/50"
        />
      </div>

      <h2
        aria-label={title}
        className={`mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F6F9] text-balance ${titleClassName}`}
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-block overflow-hidden align-top mr-[0.26em] pb-[0.06em]"
          >
            <span className="sh-word inline-block will-change-transform">
              {word}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}
