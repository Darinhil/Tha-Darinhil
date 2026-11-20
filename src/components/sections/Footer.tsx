import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { NAV_LINKS, PROFILE } from '../../data/portfolioData';
import { MagneticButton } from '../motion/MagneticButton';
import { Stagger, StaggerItem } from '../motion/Reveal';
import { FloatingCube } from '../ui/FloatingCube';
import { LogoMark } from '../ui/LogoMark';
import { SocialIcon } from '../ui/SocialIcon';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

const SOCIAL_LINKS = [
  { label: 'GitHub', href: PROFILE.githubUrl, external: true },
  { label: 'LinkedIn', href: PROFILE.linkedinUrl, external: true },
  { label: 'Email', href: `mailto:${PROFILE.email}`, external: false },
] as const;

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative overflow-hidden bg-canvas">
      <div aria-hidden="true" className="section-rule" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 pt-16 sm:px-6 lg:px-8">
        <Stagger stagger={0.1} className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <StaggerItem className="relative lg:col-span-6 space-y-4">
            {/* Looping dev box in the open space beside the name */}
            <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 sm:right-[4%] lg:right-[14%]">
              <FloatingCube />
            </div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-8 w-8" />
              <span className="font-display text-[15px] font-semibold tracking-tight text-white">
                {PROFILE.name}
              </span>
            </div>
          </StaggerItem>

          <StaggerItem className="lg:col-span-3">
          <nav aria-label="Footer navigation">
            <p className="text-[13px] text-slate-600">Sitemap</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {NAV_LINKS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.id);
                    }}
                    data-cursor="link"
                    className="relative text-slate-400 transition-colors hover:text-white after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          </StaggerItem>

          <StaggerItem className="lg:col-span-3">
          <nav aria-label="Footer social links">
            <p className="text-[13px] text-slate-600">Connect</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    data-cursor="link"
                    className="group inline-flex items-center gap-2.5 text-slate-400 transition-colors hover:text-white whitespace-nowrap"
                  >
                    <SocialIcon
                      network={link.label}
                      className="h-4 w-4 text-slate-500 transition-colors duration-300 group-hover:text-white"
                    />
                    <span>{link.label}</span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-slate-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          </StaggerItem>
        </Stagger>

        <div className="mt-14 flex flex-col-reverse gap-5 border-t border-white/[0.06] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} {PROFILE.name}. {PROFILE.education}.
          </p>
          <MagneticButton
            onClick={() => onNavigate('hero')}
            ariaLabel="Back to top"
            cursorType="button"
            className="group self-start sm:self-auto rounded-full border border-white/10 bg-white/[0.02] hover:border-white/25 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
          </MagneticButton>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the page edge */}
      <div aria-hidden="true" className="pointer-events-none relative -mb-[3.5vw] select-none overflow-hidden">
        <p className="text-center font-display text-[17.5vw] font-semibold leading-[0.8] tracking-[-0.06em] whitespace-nowrap bg-gradient-to-b from-white/[0.09] to-white/0 bg-clip-text text-transparent">
          {PROFILE.name}
        </p>
      </div>
    </footer>
  );
}
