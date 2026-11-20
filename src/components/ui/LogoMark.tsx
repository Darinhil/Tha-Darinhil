import { useId } from 'react';

interface LogoMarkProps {
  className?: string;
}

/** Brand mark: a glossy orb filled with the active theme's gradient. */
export function LogoMark({ className = 'h-8 w-8' }: LogoMarkProps) {
  // Unique gradient ids so several marks on one page don't collide
  const uid = useId().replace(/:/g, '');
  const fillId = `logo-fill-${uid}`;
  const glossId = `logo-gloss-${uid}`;

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id={fillId} cx="0.32" cy="0.28" r="0.85">
          <stop offset="0" style={{ stopColor: 'var(--color-brand-200)' }} />
          <stop offset="0.35" style={{ stopColor: 'var(--color-brand-400)' }} />
          <stop offset="0.75" style={{ stopColor: 'var(--color-brand-600)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-brand-accent)' }} />
        </radialGradient>
        <linearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill={`url(#${fillId})`} />
      {/* Specular highlight */}
      <ellipse cx="13" cy="9.5" rx="8" ry="5" fill={`url(#${glossId})`} />
      <circle cx="16" cy="16" r="15.5" fill="none" stroke="#FFFFFF" strokeOpacity="0.25" />
    </svg>
  );
}
