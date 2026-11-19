import { useEffect, useState } from 'react';
import {
  getResponsiveMotionProfile,
  type ResponsiveMotionProfile,
} from '../lib/motionConfig';

export function useMotionProfile(): ResponsiveMotionProfile {
  const [profile, setProfile] = useState<ResponsiveMotionProfile>(() => {
    if (typeof window === 'undefined') {
      return getResponsiveMotionProfile(1440, false, true);
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    return getResponsiveMotionProfile(window.innerWidth, reduced, finePointer);
  });

  useEffect(() => {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerMedia = window.matchMedia('(hover: hover) and (pointer: fine)');

    const update = () => {
      setProfile(
        getResponsiveMotionProfile(
          window.innerWidth,
          motionMedia.matches,
          pointerMedia.matches
        )
      );
    };

    update();
    window.addEventListener('resize', update, { passive: true });
    motionMedia.addEventListener('change', update);
    pointerMedia.addEventListener('change', update);

    return () => {
      window.removeEventListener('resize', update);
      motionMedia.removeEventListener('change', update);
      pointerMedia.removeEventListener('change', update);
    };
  }, []);

  return profile;
}
