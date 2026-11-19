import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Code2, Layers, Play } from 'lucide-react';
import { PROJECTS } from '../../data/portfolioData';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  type ResponsiveMotionProfile,
} from '../../lib/motionConfig';
import {
  filterProjectsByFocus,
  type ProjectFocusFilter,
  type ProjectItem,
} from '../../lib/portfolioUtils';
import { SectionHeader } from '../motion/SectionHeader';
import { TiltCard } from '../motion/TiltCard';

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
  { labelClass: string; hoverBorder: string; topBar: string; indexLabel: string }
> = {
  event: {
    labelClass: 'text-[#60A5FA]',
    hoverBorder: 'hover:border-[#3B82F6]/50',
    topBar: 'from-[#3B82F6]/55 via-[#60A5FA]/20 to-transparent',
    indexLabel: '01',
  },
  leave: {
    labelClass: 'text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/45',
    topBar: 'from-emerald-400/55 via-emerald-500/20 to-transparent',
    indexLabel: '02',
  },
  ecommerce: {
    labelClass: 'text-amber-300',
    hoverBorder: 'hover:border-amber-400/45',
    topBar: 'from-amber-400/55 via-amber-500/20 to-transparent',
    indexLabel: '03',
  },
};

export function ProjectsSection({
  motionProfile,
  onSelectProject,
}: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFocusFilter>('all');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = motionProfile.tier === 'reduced';

  const visibleProjects = useMemo(
    () => filterProjectsByFocus(PROJECTS, activeFilter),
    [activeFilter]
  );

  useEffect(() => {
    if (reduced || !listRef.current) return;

    const ctx = gsap.context(() => {
      const revealCards = () => {
        gsap.fromTo(
          '.project-card-item',
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: MOTION_DURATIONS.complex,
            stagger: 0.1 * motionProfile.staggerScale,
            ease: MOTION_EASINGS.power3Out,
            clearProps: 'transform,opacity',
          }
        );

        gsap.fromTo(
          '.project-image-frame',
          { clipPath: 'inset(6% 0% 6% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: MOTION_DURATIONS.cinematic,
            stagger: 0.12 * motionProfile.staggerScale,
            ease: MOTION_EASINGS.expoOut,
            clearProps: 'clipPath',
          }
        );
      };

      const el = listRef.current;
      if (!el) return;

      if (el.getBoundingClientRect().top <= window.innerHeight * 0.96) {
        revealCards();
        return;
      }

      gsap.set('.project-card-item', { y: 26, opacity: 0 });
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting || e.boundingClientRect.top <= window.innerHeight)) {
            revealCards();
            io.disconnect();
          }
        },
        { threshold: 0.04 }
      );
      io.observe(el);

      return () => io.disconnect();
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced, motionProfile.staggerScale, activeFilter]);

  const featuredProject = visibleProjects[0] ?? null;
  const secondaryProjects = visibleProjects.slice(1);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative border-t border-white/[0.06] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <SectionHeader
              kicker="01. Selected Work"
              title="Full-stack applications designed from schema to interface."
              reducedMotion={reduced}
              titleClassName="max-w-2xl"
            />
            <p className="max-w-xl text-sm sm:text-[15px] leading-relaxed text-slate-400">
              End-to-end web systems combining clean user interfaces, structured REST APIs,
              and relational database architecture.
            </p>
          </div>

          {/* Project Filter Segmented Control */}
          <div
            role="tablist"
            aria-label="Filter projects by engineering focus"
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#0D1017] p-1 self-start lg:self-auto shrink-0"
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
                  className={`rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'bg-[#2563EB] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Project + 2-Column Desktop Grid */}
        <div ref={listRef} className="projects-list mt-12 space-y-8">
          {featuredProject && (() => {
            const imgBroken = failedImages[featuredProject.id];
            const accent = PROJECT_ACCENTS[featuredProject.demoMode];

            return (
              <div key={featuredProject.id} className="project-card-item">
                <TiltCard
                  enabled={motionProfile.enable3DTilt}
                  maxTiltDeg={3}
                  cursorType="project"
                  cursorLabel="View Project"
                  className={`group relative rounded-2xl border border-white/[0.09] bg-[#0D1017] overflow-hidden transition-colors duration-300 ${accent.hoverBorder}`}
                >
                  <div
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r ${accent.topBar} opacity-75`}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-stretch">
                    {/* Featured Media Column */}
                    <div className="project-image-frame lg:col-span-7 relative overflow-hidden bg-[#06070A] aspect-[16/10] lg:aspect-auto lg:min-h-[410px]">
                      <button
                        type="button"
                        aria-label={`Open details and interactive demo for ${featuredProject.title}`}
                        onClick={() => onSelectProject(featuredProject)}
                        data-cursor="project"
                        data-cursor-label="View Project"
                        className="block h-full w-full text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#3B82F6]"
                      >
                        {!imgBroken ? (
                          <img
                            src={featuredProject.imageUrl}
                            alt={featuredProject.imageAlt}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            onError={() =>
                              setFailedImages((prev) => ({
                                ...prev,
                                [featuredProject.id]: true,
                              }))
                            }
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0D1017] via-[#131A29] to-[#06070A] p-8 text-center">
                            <Layers className="h-10 w-10 text-[#3B82F6]" aria-hidden="true" />
                            <span className="font-display text-lg font-semibold text-white">
                              {featuredProject.title}
                            </span>
                          </div>
                        )}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06070A]/80 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute top-4 left-4 rounded-lg border border-white/10 bg-[#06070A]/80 px-2.5 py-1 font-mono text-[11px] text-slate-300 tabular-nums backdrop-blur-sm"
                        >
                          {accent.indexLabel} / 03 · Featured
                        </div>
                      </button>
                    </div>

                    {/* Featured Information Column */}
                    <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                          <span className={accent.labelClass}>{featuredProject.categoryLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{featuredProject.year}</span>
                        </div>

                        <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                          {featuredProject.title}
                        </h3>

                        <p className="text-xs font-mono text-slate-400">
                          Role: <span className="text-slate-200">{featuredProject.roleSummary}</span>
                        </p>

                        <p className="text-sm sm:text-[15px] leading-relaxed text-slate-300">
                          {featuredProject.shortDescription}
                        </p>

                        <ul className="space-y-2 pt-2 text-xs leading-relaxed text-slate-400">
                          {featuredProject.features.slice(0, 3).map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <span
                                aria-hidden="true"
                                className="mt-1.5 h-1 w-1 rounded-full bg-[#3B82F6] shrink-0"
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-8 space-y-5 border-t border-white/[0.08] pt-5">
                        <p className="font-mono text-xs text-slate-400">
                          {featuredProject.stack.join(' · ')}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => onSelectProject(featuredProject)}
                            className="group/btn inline-flex items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
                          >
                            <Play className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Live Demo &amp; Case Study</span>
                          </button>

                          <a
                            href={featuredProject.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor="link"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.02] hover:bg-white/[0.08] px-4 py-2.5 text-xs font-semibold text-slate-200 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
                          >
                            <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>GitHub</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            );
          })()}

          {secondaryProjects.length > 0 && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {secondaryProjects.map((project) => {
                const imgBroken = failedImages[project.id];
                const accent = PROJECT_ACCENTS[project.demoMode];

                return (
                  <div key={project.id} className="project-card-item h-full">
                    <TiltCard
                      enabled={motionProfile.enable3DTilt}
                      maxTiltDeg={3}
                      cursorType="project"
                      cursorLabel="View Project"
                      className={`group relative flex h-full flex-col rounded-2xl border border-white/[0.09] bg-[#0D1017] overflow-hidden transition-colors duration-300 ${accent.hoverBorder}`}
                    >
                      <div
                        aria-hidden="true"
                        className={`absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r ${accent.topBar} opacity-75`}
                      />

                      {/* 16:10 Project Visual */}
                      <div className="project-image-frame relative overflow-hidden bg-[#06070A] aspect-[16/10]">
                        <button
                          type="button"
                          aria-label={`Open details and interactive demo for ${project.title}`}
                          onClick={() => onSelectProject(project)}
                          data-cursor="project"
                          data-cursor-label="View Project"
                          className="block h-full w-full text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#3B82F6]"
                        >
                          {!imgBroken ? (
                            <img
                              src={project.imageUrl}
                              alt={project.imageAlt}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              onError={() =>
                                setFailedImages((prev) => ({
                                  ...prev,
                                  [project.id]: true,
                                }))
                              }
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0D1017] via-[#131A29] to-[#06070A] p-8 text-center">
                              <Layers className="h-10 w-10 text-[#3B82F6]" aria-hidden="true" />
                              <span className="font-display text-lg font-semibold text-white">
                                {project.title}
                              </span>
                            </div>
                          )}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06070A]/80 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60"
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute top-4 left-4 rounded-lg border border-white/10 bg-[#06070A]/80 px-2.5 py-1 font-mono text-[11px] text-slate-300 tabular-nums backdrop-blur-sm"
                          >
                            {accent.indexLabel} / 03
                          </div>
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                        <div className="space-y-3.5">
                          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <span className={accent.labelClass}>{project.categoryLabel}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{project.year}</span>
                          </div>

                          <h3 className="font-display text-2xl font-bold tracking-tight text-white">
                            {project.title}
                          </h3>

                          <p className="text-xs font-mono text-slate-400">
                            Role: <span className="text-slate-200">{project.roleSummary}</span>
                          </p>

                          <p className="text-sm leading-relaxed text-slate-300">
                            {project.shortDescription}
                          </p>

                          <ul className="space-y-1.5 pt-1 text-xs leading-relaxed text-slate-400">
                            {project.features.slice(0, 2).map((feature) => (
                              <li key={feature} className="flex items-start gap-2">
                                <span
                                  aria-hidden="true"
                                  className="mt-1.5 h-1 w-1 rounded-full bg-[#3B82F6] shrink-0"
                                />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-7 space-y-5 border-t border-white/[0.08] pt-5">
                          <p className="font-mono text-xs text-slate-400">
                            {project.stack.join(' · ')}
                          </p>

                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => onSelectProject(project)}
                              className="group/btn inline-flex items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
                            >
                              <Play className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Live Demo &amp; Case Study</span>
                            </button>

                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-cursor="link"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.02] hover:bg-white/[0.08] px-4 py-2.5 text-xs font-semibold text-slate-200 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
                            >
                              <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>GitHub</span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
