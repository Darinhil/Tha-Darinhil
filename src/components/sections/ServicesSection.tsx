import { useState } from 'react';
import {
  Code2,
  Database,
  Layers,
  LayoutTemplate,
  Network,
  Server,
} from 'lucide-react';
import { PROFILE, SERVICES } from '../../data/portfolioData';
import { type ResponsiveMotionProfile } from '../../lib/motionConfig';
import { Stagger, StaggerItem } from '../motion/Reveal';
import { SectionHeader } from '../motion/SectionHeader';
import { IconTile } from '../ui/IconTile';
import { SectionBadge3D } from '../ui/SectionBadge3D';
import { TechChip } from '../ui/TechChip';

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
  const [activeId, setActiveId] = useState<string>(SERVICES[0].id);
  const reduced = motionProfile.tier === 'reduced';

  return (
    <section id="services" className="relative py-20 sm:py-24 lg:py-32">
      <div aria-hidden="true" className="section-rule" />
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-14">
          <SectionHeader
            kicker="05. What I Do"
            badge={<SectionBadge3D src={PROFILE.servicesIllustration} width={640} height={552} reducedMotion={reduced} />}
            title="What I can build for you."
            accent="for you."
            reducedMotion={reduced}
            titleClassName="max-w-2xl"
          />
        </div>

        {/* Capability bento: 3 x 2 */}
        <Stagger stagger={0.08} amount={0.1} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = SERVICE_ICONS[service.id] ?? Code2;
            const isActive = activeId === service.id;

            return (
              <StaggerItem
                as="article"
                key={service.id}
                onMouseEnter={() => setActiveId(service.id)}
                className="surface spotlight group flex flex-col rounded-[22px] border border-white/[0.08] p-6 sm:p-7 transition-[border-color,translate] duration-500 hover:-translate-y-1 hover:border-white/[0.14]"
              >
                <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-8">
                  <IconTile size="lg" tone={isActive ? 'accent' : 'neutral'}>
                    <Icon strokeWidth={1.75} />
                  </IconTile>
                  <h3 className="font-display text-lg font-semibold tracking-[-0.03em] text-white sm:text-xl">
                    {service.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
                  {service.description}
                </p>

                <ul className="mt-auto flex flex-wrap gap-1.5 pt-5 sm:pt-7">
                  {service.deliverables.split(' · ').map((item) => (
                    <TechChip key={item} label={item} />
                  ))}
                </ul>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
