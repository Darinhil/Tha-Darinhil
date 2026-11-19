import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Mail, MapPin, Send } from 'lucide-react';
import { PROFILE } from '../../data/portfolioData';
import type { ResponsiveMotionProfile } from '../../lib/motionConfig';
import {
  validateContactForm,
  type ContactFormValues,
} from '../../lib/portfolioUtils';
import { MagneticButton } from '../motion/MagneticButton';
import { RevealBlock } from '../motion/RevealBlock';
import { SectionHeader } from '../motion/SectionHeader';

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

  return (
    <section
      id="contact"
      className="relative border-t border-white/[0.06] py-24 lg:py-32 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 h-[380px] w-[620px] rounded-full bg-[#2563EB]/10 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Headline & Direct Links */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <SectionHeader
                kicker="06. Contact"
                title="Have an Idea? Let's Build Something Great."
                reducedMotion={reduced}
                titleClassName="lg:text-[2.75rem] leading-[1.12]"
              />
              <RevealBlock reducedMotion={reduced} delay={0.08}>
                <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-slate-400">
                  Available for full-stack developer roles, web engineering collaborations,
                  and product builds. Reach out directly or send a project inquiry.
                </p>
              </RevealBlock>
            </div>

            <RevealBlock reducedMotion={reduced} delay={0.1} className="space-y-4">
              <div className="rounded-2xl border border-white/[0.08] bg-[#0D1017] p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Mail className="h-3.5 w-3.5 text-[#60A5FA]" aria-hidden="true" />
                  <span>Direct Email</span>
                </div>
                <a
                  href={`mailto:${PROFILE.email}`}
                  data-cursor="link"
                  className="block text-sm font-medium text-white hover:text-[#60A5FA] transition-colors break-all"
                >
                  {PROFILE.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                      <span className="text-emerald-400">Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy email address</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <MagneticButton
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  cursorType="link"
                  className="rounded-xl border border-white/15 bg-[#0D1017] hover:border-white/30 px-4 py-2.5 text-xs font-semibold text-white"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                </MagneticButton>

                <MagneticButton
                  href={PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  cursorType="link"
                  className="rounded-xl border border-white/15 bg-[#0D1017] hover:border-white/30 px-4 py-2.5 text-xs font-semibold text-white"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                </MagneticButton>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                <span>{PROFILE.location}</span>
              </div>
            </RevealBlock>
          </div>

          {/* Right Column: Interactive Validated Contact Form with Focus Underline Micro-Interactions */}
          <div className="lg:col-span-7">
            <RevealBlock
              reducedMotion={reduced}
              delay={0.12}
              className="rounded-2xl border border-white/[0.09] bg-[#0D1017] p-6 sm:p-8 lg:p-10"
            >
              {status === 'success' ? (
                <div role="status" className="py-10 text-center space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                    <Check className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
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
                    className="mt-2 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-5 py-2.5 text-xs font-semibold text-white transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="relative">
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-slate-300"
                      >
                        Your Name
                      </label>
                      <div className="relative mt-2">
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
                          placeholder="Sokha Chan"
                          aria-invalid={Boolean(errors.name)}
                          className="w-full rounded-xl border border-white/12 bg-[#06070A] px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-[#3B82F6] focus:outline-none"
                        />
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-x-3 bottom-0 h-[1.5px] origin-left bg-[#3B82F6] transition-transform duration-300 ${
                            focusedField === 'name' ? 'scale-x-100' : 'scale-x-0'
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1.5 text-xs text-rose-400" role="alert">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-slate-300"
                      >
                        Email Address
                      </label>
                      <div className="relative mt-2">
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
                          className="w-full rounded-xl border border-white/12 bg-[#06070A] px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-[#3B82F6] focus:outline-none"
                        />
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-x-3 bottom-0 h-[1.5px] origin-left bg-[#3B82F6] transition-transform duration-300 ${
                            focusedField === 'email' ? 'scale-x-100' : 'scale-x-0'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-rose-400" role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="contact-topic"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Project Focus
                    </label>
                    <select
                      id="contact-topic"
                      name="topic"
                      value={form.topic}
                      onFocus={() => setFocusedField('topic')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, topic: e.target.value }))
                      }
                      className="mt-2 w-full rounded-xl border border-white/12 bg-[#06070A] px-4 py-3 text-sm text-white transition-colors focus:border-[#3B82F6] focus:outline-none"
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
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Project Details
                    </label>
                    <div className="relative mt-2">
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
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
                        className="w-full rounded-xl border border-white/12 bg-[#06070A] px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-[#3B82F6] focus:outline-none resize-none"
                      />
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-x-3 bottom-1.5 h-[1.5px] origin-left bg-[#3B82F6] transition-transform duration-300 ${
                          focusedField === 'message' ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </div>
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-rose-400" role="alert">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-500">
                      Typically replies within 24 hours.
                    </span>
                    <MagneticButton
                      type="submit"
                      disabled={status === 'submitting'}
                      cursorType="button"
                      className="rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 px-6 py-3 text-sm font-semibold text-white"
                    >
                      <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                      <Send className="h-3.5 w-3.5" aria-hidden="true" />
                    </MagneticButton>
                  </div>
                </form>
              )}
            </RevealBlock>
          </div>
        </div>
      </div>
    </section>
  );
}
