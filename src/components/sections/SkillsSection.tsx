import { useEffect, useId, useMemo, useState, type CSSProperties } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Code2, Database, LayoutGrid, Network, Server, Wrench } from 'lucide-react';
import { PROFILE, SKILLS } from '../../data/portfolioData';
import { MOTION_EASINGS, type ResponsiveMotionProfile } from '../../lib/motionConfig';
import {
  filterSkillsByCategory,
  type SkillCategory,
  type SkillItem,
} from '../../lib/portfolioUtils';
import { brandColorForMode, getBrandIcon } from '../../lib/techIcons';
import { REVEAL_VIEWPORT, StaggerItem } from '../motion/Reveal';
import { SectionHeader } from '../motion/SectionHeader';
import { IconTile } from '../ui/IconTile';
import { SectionBadge3D } from '../ui/SectionBadge3D';
import { TechIcon } from '../ui/TechIcon';

function brandColor(skillId: string): string {
  const brand = getBrandIcon(skillId);
  return brand ? brandColorForMode(brand.hex) : 'var(--color-brand-400)';
}

interface SkillsSectionProps {
  motionProfile: ResponsiveMotionProfile;
}

type SkillGroup = SkillItem['category'];

const CATEGORY_TABS: { id: SkillCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database' },
  { id: 'tools', label: 'Tools' },
];

const CATEGORY_META: Record<SkillGroup, { label: string; icon: typeof Code2 }> = {
  frontend: { label: 'Frontend', icon: LayoutGrid },
  backend: { label: 'Backend', icon: Server },
  database: { label: 'Database', icon: Database },
  tools: { label: 'Tools', icon: Wrench },
};

interface SkillPanelProps {
  group: SkillGroup;
  skills: SkillItem[];
  wide?: boolean;
  className?: string;
}

// Springy "pop" easing for the logo tile (slight overshoot)
const POP = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]';

