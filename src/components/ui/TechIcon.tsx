import { Network, SquareCode } from 'lucide-react';
import { brandColorForMode, getBrandIcon, normalizeTechName } from '../../lib/techIcons';

interface TechIconProps {
  name: string;
  className?: string;
  /** Use the brand colour; otherwise inherits `currentColor` */
  colored?: boolean;
}

// Technologies without an official mark get a matching outline glyph
const FALLBACK_ICONS: Record<string, typeof Network> = {
  restapis: Network,
  rest: Network,
  vscode: SquareCode,
};

export function hasTechIcon(name: string): boolean {
  const key = normalizeTechName(name);
  return getBrandIcon(name) !== null || key in FALLBACK_ICONS;
}

export function TechIcon({ name, className = 'h-4 w-4', colored = false }: TechIconProps) {
  const brand = getBrandIcon(name);

  if (brand) {
    return (
      <svg
        viewBox="0 0 24 24"
        role="img"
        aria-hidden="true"
        className={className}
        fill="currentColor"
        style={colored ? { fill: brandColorForMode(brand.hex) } : undefined}
      >
        <path d={brand.path} />
      </svg>
    );
  }

  const Fallback = FALLBACK_ICONS[normalizeTechName(name)];
  if (!Fallback) return null;
  return (
    <Fallback
      aria-hidden="true"
      strokeWidth={1.75}
      className={`${className} ${colored ? 'text-brand-300' : ''}`}
    />
  );
}
