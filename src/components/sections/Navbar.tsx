import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { NAV_LINKS, PROFILE } from '../../data/portfolioData';
import { MOTION_EASINGS } from '../../lib/motionConfig';
import { resolveActiveSection } from '../../lib/portfolioUtils';
import { MagneticButton } from '../motion/MagneticButton';

interface NavbarProps {
  reducedMotion: boolean;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({ reducedMotion, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('hero');
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,padding,box-shadow] duration-300 ${
        scrolled
          ? 'bg-[#06070A]/85 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.45)]'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('hero');
          }}
          data-cursor="link"
          className="justify-self-start font-display text-lg font-semibold tracking-tight text-[#F4F6F9] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B82F6]"
        >
          {PROFILE.name}
        </a>

        {/* Zone 2: 5 centered single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center justify-center gap-7"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                data-cursor="link"
                className={`group relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B82F6] ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] origin-left bg-[#3B82F6] transition-transform duration-300 ease-out ${
                    isActive
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (plus mobile menu button on small screens) */}
        <div className="justify-self-end flex items-center gap-3 shrink-0">
          <div className="hidden md:block">
            <MagneticButton
              href="#contact"
              onClick={() => handleLinkClick('contact')}
              cursorType="button"
              className="rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-sm"
            >
              <span>Contact</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </MagneticButton>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-[#0D1017] text-slate-200 hover:border-white/25 transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d={mobileOpen ? 'M4 4L16 16' : 'M3 6H17'}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                className="transition-all duration-200"
              />
              <path
                d="M3 10H17"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                className={`transition-opacity duration-150 ${mobileOpen ? 'opacity-0' : 'opacity-100'}`}
              />
              <path
                d={mobileOpen ? 'M16 4L4 16' : 'M3 14H17'}
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
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: reducedMotion ? 0 : 0.28, ease: MOTION_EASINGS.appleEase }}
            className="md:hidden fixed inset-x-0 top-[68px] bottom-0 z-40 bg-[#06070A]/98 backdrop-blur-xl border-t border-white/10 px-6 py-8 flex flex-col justify-between"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
              {NAV_LINKS.map((item, idx) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  initial={reducedMotion ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.32,
                    delay: reducedMotion ? 0 : 0.04 * idx,
                    ease: MOTION_EASINGS.appleEase,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.id);
                  }}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-display font-medium transition-colors ${
                    activeId === item.id
                      ? 'bg-[#0E131D] text-white border border-white/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
                </motion.a>
              ))}
            </nav>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <button
                type="button"
                onClick={() => handleLinkClick('contact')}
                className="w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-5 py-3.5 text-sm font-semibold text-white transition-colors"
              >
                Contact Me
              </button>
              <p className="text-xs text-slate-500 text-center">
                {PROFILE.email}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
