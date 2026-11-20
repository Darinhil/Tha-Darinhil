import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { NAV_LINKS, PROFILE } from '../../data/portfolioData';
import { MOTION_EASINGS } from '../../lib/motionConfig';
import { resolveActiveSection } from '../../lib/portfolioUtils';
import { MagneticButton } from '../motion/MagneticButton';
import { ModeToggle } from '../ui/ModeToggle';
import { ThemePicker } from '../ui/ThemePicker';

interface NavbarProps {
  reducedMotion: boolean;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({ reducedMotion, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('hero');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);

      const sectionIds = ['hero', 'projects', 'about', 'skills', 'experience', 'services', 'contact'];
      const bounds = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          return {
            id,
            top: el.offsetTop,
            height: el.offsetHeight,
          };
        })
        .filter((item): item is { id: string; top: number; height: number } => item !== null);

      const current = resolveActiveSection(window.scrollY, bounds, 160);
      if (current) {
        setActiveId(current);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLinkClick = (sectionId: string) => {
    setMobileOpen(false);
    onNavigate(sectionId);
  };

  // The pill follows the hovered link, falling back to the active section
  const pillId = hoveredId ?? activeId;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 border-b border-white/[0.06] bg-canvas/70 backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-500 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`relative mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 sm:px-6 lg:px-8 transition-[padding] duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        {/* Colour theme picker, light/dark toggle, name (links home) */}
        <div className="justify-self-start flex items-center gap-2.5 shrink-0">
          <ThemePicker reducedMotion={reducedMotion} />
          <ModeToggle reducedMotion={reducedMotion} />

          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('hero');
            }}
            data-cursor="link"
            className="rounded-md font-display text-[15px] font-semibold tracking-tight text-ink whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
          >
            {PROFILE.name}
          </a>
        </div>

        {/* Floating glass navigation pill */}
        <nav
          aria-label="Primary navigation"
          onMouseLeave={() => setHoveredId(null)}
          className={`hidden md:flex items-center gap-0.5 rounded-full border p-1 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ${
            scrolled
              ? 'border-white/[0.1] bg-surface-raised/80 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]'
              : 'border-white/[0.07] bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
          }`}
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onMouseEnter={() => setHoveredId(item.id)}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                data-cursor="link"
                aria-current={isActive ? 'location' : undefined}
                className={`relative rounded-full px-4 py-1.5 text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
                  isActive || hoveredId === item.id ? 'text-white' : 'text-slate-400'
                }`}
              >
                {pillId === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 380, damping: 32 }
                    }
                    className={`absolute inset-0 rounded-full ${
                      isActive
                        ? 'bg-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                        : 'bg-white/[0.05]'
                    }`}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 -bottom-[3px] h-[2px] w-4 -translate-x-1/2 rounded-full bg-brand-400 shadow-[0_0_8px_color-mix(in_srgb,var(--color-brand-400)_90%,transparent)]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="justify-self-end flex items-center gap-3 shrink-0">
          <div className="hidden md:block">
            <MagneticButton
              href="#contact"
              onClick={() => handleLinkClick('contact')}
              cursorType="button"
              className={`btn-sheen group rounded-full px-4 py-2 text-[13px] font-semibold ${
                activeId === 'contact'
                  ? 'force-dark bg-brand-600 text-white'
                  : 'bg-white text-canvas hover:bg-slate-100'
              } shadow-[0_8px_24px_-10px_rgba(255,255,255,0.35)]`}
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </MagneticButton>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-surface-raised/80 backdrop-blur-xl text-slate-200 hover:border-white/25 transition-colors focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d={mobileOpen ? 'M5 5L15 15' : 'M4 7H16'}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                className="transition-all duration-200"
              />
              <path
                d={mobileOpen ? 'M15 5L5 15' : 'M4 13H16'}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                className="transition-all duration-200"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: reducedMotion ? 0 : 0.45, ease: MOTION_EASINGS.appleEase }}
            className="md:hidden fixed inset-0 -z-10 bg-canvas/97 backdrop-blur-2xl px-6 pt-24 pb-8 flex flex-col justify-between"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col">
              {[{ id: 'hero', label: 'Home' }, ...NAV_LINKS, { id: 'contact', label: 'Contact' }].map(
                (item, idx) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.45,
                      delay: reducedMotion ? 0 : 0.08 + 0.045 * idx,
                      ease: MOTION_EASINGS.appleEase,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.id);
                    }}
                    className="group flex items-center justify-between border-b border-white/[0.07] py-4"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="text-xs text-slate-500 tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`font-display text-[1.9rem] font-semibold tracking-[-0.035em] transition-colors ${
                          activeId === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'
                        }`}
                      >
                        {item.label}
                      </span>
                    </span>
                    <ArrowUpRight
                      className={`h-5 w-5 transition-colors ${
                        activeId === item.id ? 'text-brand-400' : 'text-slate-600'
                      }`}
                      aria-hidden="true"
                    />
                  </motion.a>
                )
              )}
            </nav>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleLinkClick('contact')}
                className="w-full rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-canvas transition-colors hover:bg-slate-100"
              >
                Start a Conversation
              </button>
              <p className="text-xs text-slate-500 text-center break-all">{PROFILE.email}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
