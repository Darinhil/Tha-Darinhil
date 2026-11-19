import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ArrowUpRight,
  Code2,
  Database,
  Layers,
  LayoutTemplate,
  Network,
  Server,
} from 'lucide-react';
import { SERVICES } from '../../data/portfolioData';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  type ResponsiveMotionProfile,
} from '../../lib/motionConfig';
import { SectionHeader } from '../motion/SectionHeader';

interface ServicesSectionProps {
  motionProfile: ResponsiveMotionProfile;
}

const SERVICE_ICONS: Record<string, typeof Code2> = {
  'full-stack-web': Layers,
  'frontend-dev': LayoutTemplate,
  'backend-dev': Server,
  'rest-api': Network,
  'database-design': Database,
  'responsive-ui': Code2,
};

export function ServicesSection({ motionProfile }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>(SERVICES[0].id);
  const reduced = motionProfile.tier === 'reduced';

  useEffect(() => {
    if (reduced || !listRef.current) return;

    const ctx = gsap.context(() => {
      const revealServices = () => {
        gsap.fromTo(
          '.service-row',
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: MOTION_DURATIONS.normal,
            stagger: 0.06 * motionProfile.staggerScale,
            ease: MOTION_EASINGS.power3Out,
            clearProps: 'transform,opacity',
          }
        );
      };

      const el = listRef.current;
      if (!el) return;

      if (el.getBoundingClientRect().top <= window.innerHeight * 0.96) {
        revealServices();
        return;
      }

      gsap.set('.service-row', { y: 20, opacity: 0 });
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting || e.boundingClientRect.top <= window.innerHeight)) {
            revealServices();
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
      id="services"
      ref={sectionRef}
      className="relative border-t border-white/[0.06] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-12 lg:mb-16">
          <SectionHeader
            kicker="05. What I Do"
            title="Engineering capabilities across the complete web lifecycle."
            reducedMotion={reduced}
            titleClassName="max-w-2xl"
          />
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            From database modeling and API architecture to responsive user interfaces.
          </p>
        </div>

        {/* Minimal Editorial Hairline Index List */}
        <div ref={listRef} className="border-b border-white/[0.08]">
          {SERVICES.map((service) => {
            const Icon = SERVICE_ICONS[service.id] ?? Code2;
            const isActive = activeId === service.id;

            return (
              <article
                key={service.id}
                onMouseEnter={() => setActiveId(service.id)}
                className={`service-row group relative border-t border-white/[0.08] py-7 sm:py-8 transition-colors duration-300 ${
                  isActive ? 'bg-white/[0.02]' : 'hover:bg-white/[0.015]'
                }`}
              >
                {/* Subtle left cobalt accent hairline on active/hover */}
                <div
                  aria-hidden="true"
                  className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#3B82F6] transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                  }`}
                />

                <div className="grid grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-8">
                  {/* Index & Title */}
                  <div className="lg:col-span-5 flex items-center gap-4">
                    <span className="font-mono text-xs text-[#60A5FA] tabular-nums w-7 shrink-0">
                      {service.index}
                    </span>
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 ${
                        isActive
                          ? 'border-[#3B82F6]/45 bg-[#2563EB]/10 text-[#60A5FA]'
                          : 'border-white/10 bg-[#0D1017] text-slate-400 group-hover:text-[#60A5FA]'
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-white">
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-4">
                    <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                      {service.description}
                    </p>
                  </div>

                  {/* Stack Deliverables */}
                  <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-3">
                    <span className="font-mono text-xs text-slate-400">
                      {service.deliverables}
                    </span>
                    <ArrowUpRight
                      className={`hidden sm:block h-4 w-4 shrink-0 transition-all duration-300 ${
                        isActive
                          ? 'text-[#60A5FA] translate-x-0.5 -translate-y-0.5'
                          : 'text-slate-600 group-hover:text-slate-300'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
