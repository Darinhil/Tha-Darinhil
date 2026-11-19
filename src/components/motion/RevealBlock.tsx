import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { MOTION_DURATIONS, MOTION_EASINGS } from '../../lib/motionConfig';

interface RevealBlockProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  reducedMotion?: boolean;
}

export function RevealBlock({
  children,
  className = '',
  delay = 0,
  yOffset = 24,
  duration = MOTION_DURATIONS.complex,
  reducedMotion = false,
}: RevealBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      revealedRef.current = true;
      return;
    }

    const revealNow = () => {
      if (revealedRef.current || !ref.current) return;
      revealedRef.current = true;
      gsap.fromTo(
        ref.current,
        { y: yOffset, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          ease: MOTION_EASINGS.power3Out,
          clearProps: 'transform,opacity',
        }
      );
    };

    // If element is already inside or above the current viewport, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.96) {
      revealNow();
      return;
    }

    // Set initial hidden state only when below the fold
    gsap.set(el, { y: yOffset, opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight) {
            revealNow();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.04, rootMargin: '0px 0px 40px 0px' }
    );

    observer.observe(el);

    const handleScrollCheck = () => {
      if (revealedRef.current || !ref.current) return;
      if (ref.current.getBoundingClientRect().top <= window.innerHeight * 0.98) {
        revealNow();
        observer.disconnect();
      }
    };

    window.addEventListener('scroll', handleScrollCheck, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollCheck);
    };
  }, [delay, yOffset, duration, reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
