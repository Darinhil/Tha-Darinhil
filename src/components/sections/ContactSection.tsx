import { useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, Copy, Mail, Send } from 'lucide-react';
import { PROFILE } from '../../data/portfolioData';
import type { ResponsiveMotionProfile } from '../../lib/motionConfig';
import {
  validateContactForm,
  type ContactFormValues,
} from '../../lib/portfolioUtils';
import { MagneticButton } from '../motion/MagneticButton';
import { RevealBlock } from '../motion/RevealBlock';
import { SectionHeader } from '../motion/SectionHeader';
import { IconTile } from '../ui/IconTile';
import { SocialIcon } from '../ui/SocialIcon';

interface ContactSectionProps {
  motionProfile: ResponsiveMotionProfile;
}

const INITIAL_FORM: ContactFormValues = {
  name: '',
  email: '',
  topic: 'Full-Stack Web Development',
  message: '',
};

export function ContactSection({ motionProfile }: ContactSectionProps) {
  const [form, setForm] = useState<ContactFormValues>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [copied, setCopied] = useState(false);

  const reduced = motionProfile.tier === 'reduced';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setStatus('submitting');

    window.setTimeout(() => {
      setStatus('success');
      setForm(INITIAL_FORM);
    }, 450);
  };

  const fieldClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-white/[0.025] px-4 py-3.5 text-sm text-white placeholder:text-slate-600 transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/20 focus:bg-white/[0.04] focus:outline-none focus:ring-4 ${
      hasError
        ? 'border-rose-400/50 focus:border-rose-400 focus:ring-rose-500/10'
        : 'border-white/10 focus:border-brand-500 focus:ring-brand-500/15'
    }`;

  const labelClass = (field: string) =>
    `block text-xs font-medium transition-colors duration-300 ${
      focusedField === field ? 'text-brand-300' : 'text-slate-400'
    }`;

  return (
    <section id="contact" className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">
      <div aria-hidden="true" className="section-rule" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 left-1/2 -translate-x-1/2 h-[480px] w-[900px] max-w-[160vw] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-brand-600)_10%,transparent),transparent)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Headline & Direct Links */}
          <div className="lg:col-span-5 flex flex-col">
            <SectionHeader
              kicker="Contact"
              badge={
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-400/25 bg-brand-500/10 py-1 pl-1 pr-3.5 text-[13px] font-medium text-brand-300">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20">
                    <Mail className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  </span>
                  Get in touch
                </span>
              }
              title="Have an idea? Let's build it."
              accent="Let's build it."
              reducedMotion={reduced}
              titleClassName="lg:text-[3.4rem] leading-[1.04]"
            />
            <RevealBlock reducedMotion={reduced} delay={0.08}>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-slate-400">
                Open to full-stack roles, collaborations, and product builds.
              </p>
            </RevealBlock>

            <RevealBlock reducedMotion={reduced} delay={0.1} className="mt-10 space-y-3">
              <div className="surface spotlight group rounded-[20px] border border-white/[0.08] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-[13px] text-slate-500">
                    <IconTile size="sm" tone="accent">
                      <Mail strokeWidth={1.75} />
                    </IconTile>
                    <span>Direct Email</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-400 transition-colors hover:border-white/20 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                        <span className="text-emerald-400">Copied to clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" aria-hidden="true" />
                        <span>Copy email address</span>
                      </>
                    )}
                  </button>
                </div>
                <a
                  href={`mailto:${PROFILE.email}`}
                  data-cursor="link"
                  className="mt-3 block text-[15px] font-medium text-white transition-colors hover:text-brand-300 break-all"
                >
                  {PROFILE.email}
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MagneticButton
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  cursorType="link"
                  className="group justify-between! rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] px-4 py-3.5 text-sm font-semibold text-white"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <SocialIcon network="GitHub" className="h-[18px] w-[18px] text-slate-400 transition-colors duration-300 group-hover:text-white" />
                    GitHub
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" aria-hidden="true" />
                </MagneticButton>

                <MagneticButton
                  href={PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  cursorType="link"
                  className="group justify-between! rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] px-4 py-3.5 text-sm font-semibold text-white"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <SocialIcon network="LinkedIn" className="h-[17px] w-[17px] text-slate-400 transition-colors duration-300 group-hover:text-[#5FA8F5]" />
                    LinkedIn
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" aria-hidden="true" />
                </MagneticButton>
              </div>
            </RevealBlock>
          </div>

          {/* Right Column: Validated Contact Form */}
          <div className="lg:col-span-7">
            <RevealBlock reducedMotion={reduced} delay={0.12} className="gradient-border rounded-[26px] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
              <div className="rounded-[25px] bg-surface/95 p-6 sm:p-8 lg:p-10 backdrop-blur-xl">
                {status === 'success' ? (
                  <div role="status" className="py-12 text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_-6px_rgba(16,185,129,0.6)]">
                      <Check className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-3xl font-semibold tracking-[-0.03em] text-white">
                      Message Received
                    </h3>
                    <p className="mx-auto max-w-md text-sm text-slate-300 leading-relaxed">
                      Thank you for reaching out. Your inquiry has been recorded—you can also
                      email directly at{' '}
                      <span className="text-white font-medium">{PROFILE.email}</span>.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="mt-2 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-5 py-2.5 text-xs font-semibold text-white transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className={labelClass('name')}>
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          value={form.name}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => {
                            setForm((prev) => ({ ...prev, name: e.target.value }));
                            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                          }}
                          placeholder="Input your name"
                          aria-invalid={Boolean(errors.name)}
                          className={`mt-2 ${fieldClass(Boolean(errors.name))}`}
                        />
                        {errors.name && (
                          <p className="mt-1.5 text-xs text-rose-400" role="alert">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="contact-email" className={labelClass('email')}>
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          value={form.email}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => {
                            setForm((prev) => ({ ...prev, email: e.target.value }));
                            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                          }}
                          placeholder="you@example.com"
                          aria-invalid={Boolean(errors.email)}
                          className={`mt-2 ${fieldClass(Boolean(errors.email))}`}
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-xs text-rose-400" role="alert">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-topic" className={labelClass('topic')}>
                        Project Focus
                      </label>
                      <div className="relative mt-2">
                        <select
                          id="contact-topic"
                          name="topic"
                          value={form.topic}
                          onFocus={() => setFocusedField('topic')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
                          className={`appearance-none pr-11 [&>option]:bg-surface ${fieldClass(false)}`}
                        >
                          <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                          <option value="Frontend Engineering">Frontend Engineering</option>
                          <option value="Backend & REST API Development">
                            Backend &amp; REST API Development
                          </option>
                          <option value="Database Architecture">Database Architecture</option>
                          <option value="Full-Time / Engineering Role">
                            Full-Time / Engineering Role
                          </option>
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className={labelClass('message')}>
                        Project Details
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={form.message}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => {
                          setForm((prev) => ({ ...prev, message: e.target.value }));
                          if (errors.message) {
                            setErrors((prev) => ({ ...prev, message: undefined }));
                          }
                        }}
                        placeholder="Tell me about what you are building, your timeline, or role details..."
                        aria-invalid={Boolean(errors.message)}
                        className={`mt-2 resize-none ${fieldClass(Boolean(errors.message))}`}
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-xs text-rose-400" role="alert">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <MagneticButton
                        type="submit"
                        disabled={status === 'submitting'}
                        cursorType="button"
                        className="force-dark btn-sheen group rounded-full bg-gradient-to-r from-brand-600 to-brand-accent hover:brightness-110 disabled:opacity-60 px-7 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_30px_-8px_color-mix(in_srgb,var(--color-brand-600)_70%,transparent)]"
                      >
                        <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                        <Send
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </MagneticButton>
                    </div>
                  </form>
                )}
              </div>
            </RevealBlock>
          </div>
        </div>
      </div>
    </section>
  );
}
