import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MOTION_EASINGS } from '../../lib/motionConfig';
import { applyTheme, readStoredTheme, THEMES, type ThemeId } from '../../lib/themes';

interface ThemePickerProps {
  reducedMotion: boolean;
}

/** Square trigger showing the current colour; opens a column of swatches to pick from. */
export function ThemePicker({ reducedMotion }: ThemePickerProps) {
  const [themeId, setThemeId] = useState<ThemeId>(() => readStoredTheme());
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentTheme = THEMES.find((theme) => theme.id === themeId) ?? THEMES[0];

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const handlePointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleSelect = (id: ThemeId, e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(false);
    if (id === themeId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    applyTheme(id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, reducedMotion);
    setThemeId(id);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Choose colour theme (current: ${currentTheme.label})`}
        data-cursor="button"
        className={`group flex h-10 w-10 items-center justify-center rounded-xl border-2 bg-white/[0.04] backdrop-blur-xl transition-[border-color,background-color,transform] duration-300 hover:bg-white/[0.08] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
          open ? 'border-brand-400' : 'border-brand-500/60 hover:border-brand-400'
        }`}
      >
        <span
          aria-hidden="true"
          className="h-4 w-4 rounded-full bg-brand-500 shadow-[0_0_12px_color-mix(in_srgb,var(--color-brand-500)_70%,transparent)] transition-transform duration-300 group-hover:scale-110"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="group"
            aria-label="Colour themes"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: reducedMotion ? 0 : 0.22, ease: MOTION_EASINGS.appleEase }}
            className="absolute left-0 top-full z-50 mt-2 flex origin-top flex-col gap-1 rounded-2xl border border-white/10 bg-surface-raised/95 p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            {THEMES.map((theme) => {
              const selected = theme.id === themeId;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={(e) => handleSelect(theme.id, e)}
                  aria-label={theme.label}
                  aria-pressed={selected}
                  title={theme.label}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200 hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white/40 ${
                    selected ? 'bg-white/[0.08] ring-1 ring-inset ring-white/15' : ''
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 rounded-full transition-transform duration-200 hover:scale-125"
                    style={{ backgroundColor: theme.color, boxShadow: selected ? `0 0 10px ${theme.color}` : undefined }}
                  />
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
