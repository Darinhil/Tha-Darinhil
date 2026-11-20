import type { ReactNode } from 'react';

interface IconTileProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'neutral' | 'accent';
  shape?: 'square' | 'circle';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<IconTileProps['size']>, string> = {
  sm: 'h-8 w-8 rounded-[9px] [&_svg]:h-4 [&_svg]:w-4',
  md: 'h-10 w-10 rounded-[11px] [&_svg]:h-[18px] [&_svg]:w-[18px]',
  lg: 'h-12 w-12 rounded-[14px] [&_svg]:h-5 [&_svg]:w-5',
};

const TONE_CLASSES: Record<NonNullable<IconTileProps['tone']>, string> = {
  neutral:
    'bg-gradient-to-b from-white/[0.09] to-white/[0.02] text-slate-200 ring-white/[0.09]',
  accent:
    'bg-gradient-to-b from-brand-500/30 to-brand-700/10 text-brand-200 ring-brand-400/30',
};

/** Consistent raised tile behind every UI icon: soft gradient, hairline ring, top highlight. */
export function IconTile({
  children,
  size = 'md',
  tone = 'neutral',
  shape = 'square',
  className = '',
}: IconTileProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center ring-1 ring-inset shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_20px_-10px_rgba(0,0,0,0.8)] transition-[color,background-color,box-shadow] duration-300 ${
        SIZE_CLASSES[size]
      } ${TONE_CLASSES[tone]} ${shape === 'circle' ? 'rounded-full!' : ''} ${className}`}
    >
      {children}
    </span>
  );
}
