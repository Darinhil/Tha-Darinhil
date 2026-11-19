export const MOTION_DURATIONS = {
  fast: 0.18,
  normal: 0.45,
  complex: 0.85,
  cinematic: 1.25,
} as const;

export const MOTION_EASINGS = {
  // GSAP easing identifiers
  power2Out: 'power2.out',
  power3Out: 'power3.out',
  expoOut: 'expo.out',
  backSubtle: 'back.out(1.2)',
  // Motion / CSS cubic-bezier tuples
  appleEase: [0.16, 1, 0.3, 1] as const,
  smoothOut: [0.22, 1, 0.36, 1] as const,
  snappyOut: [0.2, 0.9, 0.3, 1] as const,
} as const;

export interface ResponsiveMotionProfile {
  tier: 'desktop' | 'tablet' | 'mobile' | 'reduced';
  enableCustomCursor: boolean;
  enableParallax: boolean;
  enable3DTilt: boolean;
  enableParticles: boolean;
  durationScale: number;
  staggerScale: number;
}

export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, factor: number): number {
  const t = clamp(factor, 0, 1);
  return start + (end - start) * t;
}

export function calculateTiltTransform(
  normalizedX: number,
  normalizedY: number,
  maxTiltDeg = 8
): { rotateX: number; rotateY: number; glareX: number; glareY: number } {
  const x = clamp(normalizedX, -1, 1);
  const y = clamp(normalizedY, -1, 1);
  return {
    rotateX: Number((-y * maxTiltDeg).toFixed(2)),
    rotateY: Number((x * maxTiltDeg).toFixed(2)),
    glareX: Number((((x + 1) / 2) * 100).toFixed(1)),
    glareY: Number((((y + 1) / 2) * 100).toFixed(1)),
  };
}

export function splitTextChars(text: string): string[] {
  return Array.from(text);
}

export function splitTextWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

export function getResponsiveMotionProfile(
  viewportWidth: number,
  prefersReducedMotion: boolean,
  hasFinePointer = true
): ResponsiveMotionProfile {
  if (prefersReducedMotion) {
    return {
      tier: 'reduced',
      enableCustomCursor: false,
      enableParallax: false,
      enable3DTilt: false,
      enableParticles: false,
      durationScale: 0,
      staggerScale: 0,
    };
  }

  if (viewportWidth < 768) {
    return {
      tier: 'mobile',
      enableCustomCursor: false,
      enableParallax: false,
      enable3DTilt: false,
      enableParticles: false,
      durationScale: 0.75,
      staggerScale: 0.65,
    };
  }

  if (viewportWidth < 1024) {
    return {
      tier: 'tablet',
      enableCustomCursor: false,
      enableParallax: true,
      enable3DTilt: false,
      enableParticles: true,
      durationScale: 0.85,
      staggerScale: 0.8,
    };
  }

  return {
    tier: 'desktop',
    enableCustomCursor: hasFinePointer,
    enableParallax: true,
    enable3DTilt: true,
    enableParticles: true,
    durationScale: 1,
    staggerScale: 1,
  };
}
