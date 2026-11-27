import { useState } from 'react';
import { AlertCircle, Check, CheckCircle2, Copy, Mail, MapPin, Phone, Send } from 'lucide-react';
import PageShell from '../components/PageShell.jsx';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';
import { apiFetch } from '../utils/api.js';

export default function ContactPage() {
  const { profile } = usePortfolioData();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    if (formState.name.trim().length < 2) {
      setFeedback({ type: 'error', text: 'Please enter your name (at least 2 characters).' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formState.email.trim())) {
      setFeedback({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (formState.message.trim().length < 10) {
      setFeedback({ type: 'error', text: 'Please enter a message of at least 10 characters.' });
      return;
    }

    setSubmitting(true);
    try {
      const result = await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formState),
      });
      setFeedback({
        type: 'success',
        text: result.message || 'Thank you! Your inquiry has been saved.',
      });
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.message || 'Could not submit your message. Please email nayanahg26@gmail.com directly.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell
      kicker="09 · Contact"
      title="Let’s Build Something Together."
      subtitle="Open to software development internships, full-stack collaborations, and entry-level opportunities."
    >
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Direct Contact Column */}
        <div className="editorial-card space-y-6 rounded-3xl p-6 sm:p-8 lg:col-span-5">
          <h2 className="text-xl font-extrabold text-[#1B1B1E] dark:text-white">
            Direct Channels
          </h2>

          <div className="flex items-start justify-between gap-3 border-t border-black/10 pt-5 dark:border-white/10">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-violet-700 dark:text-cyan-400" aria-hidden="true" />
              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Email</div>
                <a
                  href={`mailto:${profile.email}`}
                  className="mt-0.5 block text-sm font-semibold text-[#1B1B1E] hover:text-violet-700 dark:text-white dark:hover:text-cyan-400 break-all"
                >
                  {profile.email}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border border-black/15 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:border-violet-600 dark:border-white/15 dark:text-zinc-300"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="flex items-start gap-3 border-t border-black/10 pt-5 dark:border-white/10">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-violet-700 dark:text-cyan-400" aria-hidden="true" />
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Phone</div>
              <a
                href={profile.phoneHref}
                className="mt-0.5 block font-mono text-sm font-semibold text-[#1B1B1E] dark:text-white tabular-nums"
              >
                {profile.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t border-black/10 pt-5 dark:border-white/10">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-violet-700 dark:text-cyan-400" aria-hidden="true" />
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Location</div>
              <p className="mt-0.5 text-sm font-medium text-[#1B1B1E] dark:text-zinc-200">
                {profile.locationCurrent}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Hometown: {profile.locationHome}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 border-t border-black/10 pt-5 text-xs font-semibold dark:border-white/10">
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-black/15 px-4 py-2 text-[#1B1B1E] hover:border-violet-600 dark:border-white/15 dark:text-white"
            >
              LinkedIn
            </a>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-black/15 px-4 py-2 text-[#1B1B1E] hover:border-violet-600 dark:border-white/15 dark:text-white"
            >
              GitHub
            </a>
            <a
              href={profile.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-black/15 px-4 py-2 text-[#1B1B1E] hover:border-violet-600 dark:border-white/15 dark:text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Contact Form Connected to Express + MongoDB Backend */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="editorial-card space-y-5 rounded-3xl p-6 sm:p-8 lg:col-span-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Your Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={formState.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="mt-2 w-full rounded-xl border border-black/15 bg-[#FAF9F6] px-4 py-3 text-base text-[#1B1B1E] placeholder:text-zinc-400 focus:border-violet-600 focus:outline-none dark:border-white/15 dark:bg-[#121318] dark:text-white sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Email Address
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="mt-2 w-full rounded-xl border border-black/15 bg-[#FAF9F6] px-4 py-3 text-base text-[#1B1B1E] placeholder:text-zinc-400 focus:border-violet-600 focus:outline-none dark:border-white/15 dark:bg-[#121318] dark:text-white sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-subject" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Subject
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              value={formState.subject}
              onChange={handleChange}
              placeholder="Internship opportunity / Project collaboration"
              className="mt-2 w-full rounded-xl border border-black/15 bg-[#FAF9F6] px-4 py-3 text-base text-[#1B1B1E] placeholder:text-zinc-400 focus:border-violet-600 focus:outline-none dark:border-white/15 dark:bg-[#121318] dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              value={formState.message}
              onChange={handleChange}
              placeholder="Write your message..."
              className="mt-2 w-full rounded-xl border border-black/15 bg-[#FAF9F6] px-4 py-3 text-base text-[#1B1B1E] placeholder:text-zinc-400 focus:border-violet-600 focus:outline-none dark:border-white/15 dark:bg-[#121318] dark:text-white sm:text-sm"
            />
          </div>

          {feedback && (
            <div
              role="status"
              className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
                feedback.type === 'success'
                  ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                  : 'border-rose-500/35 bg-rose-500/10 text-rose-800 dark:text-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#1B1B1E] px-6 py-3 text-sm font-semibold text-[#FAF9F6] transition-all hover:bg-violet-700 disabled:opacity-60 dark:bg-[#F4F3EF] dark:text-[#121318] dark:hover:bg-cyan-400"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span>{submitting ? 'Sending...' : 'Send Message'}</span>
          </button>
        </form>
      </div>
    </PageShell>
  );
}
