import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CornerDownLeft } from 'lucide-react';
import { HERO_FLOATING_TECH, PROFILE, PROJECTS, SKILLS } from '../../data/portfolioData';
import { ParticleField } from './ParticleField';

interface WelcomeScreenProps {
  reducedMotion: boolean;
  /** Fired as the exit transition begins, so the homepage can start its entrance */
  onExitStart: () => void;
  /** Fired once the welcome screen has fully cleared */
  onExitComplete: () => void;
}

type Tone = 'default' | 'muted' | 'accent' | 'ok';

type ScriptStep =
  | { kind: 'cmd'; text: string }
  | { kind: 'out'; text: string; tone?: Tone; pause?: number }
  | { kind: 'progress'; label: string };

interface TermLine {
  id: number;
  kind: ScriptStep['kind'];
  text: string;
  tone?: Tone;
  typed?: number;
  progress?: number;
}

// Session key so a reload in the same tab goes straight to the portfolio
export const WELCOME_SEEN_KEY = 'td-welcome-seen';

const SCRIPT: ScriptStep[] = [
  { kind: 'cmd', text: 'whoami' },
  { kind: 'out', text: PROFILE.name, tone: 'accent', pause: 60 },
  { kind: 'out', text: `${PROFILE.role} · ${PROFILE.education}`, tone: 'muted', pause: 380 },
  { kind: 'cmd', text: 'cat stack.txt' },
  { kind: 'out', text: HERO_FLOATING_TECH.map((tech) => tech.label).join('  ·  '), tone: 'default', pause: 380 },
  { kind: 'cmd', text: 'npm run portfolio' },
  { kind: 'progress', label: 'Building portfolio' },
  { kind: 'out', text: `✓ ${PROJECTS.length} projects loaded`, tone: 'ok', pause: 120 },
  { kind: 'out', text: `✓ ${SKILLS.length} technologies compiled`, tone: 'ok', pause: 120 },
  { kind: 'out', text: '✓ Ready. Welcome aboard.', tone: 'ok', pause: 200 },
];

const TONE_CLASS: Record<Tone, string> = {
  default: 'text-slate-300',
  muted: 'text-slate-500',
  accent: 'text-white font-semibold',
  ok: 'text-brand-300',
};

const EASE = [0.16, 1, 0.3, 1] as const;

/** Human-feeling keystroke rhythm: uneven, slower after spaces/punctuation, with the odd hesitation. */
function keystrokeDelay(char: string): number {
  let delay = 38 + Math.random() * 52;
  if (char === ' ') delay += 45;
  if ('./-'.includes(char)) delay += 70;
  if (Math.random() < 0.06) delay += 170;
  return delay;
}

function Prompt() {
  return (
    <span className="mr-2 select-none">
      <span className="text-brand-400">➜</span> <span className="text-slate-500">~</span>
    </span>
  );
}

