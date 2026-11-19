import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TIMELINE_ENTRIES } from '../../data/portfolioData';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  type ResponsiveMotionProfile,
} from '../../lib/motionConfig';
import { SectionHeader } from '../motion/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

interface TimelineSectionProps {
  motionProfile: ResponsiveMotionProfile;
}

export function TimelineSection({ motionProfile }: TimelineSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = motionProfile.tier === 'reduced';

  useEffect(() => {
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.timeline-container',
              start: 'top 76%',
              end: 'bottom 78%',
              scrub: 0.5,
            },
          }
        );
      }

      const revealTimeline = () => {
        gsap.fromTo(
          '.timeline-card',
          { x: 20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: MOTION_DURATIONS.complex,
            stagger: 0.1 * motionProfile.staggerScale,
            ease: MOTION_EASINGS.power3Out,
            clearProps: 'transform,opacity',
          }
        );
        gsap.fromTo(
          '.timeline-node',
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: MOTION_DURATIONS.normal,
            stagger: 0.1 * motionProfile.staggerScale,
            ease: MOTION_EASINGS.backSubtle,
            clearProps: 'transform,opacity',
          }
        );
      };

      const el = containerRef.current;
      if (!el) return;

      if (el.getBoundingClientRect().top <= window.innerHeight * 0.96) {
        revealTimeline();
        return;
      }

      gsap.set('.timeline-card', { x: 20, opacity: 0 });
      gsap.set('.timeline-node', { scale: 0.5, opacity: 0 });

      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting || e.boundingClientRect.top <= window.innerHeight)) {
            revealTimeline();
            io.disconnect();
          }
        },
        { threshold: 0.04 }
      );
      io.observe(el);

      return () => io.disconnect();
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced, motionProfile.staggerScale]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative border-t border-white/[0.06] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeader
          kicker="04. Experience & Education"
          title="Foundations built at PNC and refined in real product teams."
          reducedMotion={reduced}
          className="mb-14"
          titleClassName="max-w-2xl"
        />

        <div ref={containerRef} className="timeline-container relative pl-8 sm:pl-12">
          {/* Static subtle rail */}
          <div
            aria-hidden="true"
            className="absolute left-3 sm:left-4 top-2 bottom-2 w-[1px] bg-white/10"
          />
          {/* Scroll-drawn active cobalt line */}
          <div
            ref={lineRef}
            aria-hidden="true"
            className="absolute left-3 sm:left-4 top-2 bottom-2 w-[2px] -translate-x-[0.5px] origin-top bg-gradient-to-b from-[#3B82F6] via-[#60A5FA] to-[#2563EB] will-change-transform"
          />

          <div className="space-y-8">
            {TIMELINE_ENTRIES.map((entry) => (
              <div key={entry.id} className="relative">
                {/* Timeline node */}
                <div
                  aria-hidden="true"
                  className="timeline-node absolute -left-8 sm:-left-12 top-6 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-[#3B82F6]/60 bg-[#06070A]"
                >
                  <span className="h-2 w-2 rounded-full bg-[#60A5FA]" />
                </div>

                <article className="timeline-card rounded-2xl border border-white/[0.08] bg-[#0D1017] p-6 sm:p-8 transition-colors duration-200 hover:border-[#3B82F6]/35">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                    <span className="text-[#60A5FA]">{entry.period}</span>
                    <span>{entry.type}</span>
                  </div>

                  <h3 className="mt-3 font-display text-xl sm:text-2xl font-bold text-white">
                    {entry.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-300">
                    {entry.organization}
                  </p>

                  <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-slate-400 max-w-3xl">
                    {entry.description}
                  </p>

                  <ul className="mt-5 grid grid-cols-1 gap-2.5 border-t border-white/[0.06] pt-5 text-sm text-slate-300">
                    {entry.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1 w-1 rounded-full bg-[#3B82F6] shrink-0"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
