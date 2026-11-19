import { useEffect, useRef } from 'react';

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const updateProgress = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? Math.min(Math.max(window.scrollY / docHeight, 0), 1) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${ratio})`;
      }
      rafId = 0;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[70] h-[2px] bg-transparent pointer-events-none"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#93C5FD] will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
