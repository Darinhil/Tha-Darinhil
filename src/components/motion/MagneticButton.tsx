import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { MOTION_EASINGS } from '../../lib/motionConfig';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
  strength?: number;
  cursorType?: 'button' | 'link' | 'project';
  cursorLabel?: string;
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  target,
  rel,
  type = 'button',
  disabled = false,
  ariaLabel,
  strength = 0.24,
  cursorType = 'button',
  cursorLabel,
}: MagneticButtonProps) {
  const elRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 1024) return;

    const node = elRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;

    gsap.to(node, {
      x: dx,
      y: dy,
      duration: 0.3,
      ease: MOTION_EASINGS.power2Out,
    });
  };

  const handleMouseLeave = () => {
    const node = elRef.current;
    if (!node) return;
    gsap.to(node, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: MOTION_EASINGS.expoOut,
    });
  };

  const sharedProps = {
    ref: elRef as never,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    'aria-label': ariaLabel,
    'data-cursor': cursorType,
    'data-cursor-label': cursorLabel,
    className: `inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${className}`,
  };

  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} {...sharedProps}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} {...sharedProps}>
      {children}
    </button>
  );
}
