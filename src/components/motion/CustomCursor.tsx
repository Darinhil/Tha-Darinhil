import { useEffect, useRef, useState } from 'react';

interface CustomCursorProps {
  enabled: boolean;
}

// Project cards use the normal button ring (no large labelled bubble)
type CursorVariant = 'default' | 'link' | 'button';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

// How far (px) the trailing ring may fall behind the dot before it is pulled along
const MAX_RING_LAG = 28;
// Share of the remaining distance the ring closes per 60fps frame
const RING_FOLLOW = 0.3;
const RIPPLE_MS = 550;

export function CustomCursor({ enabled }: CustomCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('has-custom-cursor');
      return;
    }

    document.body.classList.add('has-custom-cursor');

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pointer.x, y: pointer.y };
    let rafId = 0;
    let lastTime = performance.now();
    let snapNext = true;
    let rippleId = 0;
    // Press "pinch" is animated inside the transform so it scales around the ring's centre
    // (a separate CSS `scale` would scale the translated position and fling the ring away)
    let pressed = false;
    let ringScale = 1;

    const snapRing = () => {
      ring.x = pointer.x;
      ring.y = pointer.y;
    };

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      // First move after (re)entering: start the ring on the pointer instead of flying in
      if (snapNext) {
        snapRing();
        snapNext = false;
      }
      setVisible(true);
    };

    const handleLeave = () => {
      setVisible(false);
      snapNext = true;
    };

    const handleDown = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      snapRing(); // never show the ring detached at the moment of a click
      pressed = true;
      setIsPressed(true);
      const id = ++rippleId;
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), RIPPLE_MS);
    };
    const handleUp = () => {
      pressed = false;
      setIsPressed(false);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest<HTMLElement>(
        '[data-cursor], a, button, [role="button"], input, textarea, select'
      );

      if (!interactive) {
        setVariant('default');
        return;
      }

      const customType = interactive.dataset.cursor;

      if (interactive.tagName === 'BUTTON' || customType === 'button' || customType === 'project') {
        setVariant('button');
      } else if (interactive.tagName === 'A' || customType === 'link') {
        setVariant('link');
      } else {
        setVariant('default');
      }
    };

    const render = (now: number) => {
      // Frame-rate independent easing so the trail feels the same at 60Hz and 144Hz
      const dt = Math.min(64, now - lastTime);
      lastTime = now;
      const follow = 1 - Math.pow(1 - RING_FOLLOW, dt / 16.67);
      ring.x += (pointer.x - ring.x) * follow;
      ring.y += (pointer.y - ring.y) * follow;

      // Keep the ring tethered: it can trail, but never drift far from the dot
      const dx = ring.x - pointer.x;
      const dy = ring.y - pointer.y;
      const dist = Math.hypot(dx, dy);
      if (dist > MAX_RING_LAG) {
        ring.x = pointer.x + (dx / dist) * MAX_RING_LAG;
        ring.y = pointer.y + (dy / dist) * MAX_RING_LAG;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      }
      ringScale += ((pressed ? 0.75 : 1) - ringScale) * follow;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${ringScale.toFixed(3)})`;
      }

      rafId = window.requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    window.addEventListener('blur', handleLeave);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    document.addEventListener('mouseover', handleOver, { passive: true });
    rafId = window.requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('blur', handleLeave);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseover', handleOver);
      window.cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled || !visible) {
    return null;
  }

  const ringSizeClass =
    variant === 'button'
      ? 'w-12 h-12 bg-white/10 border-white/50'
      : variant === 'link'
        ? 'w-11 h-11 bg-brand-600/15 border-brand-500/60'
        : 'w-9 h-9 bg-transparent border-white/30';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      {/* Click ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="cursor-ripple fixed top-0 left-0 h-10 w-10 rounded-full border border-brand-400/70"
          style={{ transform: `translate3d(${r.x}px, ${r.y}px, 0) translate(-50%, -50%)` }}
        />
      ))}

      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border backdrop-blur-[2px] transition-[width,height,background-color,border-color,opacity] duration-200 ease-out will-change-transform ${ringSizeClass}`}
      />

      <div
        ref={dotRef}
        className={`fixed top-0 left-0 rounded-full bg-white transition-[width,height,opacity] duration-150 will-change-transform ${
          isPressed ? 'w-2.5 h-2.5 opacity-100' : 'w-1.5 h-1.5 opacity-95'
        }`}
      />
    </div>
  );
}
