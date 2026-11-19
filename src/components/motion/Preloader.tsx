import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MOTION_DURATIONS, MOTION_EASINGS } from '../../lib/motionConfig';

interface PreloaderProps {
  reducedMotion: boolean;
  onComplete: () => void;
}

export function Preloader({ reducedMotion, onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' || reducedMotion) {
      return false;
    }
    return true;
  });
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) {
      onComplete();
      return;
    }

    let cancelled = false;
    const startTime = performance.now();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        nameRef.current,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: MOTION_DURATIONS.complex,
          ease: MOTION_EASINGS.expoOut,
        }
      );
      gsap.fromTo(
        roleRef.current,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION_DURATIONS.normal,
          delay: 0.14,
          ease: MOTION_EASINGS.power3Out,
        }
      );
    }, containerRef);

    // Measure real document & font readiness without artificial stalls
    const finishLoader = () => {
      if (cancelled) return;
      setProgress(100);
      const elapsed = performance.now() - startTime;
      const minRevealMs = Math.max(0, 620 - elapsed);

      window.setTimeout(() => {
        if (cancelled) return;
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.68,
            ease: MOTION_EASINGS.expoOut,
            onComplete: () => {
              if (!cancelled) {
                setVisible(false);
                onComplete();
              }
            },
          });
        } else {
          setVisible(false);
          onComplete();
        }
      }, minRevealMs);
    };

    setProgress(35);

    const fontPromise =
      document.fonts && document.fonts.ready
        ? document.fonts.ready.then(() => {
            if (!cancelled) setProgress((p) => Math.max(p, 75));
          })
        : Promise.resolve();

    const loadPromise =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener('load', () => resolve(), { once: true });
          });

    // Cap maximum wait so slow network fonts never block the user
    const timeoutGuard = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 950);
    });

    Promise.race([Promise.all([fontPromise, loadPromise]), timeoutGuard]).then(finishLoader);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [visible, onComplete]);

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#06070A] px-6"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="tracking-wider">PORTFOLIO</span>
          <span className="tabular-nums">{progress}%</span>
        </div>

        <div className="overflow-hidden">
          <div ref={nameRef} className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#F4F6F9]">
            Tha Darinhil
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div ref={roleRef} className="text-sm text-slate-400">
            Full-Stack Developer · Architecture &amp; Motion
          </div>
          <svg
            width="28"
            height="16"
            viewBox="0 0 28 16"
            fill="none"
            className="text-[#3B82F6] shrink-0"
          >
            <path d="M6 2L1.5 8L6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L26.5 8L22 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16.5 2L11.5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="h-[1px] w-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-[#3B82F6] transition-transform duration-300 ease-out origin-left"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>
    </div>
  );
}