function Cursor({ blink }: { blink: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-brand-400 shadow-[0_0_10px_var(--color-brand-400)] ${
        blink ? 'animate-caret-blink' : ''
      }`}
    />
  );
}

export function WelcomeScreen({ reducedMotion, onExitStart, onExitComplete }: WelcomeScreenProps) {
  const [lines, setLines] = useState<TermLine[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [scriptDone, setScriptDone] = useState(false);
  const [exitOrigin, setExitOrigin] = useState<{ x: number; y: number; r: number } | null>(null);
  const [clock, setClock] = useState(() => new Date());
  const exitingRef = useRef(false);
  const enterButtonRef = useRef<HTMLButtonElement>(null);

  // Lock page scroll underneath and start at the top of the homepage
  useEffect(() => {
    window.scrollTo(0, 0);
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Terminal script runner: types commands, then prints their output line by line
  useEffect(() => {
    if (reducedMotion) {
      setLines(
        SCRIPT.map((step, id) =>
          step.kind === 'progress'
            ? { id, kind: 'progress', text: step.label, progress: 100 }
            : { id, kind: step.kind, text: step.text, tone: step.kind === 'out' ? step.tone : undefined, typed: step.text.length }
        )
      );
      setScriptDone(true);
      return;
    }

    let cancelled = false;
    const timers = new Set<number>();
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = window.setTimeout(() => {
          timers.delete(timer);
          resolve();
        }, ms);
        timers.add(timer);
      });
    const patch = (id: number, changes: Partial<TermLine>) =>
      setLines((prev) => prev.map((line) => (line.id === id ? { ...line, ...changes } : line)));

    const run = async () => {
      await sleep(1250); // let the CRT power-on and name reveal land first
      let id = 0;
      for (const step of SCRIPT) {
        if (cancelled) return;
        const lineId = id++;
        if (step.kind === 'cmd') {
          setLines((prev) => [...prev, { id: lineId, kind: 'cmd', text: step.text, typed: 0 }]);
          setActiveId(lineId);
          await sleep(320);
          for (let i = 1; i <= step.text.length; i++) {
            await sleep(keystrokeDelay(step.text[i - 1]));
            if (cancelled) return;
            patch(lineId, { typed: i });
          }
          await sleep(260); // "press Enter"
          setActiveId(null);
        } else if (step.kind === 'out') {
          setLines((prev) => [...prev, { id: lineId, kind: 'out', text: step.text, tone: step.tone }]);
          await sleep(step.pause ?? 140);
        } else {
          setLines((prev) => [...prev, { id: lineId, kind: 'progress', text: step.label, progress: 0 }]);
          for (let p = 0; p <= 100; p += 4) {
            await sleep(18 + Math.random() * 40);
            if (cancelled) return;
            patch(lineId, { progress: p });
          }
          await sleep(180);
        }
      }
      if (!cancelled) setScriptDone(true);
    };

    void run();
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (scriptDone) enterButtonRef.current?.focus({ preventScroll: true });
  }, [scriptDone]);

  const enter = useCallback(
    (origin?: { x: number; y: number }) => {
      if (exitingRef.current) return;
      exitingRef.current = true;
      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      try {
        window.sessionStorage.setItem(WELCOME_SEEN_KEY, '1');
      } catch {
        // Storage blocked — the intro simply shows again next load
      }
      setExitOrigin({ x, y, r });
      onExitStart();
    },
    [onExitStart]
  );

  // Enter key enters the portfolio at any point (also skips the intro)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.repeat) return;
      e.preventDefault();
      const rect = enterButtonRef.current?.getBoundingClientRect();
      enter(rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [enter]);

  const exiting = exitOrigin !== null;
  const lastLine = lines[lines.length - 1];
  const nameChars = Array.from(PROFILE.name);
  const time = clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const irisTransition = { duration: reducedMotion ? 0.3 : 0.95, ease: [0.76, 0, 0.24, 1] as const, delay: reducedMotion ? 0 : 0.2 };

  return (
    <>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Welcome to ${PROFILE.name}'s portfolio`}
        className="fixed inset-0 z-[80] overflow-hidden bg-canvas text-slate-300"
        initial={false}
        animate={
          exiting
            ? reducedMotion
              ? { opacity: 0 }
              : {
                  opacity: 1,
                  clipPath: [
                    `circle(${exitOrigin.r}px at ${exitOrigin.x}px ${exitOrigin.y}px)`,
                    `circle(0px at ${exitOrigin.x}px ${exitOrigin.y}px)`,
                  ],
                }
            : { opacity: 1 }
        }
        transition={exiting ? irisTransition : { duration: 0.4 }}
        onAnimationComplete={() => {
          if (exiting) onExitComplete();
        }}
      >
        {/* ---------- Background layers (same language as the hero) ---------- */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-architectural-grid mask-radial-top opacity-70" />
          <div className="absolute left-1/2 top-[-260px] h-[600px] w-[1000px] max-w-[170vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-brand-500)_24%,transparent),transparent)]" />
          <div className="absolute bottom-[-25%] right-[-10%] h-[520px] w-[520px] rounded-full bg-brand-700/10 blur-[120px]" />
          <ParticleField animate={!reducedMotion} />
          {!reducedMotion && (
            <motion.div
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_18px_3px_color-mix(in_srgb,var(--color-brand-400)_45%,transparent)]"
              initial={{ top: '0%', opacity: 0 }}
              animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
          )}
        </div>

        {/* ---------- HUD corners ---------- */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-5 py-5 text-xs text-slate-500 sm:px-8"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: exiting ? 0 : 1, y: 0 }}
          transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.9 }}
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_var(--color-emerald-400)]" />
            System online
          </span>
          <span className="font-mono tabular-nums">{time}</span>
        </motion.div>

        {/* ---------- Content ---------- */}
        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6"
          animate={exiting && !reducedMotion ? { opacity: 0, scale: 0.94, filter: 'blur(10px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="w-full max-w-2xl">
            {/* Name reveal */}
            <div className="mb-7 text-center sm:mb-9">
              <motion.p
                className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400"
                initial={reducedMotion ? false : { opacity: 0, y: 8, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              >
                <span className="text-brand-400">{PROFILE.role}</span>
                <span aria-hidden="true" className="h-px w-5 bg-white/15" />
                <span>Portfolio</span>
              </motion.p>
              <h1
                aria-label={PROFILE.name}
                className="mt-4 font-display text-[2.75rem] font-semibold leading-none tracking-[-0.05em] text-white sm:text-[4.25rem]"
              >
                {nameChars.map((char, i) => (
                  <motion.span
                    key={`${char}-${i}`}
                    aria-hidden="true"
                    className="inline-block"
                    initial={reducedMotion ? false : { opacity: 0, y: 24, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.45 + i * 0.045, ease: EASE }}
                  >
                    {char === ' ' ? ' ' : char}
                  </motion.span>
                ))}
              </h1>
            </div>

            {/* Terminal window: CRT power-on (line -> full window) */}
            <motion.div
              className="gradient-border relative origin-center rounded-[22px] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55),0_0_60px_-20px_color-mix(in_srgb,var(--color-brand-500)_35%,transparent)]"
              initial={reducedMotion ? false : { opacity: 0, scaleX: 0.2, scaleY: 0.006 }}
              animate={{ opacity: 1, scaleX: [0.2, 1, 1], scaleY: [0.006, 0.006, 1] }}
              transition={{ duration: 0.9, delay: 0.15, times: [0, 0.45, 1], ease: EASE }}
            >
              <div className="overflow-hidden rounded-[21px] bg-surface/95 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
                <span className="font-mono text-xs text-slate-500">darinhil@portfolio: ~</span>
                <span className="font-mono text-[11px] text-slate-600">zsh</span>
              </div>

              <div
                aria-live="off"
                className="min-h-[244px] space-y-1.5 px-5 py-4 font-mono text-[12.5px] leading-relaxed sm:min-h-[268px] sm:px-6 sm:py-5 sm:text-sm"
              >
                <AnimatePresence initial={false}>
                  {lines.map((line) => (
                    <motion.div
                      key={line.id}
                      initial={reducedMotion ? false : { opacity: 0, x: -6, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="break-words"
                    >
                      {line.kind === 'cmd' && (
                        <>
                          <Prompt />
                          <span className="text-white">{line.text.slice(0, line.typed ?? line.text.length)}</span>
                          {activeId === line.id && <Cursor blink={false} />}
                        </>
                      )}
                      {line.kind === 'out' && <span className={TONE_CLASS[line.tone ?? 'default']}>{line.text}</span>}
                      {line.kind === 'progress' && (
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500">
                          <span>{line.text}</span>
                          <span className="relative h-1.5 w-24 overflow-hidden rounded-full bg-white/10 sm:w-48">
                            <span
                              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-600 to-brand-accent shadow-[0_0_10px_color-mix(in_srgb,var(--color-brand-500)_60%,transparent)]"
                              style={{ width: `${line.progress ?? 0}%` }}
                            />
                          </span>
                          <span className="tabular-nums text-white">{line.progress ?? 0}%</span>
                        </span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Idle prompt with blinking cursor between commands / at the end */}
                {activeId === null && (lines.length === 0 || lastLine?.kind !== 'cmd' || scriptDone) && (
                  <div>
                    <Prompt />
                    <Cursor blink />
                  </div>
                )}
              </div>
              </div>
            </motion.div>

            {/* Enter button */}
            <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10">
              <AnimatePresence>
                {scriptDone && (
                  <motion.div
                    className="flex w-full flex-col items-center gap-4"
                    initial={reducedMotion ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <div className="group/enter relative w-full max-w-xs sm:w-auto">
                    <span aria-hidden="true" className="welcome-enter-glow" />
                    <motion.button
                      ref={enterButtonRef}
                      type="button"
                      data-cursor="button"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        enter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
                      }}
                      whileHover={reducedMotion ? undefined : { scale: 1.03 }}
                      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                      className="welcome-enter force-dark btn-sheen group relative w-full rounded-full bg-gradient-to-r from-brand-600 to-brand-accent px-8 py-4 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_30px_-8px_color-mix(in_srgb,var(--color-brand-600)_70%,transparent)] transition-[filter,box-shadow] duration-300 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                    >
                      <span className="relative z-10 inline-flex items-center justify-center gap-3">
                        Enter My Portfolio
                        <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden="true" />
                      </span>
                    </motion.button>
                    </div>

                    <p className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
                      or press
                      <kbd className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-slate-300">
                        Enter <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
                      </kbd>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Skip while the intro is still playing */}
        {!scriptDone && !exiting && (
          <motion.button
            type="button"
            data-cursor="button"
            onClick={() => enter()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline-2 focus-visible:outline-brand-500 sm:bottom-6 sm:right-8"
          >
            Skip intro <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
          </motion.button>
        )}
      </motion.div>

      {/* Neon ring riding the edge of the closing iris */}
      {exitOrigin && !reducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed z-[81] rounded-full border-2 border-brand-400 shadow-[0_0_30px_6px_color-mix(in_srgb,var(--color-brand-500)_45%,transparent),inset_0_0_30px_color-mix(in_srgb,var(--color-brand-500)_35%,transparent)]"
          style={{ left: exitOrigin.x, top: exitOrigin.y, x: '-50%', y: '-50%' }}
          initial={{ width: exitOrigin.r * 2, height: exitOrigin.r * 2, opacity: 0 }}
          animate={{ width: 0, height: 0, opacity: [0, 1, 1, 0] }}
          transition={{ ...irisTransition, opacity: { ...irisTransition, times: [0, 0.15, 0.85, 1] } }}
        />
      )}
    </>
  );
}