function SkillPanel({ group, skills, wide = false, className = '' }: SkillPanelProps) {
  const meta = CATEGORY_META[group];
  const GroupIcon = meta.icon;
  const reduce = useReducedMotion();
  const hoverPillId = useId();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className={`group/panel surface spotlight flex flex-col rounded-[22px] border border-white/[0.08] transition-[border-color] duration-500 hover:border-white/[0.14] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <IconTile
            size="md"
            tone="accent"
            className={`transition-[rotate,scale] duration-500 ${POP} group-hover/panel:-rotate-6 group-hover/panel:scale-110`}
          >
            <GroupIcon strokeWidth={1.75} />
          </IconTile>
          <h3 className="font-display text-base font-semibold tracking-tight text-white">{meta.label}</h3>
        </div>
        <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-xs text-slate-500 tabular-nums transition-colors duration-300 group-hover/panel:bg-brand-500/15 group-hover/panel:text-brand-300">
          {skills.length}
        </span>
      </div>

      <ul
        onMouseLeave={() => setHoveredId(null)}
        className={`grid grid-cols-2 gap-x-4 px-5 pb-3 sm:px-6 ${wide ? 'lg:grid-cols-3 sm:gap-x-10' : 'sm:gap-x-10 lg:grid-cols-1'}`}
      >
        {skills.map((skill) => {
          const hovered = hoveredId === skill.id;
          return (
            <li
              key={skill.id}
              onMouseEnter={() => setHoveredId(skill.id)}
              style={{ '--brand': brandColor(skill.id) } as CSSProperties}
              title={skill.summary}
              className="group/skill relative flex min-w-0 items-center gap-2.5 border-t border-white/[0.06] py-3 sm:gap-3.5"
            >
              {/* Highlight that glides between rows (shared layout animation) */}
              {hovered && (
                <motion.span
                  layoutId={`skill-hover-${hoverPillId}`}
                  aria-hidden="true"
                  transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                  className="pointer-events-none absolute -inset-x-3 inset-y-1 rounded-xl bg-[color-mix(in_srgb,var(--brand)_7%,transparent)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--brand)_22%,transparent)]"
                >
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[var(--brand)] shadow-[0_0_10px_var(--brand)]" />
                </motion.span>
              )}

              <span
                aria-hidden="true"
                className={`relative flex h-8 w-8 shrink-0 sm:h-9 sm:w-9 items-center justify-center rounded-[10px] bg-white/[0.04] ring-1 ring-inset ring-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[scale,rotate,background-color,box-shadow] duration-500 ${POP} group-hover/skill:scale-115 group-hover/skill:-rotate-8 group-hover/skill:bg-[color-mix(in_srgb,var(--brand)_16%,transparent)] group-hover/skill:ring-[color-mix(in_srgb,var(--brand)_45%,transparent)] group-hover/skill:shadow-[0_8px_22px_-6px_color-mix(in_srgb,var(--brand)_70%,transparent)]`}
              >
                <TechIcon name={skill.id} colored className="h-[18px] w-[18px]" />
              </span>
              <div className="relative min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="truncate text-sm font-medium text-slate-100 transition-[translate,color] duration-300 group-hover/skill:translate-x-1 group-hover/skill:text-white sm:text-[15px]">
                    {skill.name}
                  </span>
                  <span className="hidden text-xs text-slate-500 transition-colors duration-300 group-hover/skill:text-brand-300 sm:inline">
                    {skill.role}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SkillsSection({ motionProfile }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'constellation'>('grid');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(SKILLS[4]);

  const reduced = motionProfile.tier === 'reduced';

  const filteredSkills = useMemo(
    () => filterSkillsByCategory(SKILLS, activeCategory),
    [activeCategory]
  );

  const skillsByGroup = useMemo(() => {
    const groups: Record<SkillGroup, SkillItem[]> = { frontend: [], backend: [], database: [], tools: [] };
    for (const skill of SKILLS) groups[skill.category].push(skill);
    return groups;
  }, []);

  useEffect(() => {
    if (!filteredSkills.some((s) => s.id === selectedSkill.id) && filteredSkills[0]) {
      setSelectedSkill(filteredSkills[0]);
    }
  }, [filteredSkills, selectedSkill.id]);

  const constellationNodes = useMemo(() => {
    const count = filteredSkills.length;
    return filteredSkills.map((skill, idx) => {
      const cols = Math.min(6, Math.max(3, Math.ceil(Math.sqrt(count * 1.6))));
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const totalRows = Math.ceil(count / cols);
      const x = 90 + (col / Math.max(1, cols - 1)) * 540 + (row % 2 === 0 ? 0 : 18);
      const y = 65 + (row / Math.max(1, totalRows - 1 || 1)) * 230;
      return { skill, x: Math.min(640, x), y };
    });
  }, [filteredSkills]);

  const panelTransition = {
    duration: reduced ? 0 : 0.5,
    ease: MOTION_EASINGS.appleEase,
  };

  return (
    <section id="skills" className="relative py-20 sm:py-24 lg:py-32">
      <div aria-hidden="true" className="section-rule" />
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionHeader
              kicker="03. Technical Expertise"
              badge={<SectionBadge3D src={PROFILE.skillsIllustration} width={640} height={589} reducedMotion={reduced} />}
              title="Tools across the full stack."
              accent="full stack."
              reducedMotion={reduced}
              titleClassName="max-w-xl"
            />
          </div>

          {/* Interactive View Switcher (Overview vs Constellation) */}
          <div className="flex items-center gap-0.5 self-start lg:self-auto rounded-full border border-white/[0.08] bg-white/[0.02] p-1">
            {(
              [
                { id: 'grid', label: 'Overview', icon: LayoutGrid },
                { id: 'constellation', label: 'Constellation', icon: Network },
              ] as const
            ).map((mode) => {
              const active = viewMode === mode.id;
              const ModeIcon = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setViewMode(mode.id)}
                  aria-pressed={active}
                  className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                    active ? 'text-canvas' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="skills-view-pill"
                      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-white"
                    />
                  )}
                  <ModeIcon className="relative h-3.5 w-3.5" aria-hidden="true" />
                  <span className="relative">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-12 flex flex-wrap items-center gap-3 border-b border-white/[0.07] pb-4">
          <div role="tablist" aria-label="Filter technologies by category" className="flex flex-wrap items-center gap-1">
            {CATEGORY_TABS.map((tab) => {
              const active = activeCategory === tab.id;
              const count = tab.id === 'all' ? SKILLS.length : skillsByGroup[tab.id].length;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-brand-500 ${
                    active ? 'text-white' : 'text-slate-500 hover:text-slate-200'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="skills-active-tab"
                      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-white/[0.07] ring-1 ring-inset ring-white/10"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                  <span className="relative z-10 text-[11px] text-slate-500 tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="mt-8">
            <AnimatePresence mode="wait" initial={false}>
              {activeCategory === 'all' ? (
                /* Bento overview: three balanced columns */
                <motion.div
                  key="all"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ ...REVEAL_VIEWPORT, amount: 0.1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, transition: panelTransition }}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : 0.12 } } }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  <StaggerItem>
                    <SkillPanel group="frontend" skills={skillsByGroup.frontend} className="h-full" />
                  </StaggerItem>
                  <StaggerItem className="flex flex-col gap-4">
                    <SkillPanel group="backend" skills={skillsByGroup.backend} />
                    <SkillPanel group="database" skills={skillsByGroup.database} className="flex-1" />
                  </StaggerItem>
                  <StaggerItem className="md:col-span-2 lg:col-span-1">
                    <SkillPanel group="tools" skills={skillsByGroup.tools} className="h-full" />
                  </StaggerItem>
                </motion.div>
              ) : (
                <motion.div
                  key={activeCategory}
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={panelTransition}
                >
                  <SkillPanel group={activeCategory} skills={filteredSkills} wide />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Interactive Technology Constellation View */
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="surface lg:col-span-8 rounded-[22px] border border-white/[0.08] p-4 sm:p-6 overflow-hidden">
              <svg
                viewBox="0 0 720 360"
                role="img"
                aria-label="Interactive technology constellation map"
                className="w-full h-auto"
              >
                {constellationNodes.map((nodeA, i) =>
                  constellationNodes.slice(i + 1).map((nodeB) => {
                    if (nodeA.skill.category !== nodeB.skill.category) return null;
                    const highlighted =
                      selectedSkill.id === nodeA.skill.id ||
                      selectedSkill.id === nodeB.skill.id;
                    return (
                      <line
                        key={`${nodeA.skill.id}-${nodeB.skill.id}`}
                        x1={nodeA.x}
                        y1={nodeA.y}
                        x2={nodeB.x}
                        y2={nodeB.y}
                        style={{ stroke: highlighted ? 'var(--color-brand-500)' : 'rgba(255,255,255,0.07)' }}
                        strokeWidth={highlighted ? 1.6 : 1}
                        strokeDasharray={highlighted ? '6 18' : undefined}
                        className={highlighted ? 'animate-signal-dash' : 'transition-colors duration-200'}
                      />
                    );
                  })
                )}

                {constellationNodes.map(({ skill, x, y }) => {
                  const isSelected = selectedSkill.id === skill.id;
                  return (
                    <g
                      key={skill.id}
                      onClick={() => setSelectedSkill(skill)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedSkill(skill);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Inspect ${skill.name}`}
                      className="cursor-pointer focus:outline-none"
                    >
                      {isSelected && <circle cx={x} cy={y} r={32} style={{ fill: 'color-mix(in srgb, var(--color-brand-500) 15%, transparent)' }} />}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 22 : 16}
                        style={{
                          fill: isSelected ? 'var(--color-brand-600)' : 'var(--color-canvas)',
                          stroke: isSelected ? 'var(--color-brand-200)' : 'rgba(255,255,255,0.2)',
                        }}
                        strokeWidth={isSelected ? 2 : 1.2}
                        className="transition-all duration-200"
                      />
                      {(() => {
                        const brand = getBrandIcon(skill.id);
                        if (!brand) return null;
                        const size = isSelected ? 18 : 14;
                        return (
                          <svg x={x - size / 2} y={y - size / 2} width={size} height={size} viewBox="0 0 24 24">
                            <path d={brand.path} style={{ fill: isSelected ? '#FFFFFF' : brandColorForMode(brand.hex) }} />
                          </svg>
                        );
                      })()}
                      <rect
                        x={x - (skill.name.length * 3.6 + 10)}
                        y={y + 21}
                        width={skill.name.length * 7.2 + 20}
                        height={18}
                        rx={9}
                        fill="var(--color-surface)"
                      />
                      <text
                        x={x}
                        y={y + 34}
                        textAnchor="middle"
                        fill={isSelected ? '#FFFFFF' : '#94A3B8'}
                        fontSize="11"
                        fontFamily="Geist Mono, monospace"
                      >
                        {skill.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="surface lg:col-span-4 rounded-[22px] border border-white/[0.08] p-6 flex flex-col justify-between">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selectedSkill.id}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: reduced ? 0 : 0.25, ease: MOTION_EASINGS.appleEase }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between text-[13px] text-slate-500">
                    <span>{CATEGORY_META[selectedSkill.category].label}</span>
                    <span>Selected Node</span>
                  </div>
                  <h3 className="font-display text-3xl font-semibold tracking-[-0.035em] text-white">
                    {selectedSkill.name}
                  </h3>
                  <p className="text-sm font-medium text-brand-400">
                    {selectedSkill.role}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300">{selectedSkill.summary}</p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 pt-5 border-t border-white/[0.07] flex flex-wrap gap-1.5">
                {filteredSkills.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedSkill(item)}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      selectedSkill.id === item.id
                        ? 'bg-white text-canvas'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
