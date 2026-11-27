import { motion } from 'motion/react';
import {
  Award,
  BookOpen,
  Briefcase,
  Camera,
  Code2,
  Download,
  ExternalLink,
  FileText,
  Music,
  ShieldCheck,
} from 'lucide-react';
import PageShell from '../components/PageShell.jsx';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';

const HOBBY_ICONS = {
  book: BookOpen,
  code: Code2,
  music: Music,
  camera: Camera,
};

export function ExperiencePage() {
  const { experience, internshipStatus } = usePortfolioData();
  return (
    <PageShell
      kicker="05 · Experience & Internship"
      title="Workshops, Exhibitions & Internship Readiness."
      subtitle="Hands-on participation in codathons, AI tools training, public project exhibitions, and current internship focus."
    >
      {/* Internship Readiness Banner */}
      <div className="editorial-frame mb-12 rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-cyan-400">
          <Briefcase className="h-4 w-4" aria-hidden="true" />
          <span>Internship Status</span>
        </div>
        <h2 className="mt-2 text-xl font-extrabold text-[#1B1B1E] dark:text-white sm:text-2xl">
          {internshipStatus.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {internshipStatus.summary}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {internshipStatus.targets.map((target) => (
            <div
              key={target}
              className="rounded-xl border border-black/10 bg-[#FAF9F6] p-3.5 text-xs font-medium text-[#1B1B1E] dark:border-white/10 dark:bg-[#121318] dark:text-zinc-200"
            >
              {target}
            </div>
          ))}
        </div>
      </div>

      {/* Workshops & Academic Exposure Timeline */}
      <div className="space-y-6">
        {experience.map((exp, idx) => (
          <motion.article
            key={exp.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="editorial-card rounded-3xl p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-[#1B1B1E] dark:text-white sm:text-xl">
                  {exp.role}
                </h3>
                <p className="mt-1 text-sm font-semibold text-violet-700 dark:text-cyan-400">
                  {exp.organization}
                </p>
              </div>
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {exp.duration}
              </span>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              {exp.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600 dark:bg-cyan-400"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {exp.certificateUrl && (
              <div className="mt-5 border-t border-black/10 pt-4 dark:border-white/10">
                <a
                  href={exp.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B1B1E] hover:text-violet-700 dark:text-white dark:hover:text-cyan-400"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  View Participation Certificate
                </a>
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </PageShell>
  );
}

export function CertificationsPage() {
  const { certifications } = usePortfolioData();
  return (
    <PageShell
      kicker="06 · Credentials"
      title="Certifications."
      subtitle="Verified credentials and uploaded certificates across software development, cloud, security, and programming."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {certifications.map((cert, idx) => (
          <motion.article
            key={cert.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="editorial-card flex flex-col justify-between rounded-3xl p-6 sm:p-7"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-violet-700 dark:text-cyan-400">
                <span className="inline-flex items-center gap-2">
                  {cert.id === 'cisco-cyber' ? (
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Award className="h-4 w-4" aria-hidden="true" />
                  )}
                  {cert.issuer}
                </span>
                <span className="font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
                  {cert.year}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-extrabold text-[#1B1B1E] dark:text-white">
                {cert.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {cert.description}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-5 border-t border-black/10 pt-4 text-xs font-semibold dark:border-white/10">
              {cert.pdfUrl ? (
                <>
                  <a
                    href={cert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#1B1B1E] hover:text-violet-700 dark:text-white dark:hover:text-cyan-400"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    View Certificate
                  </a>
                  <a
                    href={cert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-violet-700 dark:text-zinc-400 dark:hover:text-cyan-400"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    {cert.pdfUrl.toLowerCase().endsWith('.pdf') ? 'Download PDF' : 'Download File'}
                  </a>
                </>
              ) : (
                <span className="text-zinc-500 dark:text-zinc-400">
                  Certificate file can be uploaded via Admin Studio
                </span>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </PageShell>
  );
}

export function ResumePage() {
  const { profile, education, certifications, skills } = usePortfolioData();
  return (
    <PageShell
      kicker="07 · Curriculum Vitae"
      title="Resume."
      subtitle="Download my PDF resume or review my academic background, skills, and verified certifications."
    >
      <div className="editorial-frame flex flex-col items-start justify-between gap-6 rounded-[2rem] p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-xl font-extrabold text-[#1B1B1E] dark:text-white sm:text-2xl">
            {profile.fullName} — Software Developer CV
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            Includes MCA studies at Sir M. Visvesvaraya Institute of Technology, BCA degree from Seshadripuram College, Tumakuru, core technologies, and certifications.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <a
            href={profile.resumePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#1B1B1E] px-5 py-2.5 text-xs font-semibold text-[#FAF9F6] hover:bg-violet-700 dark:bg-[#F4F3EF] dark:text-[#121318] dark:hover:bg-cyan-400"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download PDF
          </a>
          <a
            href={profile.resumePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-black/20 px-5 py-2.5 text-xs font-semibold text-[#1B1B1E] hover:border-violet-600 dark:border-white/20 dark:text-white dark:hover:border-cyan-400"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Open Online
          </a>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="editorial-card rounded-3xl p-6">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-cyan-400">
            Education
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {education.slice(0, 2).map((edu) => (
              <li key={edu.id}>
                <div className="font-bold text-[#1B1B1E] dark:text-white">{edu.degree}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {edu.institution} · {edu.status}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="editorial-card rounded-3xl p-6">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-cyan-400">
            Technical Stack
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {skills.map((s) => s.name).join(' · ')}
          </p>
        </div>

        <div className="editorial-card rounded-3xl p-6">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-cyan-400">
            Certifications
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            {certifications.map((cert) => (
              <li key={cert.id} className="flex items-center justify-between gap-2">
                <span className="truncate">{cert.title.replace(' Certificate', '')}</span>
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {cert.issuer.split(' ')[0]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}

export function HobbiesPage() {
  const { hobbies } = usePortfolioData();
  return (
    <PageShell
      kicker="08 · Personal Interests"
      title="Hobbies & Interests."
      subtitle="Creative habits that fuel curiosity, focus, and balanced engineering."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {hobbies.map((hobby, idx) => {
          const IconComponent = HOBBY_ICONS[hobby.icon] || Code2;
          return (
            <motion.div
              key={hobby.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="editorial-card rounded-3xl p-6"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1B1B1E] text-[#FAF9F6] dark:bg-[#F4F3EF] dark:text-[#121318]">
                <IconComponent className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-lg font-extrabold text-[#1B1B1E] dark:text-white">
                {hobby.name}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {hobby.note}
              </p>
            </motion.div>
          );
        })}
      </div>
    </PageShell>
  );
}
