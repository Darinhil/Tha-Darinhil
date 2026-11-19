import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2 } from 'lucide-react';
import { PROFILE } from '../../data/portfolioData';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  type ResponsiveMotionProfile,
} from '../../lib/motionConfig';
import { RevealBlock } from '../motion/RevealBlock';
import { SectionHeader } from '../motion/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

interface AboutSectionProps {
  motionProfile: ResponsiveMotionProfile;
}

const ABOUT_FACTS = [
  {
    label: 'Education',
    value: 'Passerelles Numériques Cambodia (PNC)',
    detail: 'Web & Software Engineering',
  },
  {
    label: 'Internship',
    value: 'Live&Learn Cambodia',
    detail: 'Full-Stack Web Development',
  },
  {
    label: 'Primary Focus',
    value: 'Frontend · Backend · API · DB',
    detail: 'End-to-End Application Delivery',
  },
  {
    label: 'Base',
    value: 'Phnom Penh, Cambodia',
    detail: 'Available for Full-Stack Roles',
  },
] as const;

export function AboutSection({ motionProfile }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const factsRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);

  const reduced = motionProfile.tier === 'reduced';

  useEffect(() => {
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Image clip-path curtain reveal with immediate viewport check
      if (imageWrapRef.current) {
        const wrap = imageWrapRef.current;
        const revealImage = () => {
          gsap.fromTo(
            wrap,
            { clipPath: 'inset(12% 0% 12% 0%)', opacity: 0 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              opacity: 1,
              duration: MOTION_DURATIONS.cinematic,
              ease: MOTION_EASINGS.expoOut,
              clearProps: 'clipPath,opacity',
            }
          );
        };

        if (wrap.getBoundingClientRect().top <= window.innerHeight * 0.96) {
          revealImage();
        } else {
          const io = new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting || e.boundingClientRect.top <= window.innerHeight)) {
                revealImage();
                io.disconnect();
              }
            },
            { threshold: 0.05 }
          );
          io.observe(wrap);
        }
      }

      if (imageRef.current && motionProfile.enableParallax) {
        gsap.fromTo(
          imageRef.current,
          { yPercent: -4, scale: 1.08 },
          {
            yPercent: 4,
            scale: 1.02,
            ease: 'none',
            scrollTrigger: {
              trigger: imageWrapRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        );
      }

      if (factsRef.current) {
        const grid = factsRef.current;
        const revealFacts = () => {
          gsap.fromTo(
            '.about-fact-card',
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: MOTION_DURATIONS.normal,
              stagger: 0.07 * motionProfile.staggerScale,
              ease: MOTION_EASINGS.power3Out,
              clearProps: 'transform,opacity',
            }
          );
        };

        if (grid.getBoundingClientRect().top <= window.innerHeight * 0.96) {
          revealFacts();
        } else {
          const io = new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting || e.boundingClientRect.top <= window.innerHeight)) {
                revealFacts();
                io.disconnect();
              }
            },
            { threshold: 0.05 }
          );
          io.observe(grid);
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced, motionProfile.enableParallax, motionProfile.staggerScale]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative border-t border-white/[0.06] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeader
          kicker="02. About Me"
          title="Engineering reliable systems with thoughtful human craft."
          reducedMotion={reduced}
          className="mb-12 lg:mb-16"
          titleClassName="max-w-2xl"
        />

        {/* 2-Column Editorial Split with items-stretch */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <RevealBlock reducedMotion={reduced} delay={0.08} className="space-y-5 text-[15px] sm:text-base leading-relaxed text-slate-300">
              <p>
                I am <span className="font-semibold text-white">Tha Darinhil</span>, a Full-Stack
                Developer trained at{' '}
                <span className="font-semibold text-white">
                  Passerelles Numériques Cambodia (PNC)
                </span>
                , where I built a disciplined foundation in software architecture, web
                engineering, and collaborative product delivery.
              </p>
              <p>
                During my internship at{' '}
                <span className="font-semibold text-white">Live&amp;Learn Cambodia</span>, I
                worked across real-world web workflows—translating design requirements into
                responsive frontend interfaces while connecting them to dependable backend
                APIs and structured databases.
              </p>
              <p className="text-slate-400">
                Whether designing normalized relational schemas in MySQL and PostgreSQL,
                building clean REST APIs with Laravel and Node.js, or refining UI
                interactions in Vue.js and React, my goal is to ship applications that feel
                fast, intuitive, and built to last.
              </p>
            </RevealBlock>

            <RevealBlock reducedMotion={reduced} delay={0.14} className="pt-4 border-t border-white/[0.08]">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
                <span>Frontend Architecture</span>
                <span aria-hidden="true">·</span>
                <span>REST API Design</span>
                <span aria-hidden="true">·</span>
                <span>Relational Databases</span>
                <span aria-hidden="true">·</span>
                <span>UI/UX Implementation</span>
              </div>
            </RevealBlock>
          </div>

          {/* Right Column: Masked & Parallax Developer Workspace Visual */}
          <div className="lg:col-span-6">
            <div
              ref={imageWrapRef}
              className="relative h-full min-h-[300px] sm:min-h-[380px] overflow-hidden rounded-2xl border border-white/10 bg-[#0D1017]"
            >
              {!imgError ? (
                <img
                  ref={imageRef}
                  src={PROFILE.workspaceImage}
                  alt="Tha Darinhil developer workstation displaying code and database architecture diagrams"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover will-change-transform"
                />
              ) : (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0D1017] via-[#111827] to-[#06070A] p-8 text-center">
                  <Code2 className="h-10 w-10 text-[#3B82F6]" aria-hidden="true" />
                  <p className="font-display text-lg font-semibold text-white">
                    Full-Stack Engineering Workspace
                  </p>
                  <p className="text-sm text-slate-400">
                    Frontend · API Architecture · Relational Data
                  </p>
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06070A]/85 via-transparent to-transparent"
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium text-white">Full-Stack Craft</span>
                <span className="font-mono text-slate-400">PNC · Live&amp;Learn Cambodia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Staggered Info Row Below Split */}
        <div
          ref={factsRef}
          className="about-facts-grid mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {ABOUT_FACTS.map((fact) => (
            <div
              key={fact.label}
              className="about-fact-card rounded-2xl border border-white/[0.08] bg-[#0D1017] p-5 transition-colors duration-200 hover:border-[#3B82F6]/40"
            >
              <div className="text-xs font-mono text-slate-400">{fact.label}</div>
              <div className="mt-2 font-display text-base font-semibold text-white">
                {fact.value}
              </div>
              <div className="mt-1 text-xs text-slate-400">{fact.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
