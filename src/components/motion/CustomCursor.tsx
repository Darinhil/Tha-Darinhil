import { useEffect, useRef, useState } from 'react';
import { lerp } from '../../lib/motionConfig';

interface CustomCursorProps {
  enabled: boolean;
}

type CursorVariant = 'default' | 'link' | 'button' | 'project';

export function CustomCursor({ enabled }: CustomCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [label, setLabel] = useState<string>('');
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('has-custom-cursor');
      return;
    }

    document.body.classList.add('has-custom-cursor');

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pointer.x, y: pointer.y };
    let rafId = 0;

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      setVisible(true);
    };

    const handleLeave = () => {
      setVisible(false);
    };

    const handleDown = () => setIsPressed(true);
    const handleUp = () => setIsPressed(false);

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest<HTMLElement>(
        '[data-cursor], a, button, [role="button"], input, textarea, select'
      );

      if (!interactive) {
        setVariant('default');
        setLabel('');
        return;
      }

      const customType = interactive.dataset.cursor as CursorVariant | undefined;
      const customLabel = interactive.dataset.cursorLabel || '';

      if (customType === 'project') {
        setVariant('project');
        setLabel(customLabel || 'View Project');
      } else if (interactive.tagName === 'BUTTON' || customType === 'button') {
        setVariant('button');
        setLabel(customLabel);
      } else if (interactive.tagName === 'A' || customType === 'link') {
        setVariant('link');
        setLabel(customLabel);
      } else {
        setVariant('default');
        setLabel('');
      }
    };

    const render = () => {
      ring.x = lerp(ring.x, pointer.x, 0.16);
      ring.y = lerp(ring.y, pointer.y, 0.16);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = window.requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    document.addEventListener('mouseover', handleOver, { passive: true });
    rafId = window.requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseover', handleOver);
      window.cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled || !visible) {
    return null;
  }

  const isProject = variant === 'project';
  const isButton = variant === 'button';
  const isLink = variant === 'link';

  const ringSizeClass = isProject
    ? 'w-24 h-24 bg-[#2563EB]/90 border-[#60A5FA]/60 text-white'
    : isButton
      ? 'w-12 h-12 bg-white/10 border-white/50'
      : isLink
        ? 'w-11 h-11 bg-[#2563EB]/15 border-[#3B82F6]/60'
        : 'w-9 h-9 bg-transparent border-white/30';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border backdrop-blur-[2px] flex items-center justify-center transition-[width,height,background-color,border-color,opacity] duration-200 ease-out will-change-transform ${ringSizeClass} ${
          isPressed ? 'scale-90' : 'scale-100'
        }`}
      >
        {isProject && label && (
          <span className="text-[11px] font-medium tracking-tight text-white whitespace-nowrap px-2">
            {label}
          </span>
        )}
      </div>

      <div
        ref={dotRef}
        className={`fixed top-0 left-0 rounded-full bg-white transition-[width,height,opacity] duration-150 will-change-transform ${
          isProject ? 'w-0 h-0 opacity-0' : isPressed ? 'w-2 h-2 opacity-100' : 'w-1.5 h-1.5 opacity-95'
        }`}
      />
    </div>
  );
}
