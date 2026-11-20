import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { PROFILE, PROJECTS, SKILLS } from '../../data/portfolioData';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  splitTextChars,
  type ResponsiveMotionProfile,
} from '../../lib/motionConfig';
import { MagneticButton } from '../motion/MagneticButton';
import { useParallaxEnabled } from '../motion/Reveal';
import { SocialIcon } from '../ui/SocialIcon';

interface HeroSectionProps {
  ready: boolean;
  motionProfile: ResponsiveMotionProfile;
  onNavigate: (sectionId: string) => void;
}

// Frontend, backend and database
const STACK_LAYER_COUNT = 3;

const TYPE_SPEED_MS = 60;
const DELETE_SPEED_MS = 32;
const HOLD_TYPED_MS = 1800;
const HOLD_EMPTY_MS = 380;
const START_DELAY_MS = 700;

/**
 * Typewriter loop under a moving brand-gradient sheen: types each phrase,
 * holds it, backspaces it, then moves on to the next.
 */
function TypedRole({ phrases, animate }: { phrases: readonly string[]; animate: boolean }) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(animate ? 0 : phrases[0].length);
  const [deleting, setDeleting] = useState(false);
  const [started, setStarted] = useState(!animate);

  const phrase = phrases[index % phrases.length];

  // Wait for the name reveal before typing starts
  useEffect(() => {
    if (!animate) return;
    const timer = window.setTimeout(() => setStarted(true), START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [animate]);

  useEffect(() => {
    if (!animate || !started) return;

    let delay: number;
    let step: () => void;

    if (!deleting && count < phrase.length) {
      delay = TYPE_SPEED_MS;
      step = () => setCount((c) => c + 1);
    } else if (!deleting) {
      delay = HOLD_TYPED_MS;
      step = () => setDeleting(true);
    } else if (count > 0) {
      delay = DELETE_SPEED_MS;
      step = () => setCount((c) => c - 1);
    } else {
      delay = HOLD_EMPTY_MS;
      step = () => {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      };
    }

    const timer = window.setTimeout(step, delay);
    return () => window.clearTimeout(timer);
  }, [animate, started, deleting, count, phrase, phrases.length]);

  // Keep the caret solid while typing/deleting; blink only while paused
  const paused = !started || (!deleting && count === phrase.length) || (deleting && count === 0);

  return (
    <span aria-hidden="true" className="inline-flex min-h-[1.2em] items-center">
      <span className="text-shimmer whitespace-pre">{phrase.slice(0, count)}</span>
      <span
        className={`ml-1.5 inline-block h-[0.9em] w-[3px] rounded-full bg-brand-400 ${
          !animate ? 'opacity-0' : paused ? 'animate-caret-blink' : ''
        }`}
      />
    </span>
  );
}

export function HeroSection({ ready, motionProfile, onNavigate }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  // Scroll-away parallax for the illustration (desktop, motion allowed)
  const parallaxOn = useParallaxEnabled();
  const { scrollYProgress: heroScroll } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const visualY = useTransform(heroScroll, [0, 1], [0, 160]);
  const visualOpacity = useTransform(heroScroll, [0, 0.9], [1, 0.2]);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const orbOneRef = useRef<HTMLDivElement>(null);
  const orbTwoRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const reduced = motionProfile.tier === 'reduced';
  const nameChars = splitTextChars(PROFILE.name);

  // Choreographed entrance sequence after preloader completes
  useEffect(() => {
    if (!ready || reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: MOTION_EASINGS.expoOut } });

      tl.fromTo(
          '.hero-char',
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: MOTION_DURATIONS.complex,
            stagger: 0.022 * motionProfile.staggerScale,
            clearProps: 'transform,opacity',
          }
        )
        .fromTo(
          '.hero-role',
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: MOTION_DURATIONS.normal, clearProps: 'transform,opacity' },
          '-=0.55'
        )
        .fromTo(
          '.hero-headline-line',
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: MOTION_DURATIONS.complex,
            stagger: 0.08 * motionProfile.staggerScale,
            clearProps: 'transform,opacity',
          },
          '-=0.45'
        )
        .fromTo(
          '.hero-desc-line',
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: MOTION_DURATIONS.normal,
            stagger: 0.07 * motionProfile.staggerScale,
            clearProps: 'transform,opacity',
          },
          '-=0.5'
        )
        .fromTo(
          '.hero-cta',
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: MOTION_DURATIONS.normal,
            stagger: 0.08,
            clearProps: 'transform,opacity',
          },
          '-=0.42'
        )
        .fromTo(
          '.hero-visual',
          { y: 24, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: MOTION_DURATIONS.complex,
            clearProps: 'transform,opacity',
          },
          '-=0.68'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [ready, reduced, motionProfile.staggerScale]);

  // Subtle mouse parallax & cursor spotlight on desktop
  useEffect(() => {
    if (!motionProfile.enableParallax || motionProfile.tier !== 'desktop') return;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;

      if (spotlightRef.current && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spotlightRef.current.style.background = `radial-gradient(620px circle at ${x}px ${y}px, color-mix(in srgb, var(--color-brand-600) 8%, transparent), transparent 65%)`;
      }

      if (orbOneRef.current) {
        gsap.to(orbOneRef.current, {
          x: nx * 24,
          y: ny * 18,
          duration: 1.2,
          ease: MOTION_EASINGS.power2Out,
        });
      }
      if (orbTwoRef.current) {
        gsap.to(orbTwoRef.current, {
          x: -nx * 20,
          y: -ny * 16,
          duration: 1.4,
          ease: MOTION_EASINGS.power2Out,
        });
      }
      if (visualRef.current) {
        gsap.to(visualRef.current, {
          x: nx * 8,
          y: ny * 6,
          duration: 0.9,
          ease: MOTION_EASINGS.power2Out,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [motionProfile.enableParallax, motionProfile.tier]);

  const heroStats = [
    { value: String(PROJECTS.length).padStart(2, '0'), label: 'Shipped projects' },
    { value: String(SKILLS.length).padStart(2, '0'), label: 'Technologies' },
    { value: String(STACK_LAYER_COUNT).padStart(2, '0'), label: 'Stack layers' },
  ];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden pt-28 pb-0 lg:pt-32"
    >
      {/* Background: masked grid, top light beam, cursor spotlight, soft orbs, particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-architectural-grid mask-radial-top opacity-60" />
        <div className="absolute left-1/2 top-[-260px] h-[520px] w-[960px] max-w-[160vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-brand-500)_16%,transparent),transparent)]" />
        <div ref={spotlightRef} className="absolute inset-0 transition-opacity duration-300" />
        <div
          ref={orbOneRef}
          className="absolute -top-32 left-[-10%] h-[420px] w-[420px] rounded-full bg-brand-600/8 blur-[110px] will-change-transform"
        />
        <div
          ref={orbTwoRef}
          className="absolute bottom-[-10%] right-[-8%] h-[440px] w-[440px] rounded-full bg-brand-700/8 blur-[120px] will-change-transform"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent" />
      </div>

      <div className="relative z-10 mx-auto my-auto w-full max-w-6xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Editorial Typography Hierarchy */}
          <div className="lg:col-span-6">
            <h1
              aria-label={PROFILE.name}
              className="font-display text-[3.25rem] sm:text-7xl lg:text-[5.25rem] font-semibold tracking-[-0.05em] leading-[0.95] text-white"
            >
              <span aria-hidden="true" className="inline-flex flex-wrap overflow-hidden pb-[0.08em]">
                {nameChars.map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className={`hero-char inline-block will-change-transform ${
                      char === ' ' ? 'w-[0.24em]' : ''
                    }`}
                  >
                    {char === ' ' ? ' ' : char}
                  </span>
                ))}
              </span>
            </h1>

            <p
              aria-label={PROFILE.role}
              className="hero-role mt-5 flex items-center font-display text-[1.75rem] sm:text-4xl lg:text-[2.6rem] font-semibold tracking-[-0.035em] leading-tight"
            >
              <TypedRole phrases={PROFILE.typedRoles} animate={!reduced} />
            </p>

            <p className="mt-10 font-display text-[1.6rem] sm:text-[2.1rem] lg:text-[2.4rem] font-medium tracking-[-0.03em] leading-[1.15] text-white max-w-2xl">
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="hero-headline-line block">
                  Building Digital Experiences
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="hero-headline-line block text-slate-500">
                  From Frontend to Backend.
                </span>
              </span>
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <MagneticButton
                onClick={() => onNavigate('projects')}
                cursorType="button"
                className="hero-cta force-dark btn-sheen group rounded-full bg-gradient-to-r from-brand-600 to-brand-accent hover:brightness-110 pl-6 pr-5 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_30px_-8px_color-mix(in_srgb,var(--color-brand-600)_70%,transparent)]"
              >
                <span>Explore My Work</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </MagneticButton>

              <MagneticButton
                onClick={() => onNavigate('contact')}
                cursorType="button"
                className="hero-cta group rounded-full border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 px-6 py-3.5 text-sm font-semibold text-slate-100 backdrop-blur-sm"
              >
                <span>Let&apos;s Talk</span>
                <ArrowUpRight
                  className="h-4 w-4 text-slate-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                  aria-hidden="true"
                />
              </MagneticButton>

              <div className="hero-cta flex items-center gap-2 sm:ml-2">
                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  aria-label="GitHub profile"
                  className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:text-white focus-visible:outline-2 focus-visible:outline-brand-500"
                >
                  <SocialIcon network="GitHub" className="h-[18px] w-[18px]" />
                </a>
                <a
                  href={PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  aria-label="LinkedIn profile"
                  className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:text-white focus-visible:outline-2 focus-visible:outline-brand-500"
                >
                  <SocialIcon network="LinkedIn" className="h-[17px] w-[17px]" />
                </a>
              </div>
            </div>

            {/* Quiet stat strip */}
            <dl className="hero-desc-line mt-12 grid max-w-lg grid-cols-3 border-t border-white/[0.08] pt-6">
              {heroStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`${i > 0 ? 'border-l border-white/[0.08] pl-5' : ''} pr-3`}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-3xl font-semibold tracking-[-0.04em] text-white tabular-nums">
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-xs text-slate-500">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right Column: 3D developer illustration */}
          <motion.div
            style={parallaxOn ? { y: visualY, opacity: visualOpacity } : undefined}
            className="lg:col-span-6 relative flex justify-center lg:justify-end"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-brand-600)_30%,transparent),color-mix(in_srgb,var(--color-brand-600)_7%,transparent)_60%,transparent)] blur-2xl"
            />

            <div ref={visualRef} className="hero-visual relative w-full max-w-[460px] sm:max-w-[560px] lg:max-w-none lg:-mr-6 xl:-mr-12">
              <div className={reduced ? '' : 'animate-hero-float'}>
                <img
                  src={PROFILE.heroIllustration}
                  alt="3D illustration of a developer coding at a desk surrounded by tech icons"
                  width={1200}
                  height={810}
                  draggable={false}
                  fetchPriority="high"
                  className="relative h-auto w-full select-none drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
                />
              </div>
              <div aria-hidden="true" className="mx-auto -mt-8 h-8 w-2/3 rounded-[50%] bg-black/70 blur-xl" />
            </div>
          </motion.div>
        </div>

      </div>

    </section>
  );
}
