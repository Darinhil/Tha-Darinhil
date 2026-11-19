import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { PROFILE } from '../../data/portfolioData';
import { MagneticButton } from '../motion/MagneticButton';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-white/[0.08] bg-[#06070A] py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-sm font-semibold text-white">
              {PROFILE.name}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-xs font-mono text-[#60A5FA]">
              {PROFILE.role}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {PROFILE.name}. {PROFILE.education}.
          </p>
        </div>

        <nav aria-label="Footer social links" className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <a
            href={PROFILE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="inline-flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap"
          >
            <span>GitHub</span>
            <ArrowUpRight className="h-3 w-3 text-slate-500" aria-hidden="true" />
          </a>
          <a
            href={PROFILE.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="inline-flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="h-3 w-3 text-slate-500" aria-hidden="true" />
          </a>
          <a
            href={`mailto:${PROFILE.email}`}
            data-cursor="link"
            className="inline-flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap"
          >
            <span>Email</span>
            <ArrowUpRight className="h-3 w-3 text-slate-500" aria-hidden="true" />
          </a>
        </nav>

        <MagneticButton
          onClick={() => onNavigate('hero')}
          ariaLabel="Back to top"
          cursorType="button"
          className="self-start md:self-auto rounded-lg border border-white/15 bg-[#0D1017] hover:border-white/30 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white"
        >
          <span>Back to top</span>
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        </MagneticButton>
      </div>
    </footer>
  );
}
