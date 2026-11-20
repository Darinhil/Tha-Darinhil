import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Layers,
  Play,
  UserRound,
  X,
} from 'lucide-react';
import { PROJECTS } from '../../data/portfolioData';
import { MOTION_EASINGS } from '../../lib/motionConfig';
import type { ProjectItem } from '../../lib/portfolioUtils';
import { TechChip } from '../ui/TechChip';

interface ProjectModalProps {
  project: ProjectItem | null;
  reducedMotion: boolean;
  onClose: () => void;
  onSelectProject?: (project: ProjectItem) => void;
}

const KICKER = 'font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-brand-400';

export function ProjectModal({
  project,
  reducedMotion,
  onClose,
  onSelectProject,
}: ProjectModalProps) {
  const [imgError, setImgError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentIdx = project ? PROJECTS.findIndex((p) => p.id === project.id) : -1;
  const prevProject =
    currentIdx >= 0 ? PROJECTS[(currentIdx - 1 + PROJECTS.length) % PROJECTS.length] : null;
  const nextProject =
    currentIdx >= 0 ? PROJECTS[(currentIdx + 1) % PROJECTS.length] : null;

  // Switching projects starts the new case study from the top
  useEffect(() => {
    setImgError(false);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (onSelectProject && e.key === 'ArrowLeft' && prevProject) onSelectProject(prevProject);
      else if (onSelectProject && e.key === 'ArrowRight' && nextProject) onSelectProject(nextProject);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, onSelectProject, prevProject, nextProject]);

  const rise = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: MOTION_EASINGS.appleEase },
        };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6"
        >
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0 : 0.38, ease: MOTION_EASINGS.appleEase }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[min(92vh,940px)] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-surface-2 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
          >
            {/* Close, floating over the hero */}
            <button
              type="button"
              aria-label="Close project details"
              onClick={onClose}
              className="force-dark absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white ring-1 ring-white/15 backdrop-blur-md transition-[background-color,rotate] duration-300 hover:rotate-90 hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <div
              ref={scrollRef}
              data-lenis-prevent
              className="modal-scroll flex-1 overflow-y-auto overscroll-contain"
            >
              {/* ---------- Hero: screenshot with the title laid over a fade ---------- */}
              <div className="relative">
                <motion.div
                  layoutId={`project-media-${project.id}`}
                  transition={{ duration: reducedMotion ? 0 : 0.55, ease: MOTION_EASINGS.appleEase }}
                  className="force-dark relative aspect-[4/3] overflow-hidden bg-canvas sm:aspect-[2/1]"
                >
                  {!imgError ? (
                    <img
                      src={project.imageUrl}
                      alt={project.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="h-full w-full object-cover object-[50%_35%]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Layers className="h-10 w-10 text-brand-500" aria-hidden="true" />
                    </div>
                  )}
                </motion.div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-surface-2 via-surface-2/80 to-transparent"
                />

                <motion.div
                  key={`head-${project.id}`}
                  {...rise(0.08)}
                  className="absolute inset-x-0 bottom-0 px-6 pb-2 sm:px-10"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 px-3 py-1 font-medium text-brand-300 ring-1 ring-inset ring-brand-400/25">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />
                      {project.categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-slate-300 ring-1 ring-inset ring-white/10 tabular-nums">
                      <CalendarDays className="h-3 w-3" aria-hidden="true" />
                      {project.year}
                    </span>
                  </div>
                  <h3
                    id="project-modal-title"
                    className="mt-3 font-display text-[1.9rem] font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl"
                  >
                    {project.title}
                  </h3>
                </motion.div>
              </div>

              {/* ---------- Body ---------- */}
              <div className="grid grid-cols-1 gap-8 px-6 pb-8 pt-6 sm:px-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
                <div className="space-y-9">
                  <motion.section key={`ov-${project.id}`} {...rise(0.14)}>
                    <h4 className={KICKER}>Overview</h4>
                    <p className="mt-3 text-[15px] leading-[1.75] text-slate-300 sm:text-base">
                      {project.architectureOverview}
                    </p>
                  </motion.section>

                  <section>
                    <motion.h4 key={`kf-${project.id}`} {...rise(0.2)} className={KICKER}>
                      Key features
                    </motion.h4>
                    <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {project.features.map((feat, i) => (
                        <motion.li
                          key={`${project.id}-${feat}`}
                          {...rise(0.24 + i * 0.06)}
                          className="group/feat relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-colors duration-300 hover:border-brand-500/35 hover:bg-white/[0.04]"
                        >
                          <span className="font-mono text-xs font-semibold text-brand-400 tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <p className="mt-2 text-sm leading-relaxed text-slate-200">{feat}</p>
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-4 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand-500 to-transparent transition-transform duration-500 group-hover/feat:scale-x-100"
                          />
                        </motion.li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* Project facts */}
                <motion.aside key={`aside-${project.id}`} {...rise(0.18)} className="lg:pt-1">
                  <div className="space-y-6 rounded-2xl border border-white/[0.08] bg-canvas/60 p-5 lg:sticky lg:top-6">
                    <dl className="space-y-4">
                      {[
                        { icon: UserRound, label: 'Role', value: project.roleSummary },
                        { icon: CalendarDays, label: 'Timeline', value: project.year },
                        { icon: Layers, label: 'Type', value: project.categoryLabel },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex gap-3">
                          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 ring-1 ring-inset ring-brand-400/20">
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <dt className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{label}</dt>
                            <dd className="mt-0.5 text-sm font-medium leading-snug text-white">{value}</dd>
                          </div>
                        </div>
                      ))}
                    </dl>

                    <div className="h-px bg-white/[0.07]" />

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Tech stack</p>
                      <ul aria-label="Technology stack" className="mt-3 flex flex-wrap gap-1.5">
                        {project.stack.map((tech) => (
                          <TechChip key={tech} label={tech} />
                        ))}
                      </ul>
                    </div>

                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="force-dark btn-sheen flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-accent px-4 py-2.5 text-sm font-semibold text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                        Live Demo
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <p className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-dashed border-white/12 px-4 py-2.5 text-sm font-medium text-slate-500">
                        <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                        Live demo coming soon
                      </p>
                    )}
                  </div>
                </motion.aside>
              </div>

              {/* ---------- Previous / next project ---------- */}
              {onSelectProject && prevProject && nextProject && prevProject.id !== project.id && (
                <nav
                  aria-label="More projects"
                  className="grid grid-cols-2 gap-3 border-t border-white/[0.07] px-6 py-5 sm:px-10"
                >
                  {[
                    { p: prevProject, dir: 'Previous', Icon: ArrowLeft, align: 'items-start text-left' },
                    { p: nextProject, dir: 'Next', Icon: ArrowRight, align: 'items-end text-right' },
                  ].map(({ p, dir, Icon, align }) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => onSelectProject(p)}
                      className={`group/nav flex min-w-0 flex-col gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 transition-colors duration-300 hover:border-brand-500/35 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-brand-500 ${align}`}
                    >
                      <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-slate-500">
                        {dir === 'Previous' && (
                          <Icon className="h-3 w-3 transition-transform duration-300 group-hover/nav:-translate-x-0.5" aria-hidden="true" />
                        )}
                        {dir}
                        {dir === 'Next' && (
                          <Icon className="h-3 w-3 transition-transform duration-300 group-hover/nav:translate-x-0.5" aria-hidden="true" />
                        )}
                      </span>
                      <span className="w-full truncate text-sm font-semibold text-white transition-colors group-hover/nav:text-brand-300">
                        {p.title}
                      </span>
                    </button>
                  ))}
                </nav>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
