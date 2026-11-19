import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Braces,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Layers,
  LayoutGrid,
  Network,
  Server,
  Terminal,
  Wrench,
} from 'lucide-react';
import { SKILLS } from '../../data/portfolioData';
import { MOTION_EASINGS, type ResponsiveMotionProfile } from '../../lib/motionConfig';
import {
  filterSkillsByCategory,
  type SkillCategory,
  type SkillItem,
} from '../../lib/portfolioUtils';
import { SectionHeader } from '../motion/SectionHeader';
import { TiltCard } from '../motion/TiltCard';

interface SkillsSectionProps {
  motionProfile: ResponsiveMotionProfile;
}

const CATEGORY_TABS: { id: SkillCategory; label: string }[] = [
  { id: 'all', label: 'All Technologies' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database' },
  { id: 'tools', label: 'Tools' },
];

const CATEGORY_ICONS: Record<SkillItem['category'], typeof Code2> = {
  frontend: LayoutGrid,
  backend: Server,
  database: Database,
  tools: Wrench,
};

const SKILL_ICON_MAP: Record<string, typeof Code2> = {
  html5: Globe,
  css3: Layers,
  javascript: Braces,
  typescript: Code2,
  vuejs: Layers,
  reactjs: Cpu,
  tailwind: LayoutGrid,
  bootstrap: LayoutGrid,
  php: Server,
  laravel: Server,
  nodejs: Terminal,
  expressjs: Network,
  'rest-apis': Network,
  mysql: Database,
  postgresql: Database,
  sqlite: Database,
  git: GitBranch,
  github: GitBranch,
  gitlab: GitBranch,
  postman: Network,
  figma: Layers,
  docker: Cpu,
  vscode: Terminal,
};

export function SkillsSection({ motionProfile }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'constellation'>('grid');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(SKILLS[4]);
  const gridRef = useRef<HTMLDivElement>(null);

  const reduced = motionProfile.tier === 'reduced';

  const filteredSkills = useMemo(
    () => filterSkillsByCategory(SKILLS, activeCategory),
    [activeCategory]
  );

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

  return (
    <section
      id="skills"
      className="relative border-t border-white/[0.06] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            kicker="03. Technical Expertise"
            title="Tools & technologies across the full stack."
            reducedMotion={reduced}
            titleClassName="max-w-xl"
          />

          {/* Interactive View Switcher (Grid vs Constellation) */}
          <div className="flex items-center gap-2 self-start lg:self-auto rounded-xl border border-white/10 bg-[#0D1017] p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Card Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('constellation')}
              aria-pressed={viewMode === 'constellation'}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                viewMode === 'constellation'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Constellation</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter technologies by category"
          className="mt-10 flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-4"
        >
          {CATEGORY_TABS.map((tab) => {
            const active = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setActiveCategory(tab.id)}
                className={`relative rounded-lg px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6] ${
                  active
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="skills-active-tab"
                    transition={{
                      duration: reduced ? 0 : 0.28,
                      ease: MOTION_EASINGS.appleEase,
                    }}
                    className="absolute inset-0 rounded-lg bg-[#161E2E] border border-[#3B82F6]/45"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
          <span className="ml-auto hidden sm:inline-block font-mono text-xs text-slate-500 tabular-nums">
            {filteredSkills.length} technologies
          </span>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div
            ref={gridRef}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill, idx) => {
                const Icon = SKILL_ICON_MAP[skill.id] ?? CATEGORY_ICONS[skill.category];
                return (
                  <motion.div
                    key={skill.id}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, y: 18, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: reduced ? 0 : 0.35,
                      delay: reduced ? 0 : Math.min(idx * 0.025, 0.25),
                      ease: MOTION_EASINGS.appleEase,
                    }}
                  >
                    <TiltCard
                      enabled={motionProfile.enable3DTilt}
                      maxTiltDeg={5}
                      className="group h-full rounded-2xl border border-white/[0.08] bg-[#0D1017] p-5 transition-colors duration-200 hover:border-[#3B82F6]/45"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#06070A] text-[#60A5FA] transition-transform duration-200 group-hover:scale-105 group-hover:border-[#3B82F6]/40">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <span className="font-mono text-[11px] text-slate-500 capitalize">
                          {skill.category}
                        </span>
                      </div>

                      <h3 className="mt-4 font-display text-lg font-semibold text-white">
                        {skill.name}
                      </h3>
                      <p className="mt-0.5 font-mono text-xs text-[#60A5FA]">
                        {skill.role}
                      </p>
                      <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                        {skill.summary}
                      </p>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Interactive Technology Constellation View */
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 rounded-2xl border border-white/[0.08] bg-[#0D1017] p-4 sm:p-6 overflow-hidden">
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
                        stroke={highlighted ? '#3B82F6' : 'rgba(255,255,255,0.08)'}
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
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 22 : 16}
                        fill={isSelected ? '#2563EB' : '#06070A'}
                        stroke={isSelected ? '#93C5FD' : 'rgba(255,255,255,0.22)'}
                        strokeWidth={isSelected ? 2 : 1.2}
                        className="transition-all duration-200"
                      />
                      <rect
                        x={x - (skill.name.length * 3.6 + 10)}
                        y={y + 21}
                        width={skill.name.length * 7.2 + 20}
                        height={18}
                        rx={4}
                        fill="#0D1017"
                      />
                      <text
                        x={x}
                        y={y + 34}
                        textAnchor="middle"
                        fill={isSelected ? '#FFFFFF' : '#94A3B8'}
                        fontSize="11"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {skill.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-[#0D1017] p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="capitalize">{selectedSkill.category}</span>
                  <span>Selected Node</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  {selectedSkill.name}
                </h3>
                <p className="font-mono text-xs text-[#60A5FA]">
                  {selectedSkill.role}
                </p>
                <p className="text-sm leading-relaxed text-slate-300">
                  {selectedSkill.summary}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-wrap gap-2">
                {filteredSkills.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedSkill(item)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-colors ${
                      selectedSkill.id === item.id
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[#06070A] text-slate-400 hover:text-white border border-white/10'
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
