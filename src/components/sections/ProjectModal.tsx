import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  ExternalLink,
  Layers,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { PROJECTS } from '../../data/portfolioData';
import { MOTION_EASINGS } from '../../lib/motionConfig';
import type { ProjectItem } from '../../lib/portfolioUtils';
import { MagneticButton } from '../motion/MagneticButton';

interface ProjectModalProps {
  project: ProjectItem | null;
  reducedMotion: boolean;
  onClose: () => void;
  onSelectProject?: (project: ProjectItem) => void;
}

interface DemoAttendee {
  id: number;
  name: string;
  session: string;
  status: 'Confirmed';
}

interface DemoLeaveRequest {
  id: string;
  student: string;
  type: string;
  dates: string;
  status: 'Pending' | 'Approved' | 'Declined';
}

const DEMO_PRODUCTS = [
  { id: 1, name: 'Minimalist Studio Desk Lamp', category: 'Lighting', price: 68 },
  { id: 2, name: 'Mechanical Keyboard 75%', category: 'Workspace', price: 145 },
  { id: 3, name: 'Aluminum Laptop Stand', category: 'Workspace', price: 54 },
];

export function ProjectModal({
  project,
  reducedMotion,
  onClose,
  onSelectProject,
}: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'interactive'>('overview');
  const [imgError, setImgError] = useState(false);

  const [attendees, setAttendees] = useState<DemoAttendee[]>([
    { id: 1, name: 'Sokha Meas', session: 'API Architecture Keynote', status: 'Confirmed' },
    { id: 2, name: 'Dara Pich', session: 'Vue.js State Patterns', status: 'Confirmed' },
  ]);
  const [newAttendeeName, setNewAttendeeName] = useState('');
  const [selectedSession, setSelectedSession] = useState('API Architecture Keynote');
  const [eventMessage, setEventMessage] = useState('');

  const [leaveRequests, setLeaveRequests] = useState<DemoLeaveRequest[]>([
    { id: 'REQ-104', student: 'Bopha Keo', type: 'Medical Leave', dates: 'Nov 20 - Nov 21', status: 'Pending' },
    { id: 'REQ-103', student: 'Vanna Chea', type: 'Personal Leave', dates: 'Nov 18', status: 'Approved' },
  ]);
  const [leaveStudent, setLeaveStudent] = useState('');
  const [leaveType, setLeaveType] = useState('Personal Leave');

  const [cart, setCart] = useState<Record<number, number>>({ 1: 1, 2: 1 });
  const [shopCategory, setShopCategory] = useState<'All' | 'Lighting' | 'Workspace'>('All');

  useEffect(() => {
    setActiveTab('overview');
    setImgError(false);
    setEventMessage('');
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  const currentIdx = project ? PROJECTS.findIndex((p) => p.id === project.id) : -1;
  const prevProject =
    currentIdx >= 0 ? PROJECTS[(currentIdx - 1 + PROJECTS.length) % PROJECTS.length] : null;
  const nextProject =
    currentIdx >= 0 ? PROJECTS[(currentIdx + 1) % PROJECTS.length] : null;

  const handleRegisterAttendee = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newAttendeeName.trim();
    if (cleaned.length < 2) {
      setEventMessage('Enter a valid participant name.');
      return;
    }
    if (attendees.some((a) => a.name.toLowerCase() === cleaned.toLowerCase())) {
      setEventMessage('Participant is already registered.');
      return;
    }
    setAttendees((prev) => [
      { id: Date.now(), name: cleaned, session: selectedSession, status: 'Confirmed' },
      ...prev,
    ]);
    setNewAttendeeName('');
    setEventMessage('Registration confirmed.');
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = leaveStudent.trim();
    if (cleaned.length < 2) return;
    setLeaveRequests((prev) => [
      {
        id: `REQ-${105 + prev.length}`,
        student: cleaned,
        type: leaveType,
        dates: 'Nov 24 - Nov 25',
        status: 'Pending',
      },
      ...prev,
    ]);
    setLeaveStudent('');
  };

  const updateLeaveStatus = (id: string, status: DemoLeaveRequest['status']) => {
    setLeaveRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const adjustCart = (id: number, delta: number) => {
    setCart((prev) => {
      const next = (prev[id] ?? 0) + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const cartSubtotal = DEMO_PRODUCTS.reduce(
    (sum, item) => sum + (cart[item.id] ?? 0) * item.price,
    0
  );

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0 : 0.34, ease: MOTION_EASINGS.appleEase }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-4xl rounded-2xl border border-white/15 bg-[#0D1017] shadow-[0_32px_90px_rgba(0,0,0,0.75)] overflow-hidden"
          >
            {/* Top Modal Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-6 py-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-[#60A5FA]">{project.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{project.year}</span>
              </div>
              <div className="flex items-center gap-2">
                {onSelectProject && prevProject && nextProject && (
                  <div className="hidden sm:flex items-center gap-1.5 mr-2">
                    <button
                      type="button"
                      aria-label={`Previous project: ${prevProject.title}`}
                      onClick={() => onSelectProject(prevProject)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#06070A] text-slate-300 hover:text-white hover:border-white/25 transition-colors"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Next project: ${nextProject.title}`}
                      onClick={() => onSelectProject(nextProject)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#06070A] text-slate-300 hover:text-white hover:border-white/25 transition-colors"
                    >
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  aria-label="Close project preview"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#06070A] text-slate-300 hover:text-white hover:border-white/25 transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="max-h-[82vh] overflow-y-auto p-6 sm:p-8 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3
                    id="project-modal-title"
                    className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
                  >
                    {project.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-slate-400">
                    {project.stack.join(' · ')}
                  </p>
                </div>

                <div
                  role="tablist"
                  aria-label="Project modal views"
                  className="inline-flex rounded-xl border border-white/10 bg-[#06070A] p-1 self-start"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-[#2563EB] text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Overview &amp; Features
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'interactive'}
                    onClick={() => setActiveTab('interactive')}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                      activeTab === 'interactive'
                        ? 'bg-[#2563EB] text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Interactive Demo
                  </button>
                </div>
              </div>

              {activeTab === 'overview' ? (
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-[#06070A] aspect-[16/9]">
                    {!imgError ? (
                      <img
                        src={project.imageUrl}
                        alt={project.imageAlt}
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
                        <Layers className="h-8 w-8 text-[#3B82F6]" aria-hidden="true" />
                        <p className="font-display text-base font-semibold text-white">
                          {project.title}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-7 space-y-4">
                      <h4 className="font-display text-base font-semibold text-white">
                        Architecture Overview
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-300">
                        {project.architectureOverview}
                      </p>
                    </div>

                    <div className="lg:col-span-5 space-y-3 rounded-xl border border-white/[0.08] bg-[#06070A] p-5">
                      <h4 className="font-display text-sm font-semibold text-white">
                        Key Capabilities
                      </h4>
                      <ul className="space-y-2.5 text-xs leading-relaxed text-slate-300">
                        {project.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2">
                            <Check
                              className="mt-0.5 h-3.5 w-3.5 text-[#60A5FA] shrink-0"
                              aria-hidden="true"
                            />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-[#06070A] p-5 sm:p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
                    <span className="font-display text-sm font-semibold text-white">
                      Interactive Workflow Simulation — {project.title}
                    </span>
                    <span className="font-mono text-xs text-[#60A5FA]">
                      Client-Side Preview
                    </span>
                  </div>

                  {project.demoMode === 'event' && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <form onSubmit={handleRegisterAttendee} className="space-y-3">
                        <label className="block text-xs font-medium text-slate-300">
                          Participant Name
                          <input
                            type="text"
                            value={newAttendeeName}
                            onChange={(e) => setNewAttendeeName(e.target.value)}
                            placeholder="e.g. Ratha Sok"
                            className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#0D1017] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#3B82F6] focus:outline-none"
                          />
                        </label>
                        <label className="block text-xs font-medium text-slate-300">
                          Session Track
                          <select
                            value={selectedSession}
                            onChange={(e) => setSelectedSession(e.target.value)}
                            className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#0D1017] px-3 py-2 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
                          >
                            <option>API Architecture Keynote</option>
                            <option>Vue.js State Patterns</option>
                            <option>MySQL Indexing Workshop</option>
                          </select>
                        </label>
                        <button
                          type="submit"
                          className="rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white transition-colors"
                        >
                          Register Attendee
                        </button>
                        {eventMessage && (
                          <p className="text-xs text-[#60A5FA]">{eventMessage}</p>
                        )}
                      </form>

                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Registered Attendees</span>
                          <span className="font-mono tabular-nums">
                            {attendees.length} / 50 seats
                          </span>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {attendees.map((a) => (
                            <div
                              key={a.id}
                              className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-[#0D1017] px-3 py-2 text-xs"
                            >
                              <div>
                                <div className="font-medium text-white">{a.name}</div>
                                <div className="text-slate-400">{a.session}</div>
                              </div>
                              <span className="font-mono text-emerald-400">{a.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {project.demoMode === 'leave' && (
                    <div className="space-y-4">
                      <form
                        onSubmit={handleSubmitLeave}
                        className="flex flex-col sm:flex-row gap-3"
                      >
                        <input
                          type="text"
                          value={leaveStudent}
                          onChange={(e) => setLeaveStudent(e.target.value)}
                          placeholder="Student name"
                          aria-label="Student name"
                          className="flex-1 rounded-lg border border-white/15 bg-[#0D1017] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#3B82F6] focus:outline-none"
                        />
                        <select
                          value={leaveType}
                          onChange={(e) => setLeaveType(e.target.value)}
                          aria-label="Leave type"
                          className="rounded-lg border border-white/15 bg-[#0D1017] px-3 py-2 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
                        >
                          <option>Personal Leave</option>
                          <option>Medical Leave</option>
                          <option>Academic Activity</option>
                        </select>
                        <button
                          type="submit"
                          className="rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap transition-colors"
                        >
                          Submit Request
                        </button>
                      </form>

                      <div className="space-y-2">
                        {leaveRequests.map((req) => (
                          <div
                            key={req.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#0D1017] px-4 py-3 text-xs"
                          >
                            <div>
                              <span className="font-mono text-slate-400">{req.id}</span>
                              <span className="mx-2 text-slate-600">·</span>
                              <span className="font-semibold text-white">{req.student}</span>
                              <span className="mx-2 text-slate-600">·</span>
                              <span className="text-slate-300">{req.type}</span>
                              <span className="ml-2 text-slate-500">({req.dates})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-mono ${
                                  req.status === 'Approved'
                                    ? 'text-emerald-400'
                                    : req.status === 'Declined'
                                      ? 'text-rose-400'
                                      : 'text-amber-300'
                                }`}
                              >
                                {req.status}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateLeaveStatus(req.id, 'Approved')}
                                className="rounded border border-white/15 px-2 py-1 text-[11px] text-slate-200 hover:border-emerald-400/60"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => updateLeaveStatus(req.id, 'Declined')}
                                className="rounded border border-white/15 px-2 py-1 text-[11px] text-slate-200 hover:border-rose-400/60"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.demoMode === 'ecommerce' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {(['All', 'Lighting', 'Workspace'] as const).map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setShopCategory(cat)}
                              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                shopCategory === cat
                                  ? 'bg-[#2563EB] text-white'
                                  : 'bg-[#0D1017] text-slate-400 hover:text-white border border-white/10'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        <div className="font-mono text-xs text-slate-300 tabular-nums">
                          Cart Subtotal: <span className="text-white font-semibold">${cartSubtotal}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {DEMO_PRODUCTS.filter(
                          (p) => shopCategory === 'All' || p.category === shopCategory
                        ).map((item) => {
                          const qty = cart[item.id] ?? 0;
                          return (
                            <div
                              key={item.id}
                              className="rounded-lg border border-white/[0.08] bg-[#0D1017] p-4 flex flex-col justify-between gap-3"
                            >
                              <div>
                                <div className="text-[11px] font-mono text-slate-400">
                                  {item.category}
                                </div>
                                <div className="mt-1 text-sm font-semibold text-white">
                                  {item.name}
                                </div>
                                <div className="mt-1 font-mono text-xs text-[#60A5FA] tabular-nums">
                                  ${item.price}
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    aria-label={`Remove one ${item.name}`}
                                    onClick={() => adjustCart(item.id, -1)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded border border-white/15 text-slate-300 hover:text-white"
                                  >
                                    <Minus className="h-3 w-3" aria-hidden="true" />
                                  </button>
                                  <span className="w-4 text-center font-mono text-xs tabular-nums text-white">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    aria-label={`Add one ${item.name}`}
                                    onClick={() => adjustCart(item.id, 1)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded border border-white/15 text-slate-300 hover:text-white"
                                  >
                                    <Plus className="h-3 w-3" aria-hidden="true" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
                <MagneticButton
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  cursorType="link"
                  className="rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] px-4 py-2.5 text-xs font-semibold text-white"
                >
                  <Code2 className="h-4 w-4" aria-hidden="true" />
                  <span>View on GitHub</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                </MagneticButton>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab((t) => (t === 'overview' ? 'interactive' : 'overview'))
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-5 py-2.5 text-xs font-semibold text-white transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {activeTab === 'overview'
                      ? 'Launch Interactive Demo'
                      : 'Back to Architecture Overview'}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
