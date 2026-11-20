import { useRef } from 'react';
import { motion, useReducedMotion, useScroll } from 'motion/react';
import { Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { PROFILE, TIMELINE_ENTRIES, type TimelineEntry } from '../../data/portfolioData';
import { type ResponsiveMotionProfile } from '../../lib/motionConfig';
import { Reveal, REVEAL_VIEWPORT } from '../motion/Reveal';
import { SectionHeader } from '../motion/SectionHeader';
import { IconTile } from '../ui/IconTile';
import { SectionBadge3D } from '../ui/SectionBadge3D';

const TYPE_ICONS: Record<TimelineEntry['type'], typeof Sparkles> = {
  Education: GraduationCap,
  Experience: Briefcase,
  Craft: Sparkles,
};

interface TimelineSectionProps {
  motionProfile: ResponsiveMotionProfile;
}

export function TimelineSection({ motionProfile }: TimelineSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = motionProfile.tier === 'reduced';
  const reduceMotion = useReducedMotion();
  // 0 -> 1 as the timeline travels from 75% down the viewport to 75% up it
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 75%', 'end 75%'] });

  return (
    <section id="experience" className="relative py-20 sm:py-24 lg:py-32">
      <div aria-hidden="true" className="section-rule" />
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Sticky intro column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeader
                kicker="04. Experience & Education"
                badge={<SectionBadge3D src={PROFILE.experienceIllustration} width={640} height={573} reducedMotion={reduced} />}
                title="Trained at PNC, proven in real teams."
                accent="proven in real teams."
                reducedMotion={reduced}
                titleClassName="lg:text-[3rem]"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-7">
            <div ref={containerRef} className="relative pl-10 sm:pl-14">
              {/* Static subtle rail */}
              <div
                aria-hidden="true"
                className="absolute left-[15px] sm:left-[19px] top-3 bottom-3 w-px bg-white/[0.08]"
              />
              {/* Scroll-drawn active cobalt line */}
              <motion.div
                aria-hidden="true"
                style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
                className="absolute left-[15px] sm:left-[19px] top-3 bottom-3 w-[2px] -translate-x-[0.5px] origin-top bg-gradient-to-b from-brand-400 via-brand-500 to-brand-secondary/60"
              />

              <div className="space-y-5">
                {TIMELINE_ENTRIES.map((entry) => {
                  const Icon = TYPE_ICONS[entry.type];
                  return (
                    <Reveal key={entry.id} className="relative" direction="right" distance={28} amount={0.25}>
                      {/* Timeline node */}
                      <motion.div
                        className="absolute -left-10 sm:-left-14 top-6 rounded-full bg-canvas p-1 -m-1"
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={REVEAL_VIEWPORT}
                        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
                      >
                        <IconTile tone="accent" shape="circle" className="h-8! w-8! sm:h-10! sm:w-10! [&_svg]:h-4! [&_svg]:w-4!">
                          <Icon strokeWidth={1.75} />
                        </IconTile>
                      </motion.div>

                      <article className="surface spotlight rounded-[22px] border border-white/[0.08] p-6 sm:p-8 transition-[translate,border-color] duration-500 hover:-translate-y-1 hover:border-white/[0.14]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[13px] font-medium text-brand-400">
                            {entry.period}
                          </span>
                        </div>

                        <h3 className="mt-4 font-display text-xl sm:text-[1.6rem] font-semibold leading-tight tracking-[-0.03em] text-white">
                          {entry.title}
                        </h3>
                        <p className="mt-1.5 text-sm font-medium text-slate-400">{entry.organization}</p>

                        <p className="mt-4 text-[15px] leading-relaxed text-slate-400">{entry.description}</p>

                        <ul className="mt-6 space-y-2.5 border-t border-white/[0.06] pt-6 text-sm leading-relaxed text-slate-300">
                          {entry.highlights.map((highlight) => (
                            <li key={highlight} className="flex items-start gap-3">
                              <span
                                aria-hidden="true"
                                className="mt-[9px] h-px w-3 shrink-0 bg-brand-400"
                              />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
