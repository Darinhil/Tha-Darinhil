import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Eye, Layers, Play } from 'lucide-react';
import { PROFILE, PROJECTS } from '../../data/portfolioData';
import { type ResponsiveMotionProfile } from '../../lib/motionConfig';
import {
  filterProjectsByFocus,
  type ProjectFocusFilter,
  type ProjectItem,
} from '../../lib/portfolioUtils';
import { ImageReveal, Reveal, REVEAL_EASE, REVEAL_VIEWPORT } from '../motion/Reveal';
import { SectionHeader } from '../motion/SectionHeader';
import { TiltCard } from '../motion/TiltCard';
import { SectionBadge3D } from '../ui/SectionBadge3D';
import { TechChip } from '../ui/TechChip';

interface ProjectsSectionProps {
  motionProfile: ResponsiveMotionProfile;
  onSelectProject: (project: ProjectItem) => void;
}

const PROJECT_FILTERS: { id: ProjectFocusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'full-stack', label: 'Full-Stack' },
  { id: 'backend', label: 'Backend' },
  { id: 'frontend', label: 'Frontend' },
];

const PROJECT_ACCENTS: Record<
  ProjectItem['demoMode'],
  { hoverBorder: string; glow: string }
> = {
  event: {
    hoverBorder: 'hover:border-brand-500/45',
    glow: 'color-mix(in srgb, var(--color-brand-500) 35%, transparent)',
  },
  leave: {
    hoverBorder: 'hover:border-emerald-400/40',
    glow: 'rgba(52,211,153,0.28)',
  },
  ecommerce: {
    hoverBorder: 'hover:border-pink-400/40',
    glow: 'rgba(244,114,182,0.25)',
  },
  booking: {
    hoverBorder: 'hover:border-orange-400/40',
    glow: 'rgba(251,146,60,0.25)',
  },
  finance: {
    hoverBorder: 'hover:border-teal-300/40',
    glow: 'rgba(94,234,212,0.24)',
  },
};

const LIVE_BUTTON_CLASS =
  'inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-2 text-[13px] font-semibold text-slate-200 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

/**
 * Grid placement for card `i` of `n` on a 4-track (md) / 6-track (lg) grid where every card
 * spans 2 tracks, so a short last row sits centred instead of leaving a gap on the right.
 */
function centredPlacement(i: number, n: number): string {
  const cls = ['md:col-span-2'];
  if (n % 2 === 1 && i === n - 1) cls.push('md:col-start-2');
  if (n % 3 === 1 && i === n - 1) cls.push('lg:col-start-3');
  else if (n % 3 === 2 && i === n - 2) cls.push('lg:col-start-2');
  else cls.push('lg:col-start-auto');
  return cls.join(' ');
}

// Tech tags shown per card; the rest collapse into a "+N" tag (full list in the case study)
const MAX_CHIPS = 4;

interface ProjectShowcaseProps {
  project: ProjectItem;
  /** Position in the full project list (drives the 01/02/03 numbering) */
  number: number;
  imgBroken: boolean;
  tiltEnabled: boolean;
  onImageError: () => void;
  onOpen: () => void;
}

