import { useState } from 'react';
import { Briefcase, Code2, GraduationCap, MapPin, Target } from 'lucide-react';
import { PROFILE } from '../../data/portfolioData';
import { type ResponsiveMotionProfile } from '../../lib/motionConfig';
import { ImageReveal, Parallax, Stagger, StaggerItem } from '../motion/Reveal';
import { RevealBlock } from '../motion/RevealBlock';
import { SectionHeader } from '../motion/SectionHeader';
import { TiltCard } from '../motion/TiltCard';
import { IconTile } from '../ui/IconTile';
import { SectionBadge3D } from '../ui/SectionBadge3D';

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

const FACT_ICONS: Record<(typeof ABOUT_FACTS)[number]['label'], typeof Code2> = {
  Education: GraduationCap,
  Internship: Briefcase,
  'Primary Focus': Target,
  Base: MapPin,
};

export function AboutSection({ motionProfile }: AboutSectionProps) {
  const [imgError, setImgError] = useState(false);

  const reduced = motionProfile.tier === 'reduced';

  return (
    <section id="about" className="relative py-20 sm:py-24 lg:py-32">
      <div aria-hidden="true" className="section-rule" />
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        {/* 2-Column Editorial Split */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-stretch lg:gap-14">
          <div className="lg:col-span-7 flex flex-col">

            <SectionHeader
              kicker="02. About Me"
              badge={<SectionBadge3D src={PROFILE.aboutIllustration} width={640} height={579} reducedMotion={reduced} />}
              title="Reliable systems, built with craft."
              accent="built with craft."
              reducedMotion={reduced}
              titleClassName="max-w-2xl"
            />

            <RevealBlock reducedMotion={reduced} delay={0.08} className="mt-10 space-y-5 text-[15px] sm:text-base leading-[1.75] text-slate-400">
              <p className="font-display text-xl sm:text-[1.4rem] leading-[1.5] tracking-[-0.015em] text-slate-200">
                I&apos;m <span className="font-semibold text-white">Tha Darinhil</span>, a Full-Stack
                Developer trained at{' '}
                <span className="font-semibold text-white">Passerelles Numériques Cambodia (PNC)</span>
                , building reliable software from architecture to interface.
              </p>
            </RevealBlock>

          </div>

          {/* Right Column: layered portrait card */}
          <div className="lg:col-span-5">
            <div className="group relative h-full min-h-[380px] sm:min-h-[480px]">
              {/* Soft brand glow behind the card */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-8 rounded-[48px] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-brand-500)_30%,transparent),transparent)] opacity-60 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
              />
              {/* Tilted accent card peeking out behind the photo for depth */}
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 rotate-[3deg] rounded-[28px] border border-brand-400/30 bg-gradient-to-br from-brand-500/15 to-brand-accent/5 transition-[rotate,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-5 group-hover:translate-y-4 group-hover:rotate-[5deg]"
              />

              <TiltCard
                enabled={motionProfile.enable3DTilt}
                maxTiltDeg={4}
                className="gradient-border h-full rounded-[28px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)]"
              >
                <div className="force-dark relative h-full min-h-[380px] overflow-hidden rounded-[27px] bg-surface-2 sm:min-h-[480px]">
                  {!imgError ? (
                    <ImageReveal className="absolute inset-0">
                      <Parallax offset={24} className="absolute inset-x-0 -inset-y-[14%]">
                        <img
                          src={PROFILE.workspaceImage}
                          alt="Portrait of Tha Darinhil"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={() => setImgError(true)}
                          className="h-full w-full object-cover object-[50%_35%] transition-[scale,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] [translate:calc(var(--tilt-x,0)*-10px)_calc(var(--tilt-y,0)*-10px)]"
                        />
                      </Parallax>
                    </ImageReveal>
                  ) : (
                    <div className="flex h-full min-h-[380px] flex-col items-center justify-center gap-3 bg-gradient-to-br from-surface-2 via-[#111827] to-canvas p-8 text-center">
                      <Code2 className="h-10 w-10 text-brand-500" aria-hidden="true" />
                      <p className="font-display text-lg font-semibold text-white">{PROFILE.name}</p>
                    </div>
                  )}
                  {/* Light vignette (keeps the photo crisp, no muddy fade) */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.35))]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[27px] ring-1 ring-inset ring-white/[0.08]"
                  />
                </div>
              </TiltCard>
            </div>
          </div>
        </div>

        {/* Fact strip: one surface split by hairlines */}
        <Stagger
          stagger={0.08}
          className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4"
        >
          {ABOUT_FACTS.map((fact) => {
            const Icon = FACT_ICONS[fact.label];
            return (
              <StaggerItem
                key={fact.label}
                className="spotlight group bg-surface p-6 transition-colors duration-300 hover:bg-surface-2"
              >
                <div className="flex items-center gap-3 text-[13px] text-slate-500">
                  <IconTile size="sm" className="text-brand-300 group-hover:text-white">
                    <Icon strokeWidth={1.75} />
                  </IconTile>
                  {fact.label}
                </div>
                <div className="mt-5 font-display text-[17px] font-semibold leading-snug tracking-[-0.02em] text-white">
                  {fact.value}
                </div>
                <div className="mt-1.5 text-[13px] text-slate-500">{fact.detail}</div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
