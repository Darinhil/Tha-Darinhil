import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDown, ArrowRight, ArrowUpRight, Database, Layers, Server } from 'lucide-react';
import { HERO_FLOATING_TECH, PROFILE } from '../../data/portfolioData';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  splitTextChars,
  type ResponsiveMotionProfile,
} from '../../lib/motionConfig';
import { MagneticButton } from '../motion/MagneticButton';

interface HeroSectionProps {
  ready: boolean;
  motionProfile: ResponsiveMotionProfile;
  onNavigate: (sectionId: string) => void;
}

const ARCHITECTURE_LAYERS = [
  {
    id: 'frontend',
    label: 'Frontend Layer',
    icon: Layers,
    stack: 'Vue.js · React · TypeScript · Tailwind CSS',
    detail:
      'Reactive component trees, fluid state orchestration, and GPU-composited motion transitions.',
  },
  {
    id: 'backend',
    label: 'API & Business Logic',
    icon: Server,
    stack: 'Laravel · PHP · Node.js · Express.js',
    detail:
      'RESTful controllers, request validation, role-based permissions, and clean service boundaries.',
  },
  {
    id: 'database',
    label: 'Database Engine',
    icon: Database,
    stack: 'MySQL · PostgreSQL · SQLite',
    detail:
      'Normalized relational schemas, foreign-key constraints, and predictable query performance.',
  },
] as const;

const DISCIPLINE_RIBBON = [
  'Full-Stack Web Engineering',
  'Frontend Architecture',
  'RESTful API Design',
  'Relational Database Modeling',
  'UI/UX Implementation',
  'Motion & Micro-Interactions',
] as const;

