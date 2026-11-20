import { useEffect, useRef } from 'react';

interface ParticleFieldProps {
  animate: boolean;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
}

/** Brand-coloured motes drifting upward. Density scales with the viewport; pauses while the tab is hidden. */
export function ParticleField({ animate }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Follow the active colour theme / light-dark mode
    const color =
      getComputedStyle(document.documentElement).getPropertyValue('--color-brand-400').trim() || '#818cf8';
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let rafId = 0;

    const spawn = (anywhere: boolean): Particle => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 10,
      r: Math.random() * 1.4 + 0.4,
      vy: Math.random() * 0.35 + 0.12,
      sway: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.55 + 0.15,
    });

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, Math.max(22, width / 24)));
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const draw = (time: number) => {
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (animate) {
          p.y -= p.vy;
          p.x += Math.sin(time / 1400 + p.phase) * p.sway * 0.25;
          if (p.y < -10) Object.assign(p, spawn(false));
        }
        const flicker = animate ? 0.75 + Math.sin(time / 600 + p.phase) * 0.25 : 1;
        // Soft halo + bright core reads as a glow without costly shadowBlur
        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha * 0.12 * flicker;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = p.alpha * flicker;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (animate) rafId = window.requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      window.cancelAnimationFrame(rafId);
      if (!document.hidden && animate) rafId = window.requestAnimationFrame(draw);
    };

    resize();
    rafId = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [animate]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