function ProjectShowcase({
  project,
  number,
  imgBroken,
  tiltEnabled,
  onImageError,
  onOpen,
}: ProjectShowcaseProps) {
  const accent = PROJECT_ACCENTS[project.demoMode];
  const label = String(number).padStart(2, '0');

  return (
    <TiltCard
      enabled={tiltEnabled}
      maxTiltDeg={2}
      cursorType="project"
      className={`surface group relative h-full overflow-hidden rounded-[22px] border border-white/[0.08] transition-[transform,border-color] duration-300 ${accent.hoverBorder}`}
    >
      {/* Accent glow along the top edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${accent.glow}, transparent)` }}
      />

      <div className="flex h-full flex-col">
        {/* ---------- Screenshot in a browser frame ---------- */}
        <div className="p-2 sm:p-2.5">
          <motion.div
            layoutId={`project-media-${project.id}`}
            transition={{ duration: 0.55, ease: REVEAL_EASE }}
            className="force-dark relative overflow-hidden rounded-[16px] bg-canvas ring-1 ring-white/[0.07]"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.03] px-3.5 py-2">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
              </div>
            </div>

            <div className="relative aspect-[16/9]">
              <ImageReveal className="absolute inset-0">
                {!imgBroken ? (
                  <img
                    src={project.imageUrl}
                    alt={project.imageAlt}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={onImageError}
                    className="h-full w-full object-cover transition-[scale,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] [translate:calc(var(--tilt-x,0)*-14px)_calc(var(--tilt-y,0)*-14px)]"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-surface-2 via-[#131A29] to-canvas p-8 text-center">
                    <Layers className="h-10 w-10 text-brand-500" aria-hidden="true" />
                    <span className="font-display text-lg font-semibold text-white">{project.title}</span>
                  </div>
                )}
              </ImageReveal>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-100"
              />

              {/* Whole screenshot opens the case study */}
              <button
                type="button"
                aria-label={`Open ${project.title} details`}
                onClick={() => onOpen()}
                data-cursor="project"
                className="absolute inset-0 z-[1] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand-500"
              />

              {/* Interactive preview actions, revealed on hover */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden translate-y-3 justify-center gap-2 p-4 opacity-0 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 md:flex">
                <button
                  type="button"
                  onClick={() => onOpen()}
                  tabIndex={-1}
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-transform duration-300 hover:scale-105"
                >
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  Details
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---------- Project info ---------- */}
        <div className="relative flex flex-1 flex-col p-5 sm:p-6">
          {/* Outlined index number */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-4 select-none font-display text-[2.5rem] font-bold leading-[0.85] tracking-[-0.06em] text-transparent transition-[-webkit-text-stroke-color] duration-500 [-webkit-text-stroke:1.5px_color-mix(in_srgb,var(--color-white)_16%,transparent)] group-hover:[-webkit-text-stroke-color:var(--color-brand-400)] sm:right-6 sm:top-5 sm:text-[2.75rem]"
          >
            {label}
          </span>

          <h3 className="pr-[4.75rem] font-display text-[1.3rem] font-semibold leading-[1.2] tracking-[-0.03em] text-white sm:text-[1.4rem]">
            <button
              type="button"
              onClick={() => onOpen()}
              className="text-left transition-colors hover:text-brand-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              {project.title}
            </button>
          </h3>

          <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{project.shortDescription}</p>

          <ul aria-label="Technology stack" className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, MAX_CHIPS).map((tech) => (
              <TechChip key={tech} label={tech} />
            ))}
            {project.stack.length > MAX_CHIPS && (
              <li
                title={project.stack.slice(MAX_CHIPS).join(', ')}
                className="inline-flex items-center rounded-full bg-white/[0.045] px-2.5 py-1 text-xs text-slate-400 ring-1 ring-inset ring-white/[0.06]"
              >
                +{project.stack.length - MAX_CHIPS}
              </li>
            )}
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
            <button
              type="button"
              onClick={onOpen}
              className="force-dark btn-sheen inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-accent px-4 py-2 text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-10px_color-mix(in_srgb,var(--color-brand-600)_70%,transparent)] transition-[filter] duration-300 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              View Details
            </button>

            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className={`group/live ${LIVE_BUTTON_CLASS} hover:border-white/25 hover:bg-white/[0.07]`}
              >
                <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                Live Demo
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-slate-500 transition-transform duration-300 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            ) : (
              // No deployment yet: same button, disabled, with a "Coming soon" tooltip
              <span className="group/live relative">
                <button
                  type="button"
                  aria-disabled="true"
                  aria-label="Live demo coming soon"
                  className={`${LIVE_BUTTON_CLASS} cursor-not-allowed opacity-60`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  Live Demo
                </button>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-surface-raised px-2.5 py-1 text-[11px] font-medium text-slate-200 opacity-0 shadow-lg ring-1 ring-white/10 transition-[opacity,translate] duration-200 group-hover/live:translate-y-0 group-hover/live:opacity-100 group-focus-within/live:translate-y-0 group-focus-within/live:opacity-100"
                >
                  Coming soon
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

export function ProjectsSection({ motionProfile, onSelectProject }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFocusFilter>('all');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const reduced = motionProfile.tier === 'reduced';

  const visibleProjects = useMemo(() => filterProjectsByFocus(PROJECTS, activeFilter), [activeFilter]);
  const counts = useMemo(
    () => Object.fromEntries(PROJECT_FILTERS.map((f) => [f.id, filterProjectsByFocus(PROJECTS, f.id).length])),
    []
  );

  return (
    <section id="projects" className="relative py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            kicker="01. Selected Work"
            badge={<SectionBadge3D src={PROFILE.workIllustration} width={640} height={531} reducedMotion={reduced} />}
            title="Full-stack apps, from schema to interface."
            accent="schema to interface."
            reducedMotion={reduced}
            titleClassName="max-w-3xl"
          />

          {/* Category filters */}
          <Reveal delay={0.25} distance={16} className="self-start lg:self-auto shrink-0">
            <div
              role="tablist"
              aria-label="Filter projects by category"
              className="flex items-center gap-0.5 rounded-full border border-white/[0.08] bg-white/[0.02] p-1 backdrop-blur-sm"
            >
              {PROJECT_FILTERS.map((filter) => {
                const active = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-brand-500 sm:px-4 ${
                      active ? 'text-canvas' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="project-filter-pill"
                        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 34 }}
                        className="absolute inset-0 rounded-full bg-white"
                      />
                    )}
                    <span className="relative">{filter.label}</span>
                    <span className={`relative text-[10px] tabular-nums ${active ? 'text-canvas/60' : 'text-slate-600'}`}>
                      {counts[filter.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Showcase grid (3 per row, short last row centred): cards fade out / reflow when the filter changes */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-4 lg:grid-cols-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleProjects.map((project, i) => (
              <motion.div
                key={project.id}
                className={`h-full ${centredPlacement(i, visibleProjects.length)}`}
                layout={!reduced}
                initial={{ opacity: 0, y: reduced ? 0 : 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ ...REVEAL_VIEWPORT, amount: 0.15 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.96, transition: { duration: 0.25 } }}
                transition={{ duration: reduced ? 0.3 : 0.9, ease: REVEAL_EASE }}
              >
                <ProjectShowcase
                  project={project}
                  number={PROJECTS.indexOf(project) + 1}
                  imgBroken={Boolean(failedImages[project.id])}
                  tiltEnabled={motionProfile.enable3DTilt}
                  onImageError={() => setFailedImages((prev) => ({ ...prev, [project.id]: true }))}
                  onOpen={() => onSelectProject(project)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