export function HeroSection({ ready, motionProfile, onNavigate }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const orbOneRef = useRef<HTMLDivElement>(null);
  const orbTwoRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<'frontend' | 'backend' | 'database'>('frontend');

  const reduced = motionProfile.tier === 'reduced';
  const nameChars = splitTextChars(PROFILE.name);

  // Choreographed entrance sequence after preloader completes
  useEffect(() => {
    if (!ready || reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: MOTION_EASINGS.expoOut } });

      tl.fromTo(
        '.hero-kicker',
        { x: -16, opacity: 0 },
        { x: 0, opacity: 1, duration: MOTION_DURATIONS.normal, clearProps: 'transform,opacity' }
      )
        .fromTo(
          '.hero-char',
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: MOTION_DURATIONS.complex,
            stagger: 0.022 * motionProfile.staggerScale,
            clearProps: 'transform,opacity',
          },
          '-=0.28'
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
        )
        .fromTo(
          '.hero-stack-tile',
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: MOTION_DURATIONS.normal,
            stagger: 0.045,
            clearProps: 'transform,opacity',
          },
          '-=0.48'
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
        spotlightRef.current.style.background = `radial-gradient(620px circle at ${x}px ${y}px, rgba(37, 99, 235, 0.08), transparent 65%)`;
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

  // Lightweight ambient particle field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !motionProfile.enableParticles) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particleCount = motionProfile.tier === 'desktop' ? 28 : 14;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.5,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      alpha: Math.random() * 0.32 + 0.1,
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${p.alpha})`;
        ctx.fill();
      }
      rafId = window.requestAnimationFrame(draw);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    rafId = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(rafId);
    };
  }, [motionProfile.enableParticles, motionProfile.tier]);

  const currentLayer =
    ARCHITECTURE_LAYERS.find((layer) => layer.id === activeLayer) ??
    ARCHITECTURE_LAYERS[0];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden pt-28 pb-0 lg:pt-32"
    >
      {/* Background: architectural grid, cursor spotlight, soft lighting orbs, and lightweight particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-architectural-grid opacity-75" />
        <div ref={spotlightRef} className="absolute inset-0 transition-opacity duration-300" />
        <div
          ref={orbOneRef}
          className="absolute -top-32 left-[-10%] h-[420px] w-[420px] rounded-full bg-[#2563EB]/14 blur-[110px] will-change-transform"
        />
        <div
          ref={orbTwoRef}
          className="absolute bottom-[-10%] right-[-8%] h-[440px] w-[440px] rounded-full bg-[#1E40AF]/14 blur-[120px] will-change-transform"
        />
        {motionProfile.enableParticles && (
          <canvas
            ref={canvasRef}
            data-testid="hero-particles"
            className="absolute inset-0 h-full w-full opacity-80"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06070A] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto my-auto w-full max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Editorial Typography Hierarchy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="hero-kicker flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-slate-400">
              <span className="text-[#60A5FA]">Available for Full-Stack Opportunities</span>
              <span aria-hidden="true">·</span>
              <span>{PROFILE.location}</span>
              <span aria-hidden="true">·</span>
              <span>{PROFILE.education}</span>
            </div>

            <div className="space-y-3">
              <h1
                aria-label={PROFILE.name}
                className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.02] text-[#F4F6F9]"
              >
                <span className="inline-flex flex-wrap overflow-hidden">
                  {nameChars.map((char, index) => (
                    <span
                      key={`${char}-${index}`}
                      className={`hero-char inline-block will-change-transform ${
                        char === ' ' ? 'w-[0.28em]' : ''
                      }`}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </span>
              </h1>

              <p className="hero-role font-display text-lg sm:text-xl font-medium text-[#60A5FA] tracking-tight">
                {PROFILE.role}
              </p>
            </div>

            <blockquote className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-slate-100 max-w-2xl text-balance leading-[1.2]">
              <span className="block overflow-hidden">
                <span className="hero-headline-line block">
                  “Building Digital Experiences
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-headline-line block">
                  From Frontend to Backend.”
                </span>
              </span>
            </blockquote>

            <p className="hero-desc-line max-w-xl text-[15px] sm:text-base leading-relaxed text-slate-400">
              {PROFILE.subheadline}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton
                onClick={() => onNavigate('projects')}
                cursorType="button"
                className="hero-cta group rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(37,99,235,0.28)] hover:shadow-[0_0_36px_rgba(37,99,235,0.45)]"
              >
                <span>Explore My Work</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </MagneticButton>

              <MagneticButton
                onClick={() => onNavigate('contact')}
                cursorType="button"
                className="hero-cta group rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 px-6 py-3 text-sm font-semibold text-slate-100"
              >
                <span>Let&apos;s Talk</span>
                <ArrowRight
                  className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white"
                  aria-hidden="true"
                />
              </MagneticButton>
            </div>

            {/* Clean Social Profile Links */}
            <div className="hero-desc-line flex flex-wrap items-center gap-6 pt-1 text-xs font-medium text-slate-400">
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="group inline-flex items-center gap-2 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-white"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" aria-hidden="true" />
              </a>

              <a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="group inline-flex items-center gap-2 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-white"
                  aria-hidden="true"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span>LinkedIn</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Full-Stack Architecture Visual + 3x2 Precision Stack Matrix */}
          <div className="lg:col-span-5 space-y-3.5">
            <div
              ref={visualRef}
              className="hero-visual relative rounded-2xl border border-white/10 bg-[#0D1017]/92 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-md"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <span className="font-display text-sm font-semibold text-slate-100">
                  Full-Stack System Flow
                </span>
                <span className="font-mono text-xs text-slate-400">
                  Client → API → DB
                </span>
              </div>

              {/* Layer Switcher Tabs */}
              <div
                role="tablist"
                aria-label="Architecture layers"
                className="mt-4 grid grid-cols-3 gap-1.5 rounded-xl bg-[#06070A] p-1 border border-white/[0.06]"
              >
                {ARCHITECTURE_LAYERS.map((layer) => {
                  const Icon = layer.icon;
                  const active = activeLayer === layer.id;
                  return (
                    <button
                      key={layer.id}
                      role="tab"
                      type="button"
                      aria-selected={active}
                      onClick={() => setActiveLayer(layer.id)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                        active
                          ? 'bg-[#161E2E] text-white border border-[#3B82F6]/45'
                          : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="capitalize">{layer.id}</span>
                    </button>
                  );
                })}
              </div>

              {/* Live SVG Signal Pipeline */}
              <div className="mt-4 px-2" aria-hidden="true">
                <svg viewBox="0 0 360 22" className="w-full h-5">
                  <line
                    x1="28"
                    y1="11"
                    x2="332"
                    y2="11"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="28"
                    y1="11"
                    x2="332"
                    y2="11"
                    stroke="#3B82F6"
                    strokeWidth="1.5"
                    strokeDasharray="6 18"
                    className="animate-signal-dash"
                  />
                  {[28, 180, 332].map((cx, i) => {
                    const layerId = ARCHITECTURE_LAYERS[i].id;
                    const isNodeActive = activeLayer === layerId;
                    return (
                      <circle
                        key={cx}
                        cx={cx}
                        cy={11}
                        r={isNodeActive ? 5 : 3.5}
                        fill={isNodeActive ? '#60A5FA' : '#0D1017'}
                        stroke={isNodeActive ? '#93C5FD' : 'rgba(255,255,255,0.35)'}
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Active Layer Details */}
              <div className="mt-2 rounded-xl border border-white/[0.07] bg-[#06070A]/85 p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-base font-semibold text-white">
                    {currentLayer.label}
                  </h2>
                  <span className="font-mono text-[11px] text-[#60A5FA]">
                    Active Layer
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  {currentLayer.detail}
                </p>
                <div className="pt-2 border-t border-white/[0.06] font-mono text-xs text-slate-400">
                  {currentLayer.stack}
                </div>
              </div>

              {/* Architectural Data Flow Nodes */}
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {ARCHITECTURE_LAYERS.map((layer) => {
                  const active = activeLayer === layer.id;
                  return (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => setActiveLayer(layer.id)}
                      className={`rounded-xl border px-2.5 py-2.5 text-left transition-all duration-200 ${
                        active
                          ? 'border-[#3B82F6]/60 bg-[#2563EB]/12'
                          : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15'
                      }`}
                    >
                      <div className="text-[11px] font-mono text-slate-400 capitalize">
                        {layer.id}
                      </div>
                      <div className="mt-0.5 text-[11px] font-medium text-slate-200 whitespace-nowrap">
                        {layer.id === 'frontend'
                          ? 'Vue · React'
                          : layer.id === 'backend'
                            ? 'Laravel · Node'
                            : 'MySQL · PgSQL'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clean 3x2 Precision Core Stack Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {HERO_FLOATING_TECH.map((tech) => (
                <div
                  key={tech.label}
                  className="hero-stack-tile rounded-xl border border-white/[0.08] bg-[#0D1017]/90 px-3 py-2 text-xs font-mono transition-colors duration-200 hover:border-[#3B82F6]/45"
                >
                  <div className="text-[#60A5FA] font-medium">{tech.label}</div>
                  <div className="text-[11px] text-slate-500">{tech.layer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-10 lg:mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            aria-label="Scroll to Selected Work"
            className="group inline-flex flex-col items-center gap-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
          >
            <span>Scroll to explore</span>
            <span className="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 p-1 group-hover:border-[#3B82F6]/60 transition-colors">
              <span
                className={`h-1.5 w-1 rounded-full bg-[#60A5FA] ${
                  reduced ? '' : 'animate-bounce'
                }`}
              />
            </span>
            <ArrowDown className="h-3.5 w-3.5 text-slate-500 group-hover:text-[#60A5FA] transition-colors" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Editorial Discipline Ribbon */}
      <div className="relative z-10 border-t border-white/[0.06] bg-[#06070A]/80 py-3.5 overflow-hidden">
        <div className="animate-marquee-track flex items-center gap-8 text-xs font-mono text-slate-400 whitespace-nowrap select-none">
          {[...DISCIPLINE_RIBBON, ...DISCIPLINE_RIBBON].map((item, idx) => (
            <span key={`${item}-${idx}`} className="inline-flex items-center gap-8">
              <span>{item}</span>
              <span aria-hidden="true" className="text-[#3B82F6]">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
