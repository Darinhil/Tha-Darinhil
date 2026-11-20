/**
 * Colour themes offered by the navbar picker. Each id matches a
 * `:root[data-theme="…"]` palette override in index.css ("indigo" is the default
 * palette declared in @theme, so it has no override block). `color` is the
 * swatch shown in the picker.
 */
export const THEMES = [
  { id: 'indigo', label: 'Indigo', color: '#6366f1' },
  { id: 'rose', label: 'Rose', color: '#e11d48' },
  { id: 'amber', label: 'Sunset', color: '#ea580c' },
  { id: 'emerald', label: 'Emerald', color: '#059669' },
  { id: 'blue', label: 'Ocean Blue', color: '#2563eb' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

// Keep in sync with the inline boot script in index.html
export const THEME_STORAGE_KEY = 'td-theme';

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function readStoredTheme(): ThemeId {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeId(stored) ? stored : 'indigo';
  } catch {
    return 'indigo';
  }
}

function setThemeAttribute(id: ThemeId) {
  document.documentElement.dataset.theme = id;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // Storage blocked (private mode etc.) — theme still applies for this visit
  }
}

/**
 * Runs a DOM update so the new look is revealed as a circle growing from
 * `origin` (View Transitions API); falls back to an instant swap.
 */
function revealFrom(update: () => void, origin?: { x: number; y: number }, reducedMotion = false) {
  const doc = document as Document & {
    startViewTransition?: (update: () => void) => { ready: Promise<void> };
  };

  if (!doc.startViewTransition || reducedMotion || !origin) {
    update();
    return;
  }

  const transition = doc.startViewTransition(update);
  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 750,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    })
    .catch(() => {
      // Transition skipped (e.g. tab hidden) — the update has already run
    });
}

/** Switches the colour theme, revealed from the clicked swatch. */
export function applyTheme(id: ThemeId, origin?: { x: number; y: number }, reducedMotion = false) {
  revealFrom(() => setThemeAttribute(id), origin, reducedMotion);
}

/* ---------- Light / dark mode ---------- */

export type ColorMode = 'dark' | 'light';

// Keep in sync with the inline boot script in index.html
export const MODE_STORAGE_KEY = 'td-mode';

const MODE_META_COLOR: Record<ColorMode, string> = { dark: '#06070A', light: '#F5F6F8' };

export function readStoredMode(): ColorMode {
  try {
    return window.localStorage.getItem(MODE_STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function setModeAttribute(mode: ColorMode) {
  document.documentElement.dataset.mode = mode;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', MODE_META_COLOR[mode]);
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // Storage blocked — mode still applies for this visit
  }
}

/** Switches light/dark mode, revealed from the toggle button. */
export function applyMode(mode: ColorMode, origin?: { x: number; y: number }, reducedMotion = false) {
  revealFrom(() => setModeAttribute(mode), origin, reducedMotion);
}
