import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Award,
  Briefcase,
  Cpu,
  Edit3,
  FolderKanban,
  Inbox,
  Lock,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import PageShell from '../components/PageShell.jsx';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';
import { apiFetch } from '../utils/api.js';

const ADMIN_TABS = [
  { id: 'projects', label: 'Projects', Icon: FolderKanban },
  { id: 'certifications', label: 'Certifications', Icon: Award },
  { id: 'overview', label: 'Overview & About', Icon: Sparkles },
  { id: 'skills', label: 'Skills', Icon: Cpu },
  { id: 'career', label: 'Education & Exp', Icon: Briefcase },
  { id: 'inbox', label: 'Inbox', Icon: Inbox },
];

const EMPTY_PROJECT = {
  id: '',
  title: '',
  category: 'Full-Stack Web App',
  description: '',
  techStackText: '',
  featuresText: '',
  image: '/assets/images/project-fullstack.jpg',
  githubUrl: '',
  liveUrl: '',
  liveLabel: '',
  featured: false,
};

const EMPTY_CERT = {
  id: '',
  title: '',
  issuer: '',
  year: String(new Date().getFullYear()),
  description: '',
  pdfUrl: '',
};

const EMPTY_SKILL = {
  id: '',
  name: '',
  category: 'frontend',
  ring: 2,
  angle: 90,
  level: 80,
  note: '',
};

const EMPTY_EDU = {
  id: '',
  degree: '',
  institution: '',
  status: 'Currently Pursuing',
  location: '',
  highlightsText: '',
};

const EMPTY_EXP = {
  id: '',
  role: '',
  organization: '',
  duration: '',
  pointsText: '',
  certificateUrl: '',
};

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const {
    profile,
    about,
    projects,
    skills,
    education,
    experience,
    certifications,
    internshipStatus,
    adminToken: token,
    setAdminToken: setToken,
    refreshPortfolio,
  } = usePortfolioData();

  const [authMode, setAuthMode] = useState('checking'); // checking | setup | login
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  const projectFormRef = useRef(null);
  const certFormRef = useRef(null);
  const skillFormRef = useRef(null);
  const eduFormRef = useRef(null);
  const expFormRef = useRef(null);

  const [activeTab, setActiveTab] = useState('projects');
  const [statusNote, setStatusNote] = useState('');
  const [errorNote, setErrorNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState('');

  // Inbox state
  const [messages, setMessages] = useState([]);

  // Project editor state
  const [editingProjectId, setEditingProjectId] = useState('');
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);

  // Certification editor state
  const [editingCertId, setEditingCertId] = useState('');
  const [certForm, setCertForm] = useState(EMPTY_CERT);

  // Skill editor state
  const [editingSkillId, setEditingSkillId] = useState('');
  const [skillForm, setSkillForm] = useState(EMPTY_SKILL);

  // Education & Experience editor state
  const [editingEduId, setEditingEduId] = useState('');
  const [eduForm, setEduForm] = useState(EMPTY_EDU);
  const [editingExpId, setEditingExpId] = useState('');
  const [expForm, setExpForm] = useState(EMPTY_EXP);
  const [internshipForm, setInternshipForm] = useState({
    heading: internshipStatus.heading || '',
    summary: internshipStatus.summary || '',
    targetsText: (internshipStatus.targets || []).join('\n'),
  });

  // Profile & About Overview form state
  const [profileForm, setProfileForm] = useState({
    fullName: profile.fullName || '',
    tagline: profile.tagline || '',
    heroHeadline: profile.heroHeadline || '',
    heroIntro: profile.heroIntro || '',
    email: profile.email || '',
    phone: profile.phone || '',
    locationCurrent: profile.locationCurrent || '',
    locationHome: profile.locationHome || '',
    githubUrl: profile.githubUrl || '',
    linkedinUrl: profile.linkedinUrl || '',
    whatsappUrl: profile.whatsappUrl || '',
    profileImagePrimary: profile.profileImagePrimary || '',
    resumePdfUrl: profile.resumePdfUrl || '',
  });

  const [aboutForm, setAboutForm] = useState({
    heading: about.heading || '',
    tagline: about.tagline || '',
    paragraphsText: (about.paragraphs || []).join('\n\n'),
    careerObjective: about.careerObjective || '',
    strengthsText: (about.strengths || []).join('\n'),
  });

  useEffect(() => {
    setProfileForm({
      fullName: profile.fullName || '',
      tagline: profile.tagline || '',
      heroHeadline: profile.heroHeadline || '',
      heroIntro: profile.heroIntro || '',
      email: profile.email || '',
      phone: profile.phone || '',
      locationCurrent: profile.locationCurrent || '',
      locationHome: profile.locationHome || '',
      githubUrl: profile.githubUrl || '',
      linkedinUrl: profile.linkedinUrl || '',
      whatsappUrl: profile.whatsappUrl || '',
      profileImagePrimary: profile.profileImagePrimary || '',
      resumePdfUrl: profile.resumePdfUrl || '',
    });
  }, [profile]);

  useEffect(() => {
    setAboutForm({
      heading: about.heading || '',
      tagline: about.tagline || '',
      paragraphsText: (about.paragraphs || []).join('\n\n'),
      careerObjective: about.careerObjective || '',
      strengthsText: (about.strengths || []).join('\n'),
    });
  }, [about]);

  useEffect(() => {
    setInternshipForm({
      heading: internshipStatus.heading || '',
      summary: internshipStatus.summary || '',
      targetsText: (internshipStatus.targets || []).join('\n'),
    });
  }, [internshipStatus]);

  useEffect(() => {
    let active = true;
    apiFetch('/api/admin/status')
      .then((data) => {
        if (!active) return;
        setAuthMode(data.configured ? 'login' : 'setup');
      })
      .catch(() => {
        if (!active) return;
        setAuthMode('login');
      });
    return () => {
      active = false;
    };
  }, []);

  const loadMessages = useCallback(async (authToken) => {
    if (!authToken) return;
    try {
      const data = await apiFetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch {
      setToken('');
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadMessages(token);
    }
  }, [token, loadMessages]);

  const clearFlash = () => {
    setStatusNote('');
    setErrorNote('');
  };

  const handleSetupPasscode = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (passcode.length < 6) {
      setAuthError('Passcode must be at least 6 characters.');
      return;
    }
    if (passcode !== confirmPasscode) {
      setAuthError('Passcodes do not match.');
      return;
    }
    setAuthBusy(true);
    try {
      const data = await apiFetch('/api/admin/setup', {
        method: 'POST',
        body: JSON.stringify({ passcode }),
      });
      setToken(data.token);
      setPasscode('');
      setConfirmPasscode('');
      setAuthMode('login');
    } catch (err) {
      setAuthError(err.message || 'Unable to configure passcode.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthBusy(true);
    try {
      const data = await apiFetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ passcode }),
      });
      setToken(data.token);
      setPasscode('');
    } catch (error) {
      setAuthError(error.message || 'Invalid passcode.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setMessages([]);
    clearFlash();
  };

  const saveSection = async (section, data, successMessage) => {
    clearFlash();
    setSaving(true);
    try {
      await apiFetch(`/api/admin/portfolio/${section}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data }),
      });
      await refreshPortfolio();
      setStatusNote(successMessage);
    } catch (err) {
      setErrorNote(err.message || `Failed to save ${section}.`);
    } finally {
      setSaving(false);
    }
  };

  const resetSection = async (section, label) => {
    clearFlash();
    setSaving(true);
    try {
      await apiFetch(`/api/admin/portfolio/reset/${section}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      await refreshPortfolio();
      setStatusNote(`${label} restored to built-in defaults.`);
    } catch (err) {
      setErrorNote(err.message || `Failed to reset ${label}.`);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file, fieldKey, onSuccess) => {
    if (!file) return;
    clearFlash();
    if (file.size > 5 * 1024 * 1024) {
      setErrorNote('File size must be 5 MB or smaller.');
      return;
    }
    setUploadingField(fieldKey);
    try {
      const base64Data = await readFileAsBase64(file);
      const data = await apiFetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          base64Data,
        }),
      });
      onSuccess(data.url);
      setStatusNote(`Uploaded ${file.name} successfully.`);
    } catch (err) {
      setErrorNote(err.message || 'Upload failed.');
    } finally {
      setUploadingField('');
    }
  };

  // --- Project Handlers ---
  const startEditProject = (proj) => {
    clearFlash();
    setEditingProjectId(proj.id);
    setProjectForm({
      id: proj.id,
      title: proj.title || '',
      category: proj.category || '',
      description: proj.description || '',
      techStackText: (proj.techStack || []).join(', '),
      featuresText: (proj.features || []).join('\n'),
      image: proj.image || '/assets/images/project-fullstack.jpg',
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      liveLabel: proj.liveLabel || '',
      featured: Boolean(proj.featured),
    });
    projectFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const item = {
      id: editingProjectId || `prj_${Date.now().toString(36)}`,
      title: projectForm.title.trim(),
      category: projectForm.category.trim() || 'Software Project',
      description: projectForm.description.trim(),
      techStack: projectForm.techStackText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      features: projectForm.featuresText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      image: projectForm.image.trim() || '/assets/images/project-fullstack.jpg',
      githubUrl: projectForm.githubUrl.trim(),
      liveUrl: projectForm.liveUrl.trim(),
      liveLabel: projectForm.liveLabel.trim(),
      featured: Boolean(projectForm.featured),
    };

    let nextList;
    if (editingProjectId) {
      nextList = projects.map((p) => (p.id === editingProjectId ? { ...p, ...item } : p));
    } else {
      nextList = [item, ...projects];
    }

    await saveSection(
      'projects',
      nextList,
      editingProjectId ? `Updated "${item.title}".` : `Added "${item.title}".`
    );
    setEditingProjectId('');
    setProjectForm(EMPTY_PROJECT);
  };

  const handleDeleteProject = async (id, title) => {
    const nextList = projects.filter((p) => p.id !== id);
    await saveSection('projects', nextList, `Removed "${title}".`);
    if (editingProjectId === id) {
      setEditingProjectId('');
      setProjectForm(EMPTY_PROJECT);
    }
  };

  // --- Certification Handlers ---
  const startEditCert = (cert) => {
    clearFlash();
    setEditingCertId(cert.id);
    setCertForm({
      id: cert.id,
      title: cert.title || '',
      issuer: cert.issuer || '',
      year: cert.year || '',
      description: cert.description || '',
      pdfUrl: cert.pdfUrl || '',
    });
    certFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleSaveCert = async (e) => {
    e.preventDefault();
    const item = {
      id: editingCertId || `cert_${Date.now().toString(36)}`,
      title: certForm.title.trim(),
      issuer: certForm.issuer.trim(),
      year: certForm.year.trim() || String(new Date().getFullYear()),
      description: certForm.description.trim(),
      pdfUrl: certForm.pdfUrl.trim(),
    };

    const nextList = editingCertId
      ? certifications.map((c) => (c.id === editingCertId ? { ...c, ...item } : c))
      : [item, ...certifications];

    await saveSection(
      'certifications',
      nextList,
      editingCertId ? `Updated certification "${item.title}".` : `Added certification "${item.title}".`
    );
    setEditingCertId('');
    setCertForm(EMPTY_CERT);
  };

  const handleDeleteCert = async (id, title) => {
    const nextList = certifications.filter((c) => c.id !== id);
    await saveSection('certifications', nextList, `Removed "${title}".`);
    if (editingCertId === id) {
      setEditingCertId('');
      setCertForm(EMPTY_CERT);
    }
  };

  // --- Skill Handlers ---
  const startEditSkill = (skill) => {
    clearFlash();
    setEditingSkillId(skill.id);
    setSkillForm({
      id: skill.id,
      name: skill.name || '',
      category: skill.category || 'frontend',
      ring: skill.ring || 2,
      angle: skill.angle ?? 90,
      level: skill.level ?? 80,
      note: skill.note || '',
    });
    skillFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    const item = {
      id: editingSkillId || `skl_${Date.now().toString(36)}`,
      name: skillForm.name.trim(),
      category: skillForm.category,
      ring: Number(skillForm.ring) || 2,
      angle: Number(skillForm.angle) || 0,
      level: Number(skillForm.level) || 75,
      note: skillForm.note.trim(),
    };

    const nextList = editingSkillId
      ? skills.map((s) => (s.id === editingSkillId ? { ...s, ...item } : s))
      : [...skills, item];

    await saveSection(
      'skills',
      nextList,
      editingSkillId ? `Updated skill "${item.name}".` : `Added skill "${item.name}".`
    );
    setEditingSkillId('');
    setSkillForm(EMPTY_SKILL);
  };

  const handleDeleteSkill = async (id, name) => {
    const nextList = skills.filter((s) => s.id !== id);
    await saveSection('skills', nextList, `Removed skill "${name}".`);
    if (editingSkillId === id) {
      setEditingSkillId('');
      setSkillForm(EMPTY_SKILL);
    }
  };

  // --- Education Handlers ---
  const startEditEdu = (edu) => {
    clearFlash();
    setEditingEduId(edu.id);
    setEduForm({
      id: edu.id,
      degree: edu.degree || '',
      institution: edu.institution || '',
      status: edu.status || '',
      location: edu.location || '',
      highlightsText: (edu.highlights || []).join('\n'),
    });
    eduFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleSaveEdu = async (e) => {
    e.preventDefault();
    const item = {
      id: editingEduId || `edu_${Date.now().toString(36)}`,
      degree: eduForm.degree.trim(),
      institution: eduForm.institution.trim(),
      status: eduForm.status.trim(),
      location: eduForm.location.trim(),
      highlights: eduForm.highlightsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const nextList = editingEduId
      ? education.map((ed) => (ed.id === editingEduId ? { ...ed, ...item } : ed))
      : [item, ...education];

    await saveSection('education', nextList, `Saved education "${item.degree}".`);
    setEditingEduId('');
    setEduForm(EMPTY_EDU);
  };

  const handleDeleteEdu = async (id) => {
    await saveSection(
      'education',
      education.filter((ed) => ed.id !== id),
      'Removed education entry.'
    );
  };

  // --- Experience Handlers ---
  const startEditExp = (exp) => {
    clearFlash();
    setEditingExpId(exp.id);
    setExpForm({
      id: exp.id,
      role: exp.role || '',
      organization: exp.organization || '',
      duration: exp.duration || '',
      pointsText: (exp.points || []).join('\n'),
      certificateUrl: exp.certificateUrl || '',
    });
    expFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleSaveExp = async (e) => {
    e.preventDefault();
    const item = {
      id: editingExpId || `exp_${Date.now().toString(36)}`,
      role: expForm.role.trim(),
      organization: expForm.organization.trim(),
      duration: expForm.duration.trim(),
      points: expForm.pointsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      certificateUrl: expForm.certificateUrl.trim(),
    };
    const nextList = editingExpId
      ? experience.map((ex) => (ex.id === editingExpId ? { ...ex, ...item } : ex))
      : [item, ...experience];

    await saveSection('experience', nextList, `Saved experience "${item.role}".`);
    setEditingExpId('');
    setExpForm(EMPTY_EXP);
  };

  const handleDeleteExp = async (id) => {
    await saveSection(
      'experience',
      experience.filter((ex) => ex.id !== id),
      'Removed experience entry.'
    );
  };

  // --- Inbox Delete ---
  const handleDeleteMessage = async (id) => {
    try {
      await apiFetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setErrorNote(error.message);
    }
  };

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-black/15 bg-[#FAF9F6] px-3.5 py-2.5 text-base text-[#1B1B1E] focus:border-violet-600 focus:outline-none dark:border-white/15 dark:bg-[#121318] dark:text-white sm:text-sm';

  return (
    <PageShell
      kicker="10 · Portfolio Studio"
      title="Content & Certificate Manager."
      subtitle="Edit any project overview, remove or add projects, upload certificates, and update portfolio copy directly."
    >
      {!token ? (
        authMode === 'setup' ? (
          <form
            onSubmit={handleSetupPasscode}
            className="editorial-card mx-auto max-w-md space-y-5 rounded-3xl p-6 sm:p-8"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1B1B1E] text-[#FAF9F6] dark:bg-[#F4F3EF] dark:text-[#121318]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1B1B1E] dark:text-white">
                Set Your Admin Passcode
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                First-time setup: create a passcode (at least 6 characters) to protect your portfolio editor, or set <code className="font-mono">ADMIN_PASSCODE</code> in <code className="font-mono">.env</code>.
              </p>
            </div>
            <div>
              <label htmlFor="admin-setup-pass" className="block text-xs font-semibold">
                Create Passcode
              </label>
              <input
                id="admin-setup-pass"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="At least 6 characters"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="admin-setup-confirm" className="block text-xs font-semibold">
                Confirm Passcode
              </label>
              <input
                id="admin-setup-confirm"
                type="password"
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                placeholder="Re-enter passcode"
                className={inputClass}
              />
            </div>
            {authError && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{authError}</p>
            )}
            <button
              type="submit"
              disabled={authBusy}
              className="min-h-[46px] w-full rounded-lg bg-[#1B1B1E] py-3 text-sm font-semibold text-[#FAF9F6] hover:bg-violet-700 disabled:opacity-60 dark:bg-[#F4F3EF] dark:text-[#121318]"
            >
              {authBusy ? 'Saving...' : 'Save Passcode & Open Studio'}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleLogin}
            className="editorial-card mx-auto max-w-md space-y-5 rounded-3xl p-6 sm:p-8"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1B1B1E] text-[#FAF9F6] dark:bg-[#F4F3EF] dark:text-[#121318]">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1B1B1E] dark:text-white">
                Admin Sign In
              </h2>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Sign in with your admin passcode to edit projects, upload certificates, and review messages.
              </p>
            </div>
            <div>
              <label htmlFor="admin-passcode" className="block text-xs font-semibold">
                Passcode
              </label>
              <input
                id="admin-passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                className={inputClass}
              />
            </div>
            {authError && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{authError}</p>
            )}
            <button
              type="submit"
              disabled={authBusy || authMode === 'checking'}
              className="min-h-[46px] w-full rounded-lg bg-[#1B1B1E] py-3 text-sm font-semibold text-[#FAF9F6] hover:bg-violet-700 disabled:opacity-60 dark:bg-[#F4F3EF] dark:text-[#121318]"
            >
              {authBusy ? 'Signing In...' : 'Unlock Studio'}
            </button>
          </form>
        )
      ) : (
        <div className="space-y-8">
          {/* Top Status + Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-h-[24px]">
              {errorNote ? (
                <p className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {errorNote}
                </p>
              ) : (
                <p className="font-mono text-xs text-violet-700 dark:text-cyan-400">
                  {statusNote || 'Authenticated — changes save to your database / local-store.json'}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-black/15 px-4 py-1.5 text-xs font-semibold dark:border-white/15"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Sign Out
            </button>
          </div>

          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
            {ADMIN_TABS.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    clearFlash();
                    setActiveTab(id);
                  }}
                  className={`inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    active
                      ? 'accent-gradient-bg text-white shadow-sm'
                      : 'border border-black/15 text-zinc-700 hover:border-violet-600 dark:border-white/15 dark:text-zinc-300 dark:hover:border-cyan-400'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{label}</span>
                  {id === 'inbox' && messages.length > 0 && (
                    <span className="rounded-full bg-black/20 px-1.5 py-0.5 font-mono text-[10px]">
                      {messages.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: PROJECTS (Edit / Delete ALL Built-in + Custom Projects) */}
          {activeTab === 'projects' && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold">
                    All Projects ({projects.length})
                  </h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProjectId('');
                        setProjectForm(EMPTY_PROJECT);
                      }}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg bg-[#1B1B1E] px-3 py-1.5 text-xs font-semibold text-[#FAF9F6] dark:bg-[#F4F3EF] dark:text-[#121318]"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      New
                    </button>
                    <button
                      type="button"
                      onClick={() => resetSection('projects', 'Projects')}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-semibold dark:border-white/15"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      Reset
                    </button>
                  </div>
                </div>

                {projects.length === 0 ? (
                  <div className="editorial-card rounded-2xl p-6 text-sm text-zinc-500">
                    No projects currently listed. Add one using the form or click Reset.
                  </div>
                ) : (
                  projects.map((proj) => (
                    <div
                      key={proj.id}
                      className={`editorial-card rounded-2xl p-4 sm:p-5 ${
                        editingProjectId === proj.id ? 'ring-2 ring-violet-500 dark:ring-cyan-400' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-mono text-[11px] uppercase tracking-wider text-violet-700 dark:text-cyan-400">
                            {proj.number} · {proj.category}
                            {proj.featured ? ' · Featured' : ''}
                          </p>
                          <h3 className="mt-1 text-base font-bold text-[#1B1B1E] dark:text-white">
                            {proj.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                            {proj.description}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => startEditProject(proj)}
                            className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-black/15 px-2.5 py-1 text-xs font-semibold hover:border-violet-600 dark:border-white/15 dark:hover:border-cyan-400"
                          >
                            <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id, proj.title)}
                            aria-label={`Delete ${proj.title}`}
                            className="inline-flex min-h-[36px] items-center justify-center rounded-lg border border-black/15 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 dark:border-white/15 dark:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form
                ref={projectFormRef}
                onSubmit={handleSaveProject}
                className="editorial-card space-y-4 rounded-3xl p-5 sm:p-6 lg:sticky lg:top-24 lg:col-span-6 lg:self-start"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold">
                    {editingProjectId ? 'Edit Project & Overview' : 'Add New Project'}
                  </h2>
                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProjectId('');
                        setProjectForm(EMPTY_PROJECT);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-rose-600"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold">Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gen-Z Exam Pro"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm((p) => ({ ...p, title: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Full-Stack Web Platform"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm((p) => ({ ...p, category: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold">
                    Project Overview / Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the project overview, purpose, and architecture..."
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm((p) => ({ ...p, description: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold">
                    Key Features (one feature per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder={'Timed examination workflow\nAutomated evaluation results'}
                    value={projectForm.featuresText}
                    onChange={(e) =>
                      setProjectForm((p) => ({ ...p, featuresText: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="React.js, Node.js, Express.js, MongoDB"
                    value={projectForm.techStackText}
                    onChange={(e) =>
                      setProjectForm((p) => ({ ...p, techStackText: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold">
                    Project Preview Image (Upload or URL)
                  </label>
                  <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      placeholder="/assets/images/project-fullstack.jpg"
                      value={projectForm.image}
                      onChange={(e) => setProjectForm((p) => ({ ...p, image: e.target.value }))}
                      className="w-full rounded-xl border border-black/15 bg-[#FAF9F6] px-3.5 py-2.5 text-base dark:border-white/15 dark:bg-[#121318] sm:text-sm"
                    />
                    <label className="inline-flex min-h-[42px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-black/15 px-3.5 py-2 text-xs font-semibold hover:border-violet-600 dark:border-white/15 dark:hover:border-cyan-400">
                      <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{uploadingField === 'projectImg' ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(e) =>
                          handleFileUpload(e.target.files?.[0], 'projectImg', (url) =>
                            setProjectForm((p) => ({ ...p, image: url }))
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold">GitHub URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm((p) => ({ ...p, githubUrl: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold">Live / Demo URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm((p) => ({ ...p, liveUrl: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm((p) => ({ ...p, featured: e.target.checked }))}
                    className="h-4 w-4 rounded accent-violet-600"
                  />
                  <span>Highlight as Featured Project</span>
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B1B1E] px-5 py-2.5 text-xs font-semibold text-[#FAF9F6] hover:bg-violet-700 disabled:opacity-60 dark:bg-[#F4F3EF] dark:text-[#121318] dark:hover:bg-cyan-400"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  <span>{editingProjectId ? 'Save Project Changes' : 'Add Project'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: CERTIFICATIONS (Upload PDF/Image + Edit/Delete) */}
          {activeTab === 'certifications' && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold">
                    All Certifications ({certifications.length})
                  </h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCertId('');
                        setCertForm(EMPTY_CERT);
                      }}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg bg-[#1B1B1E] px-3 py-1.5 text-xs font-semibold text-[#FAF9F6] dark:bg-[#F4F3EF] dark:text-[#121318]"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      New
                    </button>
                    <button
                      type="button"
                      onClick={() => resetSection('certifications', 'Certifications')}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-semibold dark:border-white/15"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      Reset
                    </button>
                  </div>
                </div>

                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className={`editorial-card rounded-2xl p-4 sm:p-5 ${
                      editingCertId === cert.id ? 'ring-2 ring-violet-500 dark:ring-cyan-400' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-wider text-violet-700 dark:text-cyan-400">
                          {cert.issuer} · {cert.year}
                        </p>
                        <h3 className="mt-1 text-base font-bold text-[#1B1B1E] dark:text-white">
                          {cert.title}
                        </h3>
                        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                          {cert.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEditCert(cert)}
                          className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-black/15 px-2.5 py-1 text-xs font-semibold hover:border-violet-600 dark:border-white/15"
                        >
                          <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCert(cert.id, cert.title)}
                          aria-label={`Delete ${cert.title}`}
                          className="inline-flex min-h-[36px] items-center justify-center rounded-lg border border-black/15 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 dark:border-white/15 dark:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form
                ref={certFormRef}
                onSubmit={handleSaveCert}
                className="editorial-card space-y-4 rounded-3xl p-5 sm:p-6 lg:sticky lg:top-24 lg:col-span-6 lg:self-start"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold">
                    {editingCertId ? 'Edit Certification' : 'Upload / Add Certification'}
                  </h2>
                  {editingCertId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCertId('');
                        setCertForm(EMPTY_CERT);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-rose-600"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold">Certificate Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack Web Development Certificate"
                    value={certForm.title}
                    onChange={(e) => setCertForm((c) => ({ ...c, title: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold">Issuer / Organization</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cisco / Infosys / Coursera"
                      value={certForm.issuer}
                      onChange={(e) => setCertForm((c) => ({ ...c, issuer: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold">Year</label>
                    <input
                      type="text"
                      placeholder="2025"
                      value={certForm.year}
                      onChange={(e) => setCertForm((c) => ({ ...c, year: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold">Summary / Overview</label>
                  <textarea
                    rows={3}
                    placeholder="Skills and topics covered by this certification..."
                    value={certForm.description}
                    onChange={(e) => setCertForm((c) => ({ ...c, description: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold">
                    Certificate File (Upload PDF or Image, or paste URL)
                  </label>
                  <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      placeholder="/uploads/... or https://..."
                      value={certForm.pdfUrl}
                      onChange={(e) => setCertForm((c) => ({ ...c, pdfUrl: e.target.value }))}
                      className="w-full rounded-xl border border-black/15 bg-[#FAF9F6] px-3.5 py-2.5 text-base dark:border-white/15 dark:bg-[#121318] sm:text-sm"
                    />
                    <label className="inline-flex min-h-[42px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700 dark:bg-cyan-500 dark:text-[#050814]">
                      <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {uploadingField === 'certFile' ? 'Uploading...' : 'Upload PDF / Image'}
                      </span>
                      <input
                        type="file"
                        accept="application/pdf,image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(e) =>
                          handleFileUpload(e.target.files?.[0], 'certFile', (url) =>
                            setCertForm((c) => ({ ...c, pdfUrl: url }))
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B1B1E] px-5 py-2.5 text-xs font-semibold text-[#FAF9F6] hover:bg-violet-700 disabled:opacity-60 dark:bg-[#F4F3EF] dark:text-[#121318] dark:hover:bg-cyan-400"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  <span>{editingCertId ? 'Save Certification Changes' : 'Save Certification'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: OVERVIEW & ABOUT */}
          {activeTab === 'overview' && (
            <div className="grid gap-8 lg:grid-cols-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveSection('profile', profileForm, 'Updated Home overview, resume, and contact profile.');
                }}
                className="editorial-card space-y-4 rounded-3xl p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold">Home Overview, Photo & Resume</h2>
                  <button
                    type="button"
                    onClick={() => resetSection('profile', 'Profile')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-violet-600"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold">Home Tagline</label>
                  <input
                    type="text"
                    value={profileForm.tagline}
                    onChange={(e) => setProfileForm((p) => ({ ...p, tagline: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold">Hero Headline</label>
                  <input
                    type="text"
                    value={profileForm.heroHeadline}
                    onChange={(e) => setProfileForm((p) => ({ ...p, heroHeadline: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold">Hero Overview / Intro</label>
                  <textarea
                    rows={4}
                    value={profileForm.heroIntro}
                    onChange={(e) => setProfileForm((p) => ({ ...p, heroIntro: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold">Profile Photograph (Upload or URL)</label>
                  <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={profileForm.profileImagePrimary}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, profileImagePrimary: e.target.value }))
                      }
                      className="w-full rounded-xl border border-black/15 bg-[#FAF9F6] px-3.5 py-2.5 text-base dark:border-white/15 dark:bg-[#121318] sm:text-sm"
                    />
                    <label className="inline-flex min-h-[42px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-black/15 px-3.5 py-2 text-xs font-semibold dark:border-white/15">
                      <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{uploadingField === 'profileImg' ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(e) =>
                          handleFileUpload(e.target.files?.[0], 'profileImg', (url) =>
                            setProfileForm((p) => ({ ...p, profileImagePrimary: url }))
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold">Resume PDF (Upload or URL)</label>
                  <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={profileForm.resumePdfUrl}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, resumePdfUrl: e.target.value }))
                      }
                      className="w-full rounded-xl border border-black/15 bg-[#FAF9F6] px-3.5 py-2.5 text-base dark:border-white/15 dark:bg-[#121318] sm:text-sm"
                    />
                    <label className="inline-flex min-h-[42px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-black/15 px-3.5 py-2 text-xs font-semibold dark:border-white/15">
                      <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{uploadingField === 'resumePdf' ? 'Uploading...' : 'Upload PDF'}</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="sr-only"
                        onChange={(e) =>
                          handleFileUpload(e.target.files?.[0], 'resumePdf', (url) =>
                            setProfileForm((p) => ({ ...p, resumePdfUrl: url }))
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold">Contact Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold">Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold">GitHub URL</label>
                    <input
                      type="url"
                      value={profileForm.githubUrl}
                      onChange={(e) => setProfileForm((p) => ({ ...p, githubUrl: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold">LinkedIn URL</label>
                    <input
                      type="url"
                      value={profileForm.linkedinUrl}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, linkedinUrl: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold">Current Location</label>
                  <input
                    type="text"
                    value={profileForm.locationCurrent}
                    onChange={(e) =>
                      setProfileForm((p) => ({ ...p, locationCurrent: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B1B1E] px-5 py-2.5 text-xs font-semibold text-[#FAF9F6] hover:bg-violet-700 dark:bg-[#F4F3EF] dark:text-[#121318]"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  Save Overview & Resume
                </button>
              </form>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveSection(
                    'about',
                    {
                      heading: aboutForm.heading.trim(),
                      tagline: aboutForm.tagline.trim(),
                      paragraphs: aboutForm.paragraphsText
                        .split(/\n\s*\n/)
                        .map((s) => s.trim())
                        .filter(Boolean),
                      careerObjective: aboutForm.careerObjective.trim(),
                      strengths: aboutForm.strengthsText
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean),
                      stats: about.stats || [],
                    },
                    'Updated About biography & career objective.'
                  );
                }}
                className="editorial-card space-y-4 rounded-3xl p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold">About Section & Biography</h2>
                  <button
                    type="button"
                    onClick={() => resetSection('about', 'About')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-violet-600"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold">About Heading</label>
                  <input
                    type="text"
                    value={aboutForm.heading}
                    onChange={(e) => setAboutForm((a) => ({ ...a, heading: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold">About Tagline</label>
                  <input
                    type="text"
                    value={aboutForm.tagline}
                    onChange={(e) => setAboutForm((a) => ({ ...a, tagline: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold">
                    Biography Paragraphs (separate paragraphs with a blank line)
                  </label>
                  <textarea
                    rows={6}
                    value={aboutForm.paragraphsText}
                    onChange={(e) => setAboutForm((a) => ({ ...a, paragraphsText: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold">Career Objective</label>
                  <textarea
                    rows={3}
                    value={aboutForm.careerObjective}
                    onChange={(e) =>
                      setAboutForm((a) => ({ ...a, careerObjective: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold">
                    Personal Strengths (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={aboutForm.strengthsText}
                    onChange={(e) => setAboutForm((a) => ({ ...a, strengthsText: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B1B1E] px-5 py-2.5 text-xs font-semibold text-[#FAF9F6] hover:bg-violet-700 dark:bg-[#F4F3EF] dark:text-[#121318]"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  Save About Content
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === 'skills' && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="space-y-3 lg:col-span-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold">Orbital Skills ({skills.length})</h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSkillId('');
                        setSkillForm(EMPTY_SKILL);
                      }}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg bg-[#1B1B1E] px-3 py-1.5 text-xs font-semibold text-[#FAF9F6] dark:bg-[#F4F3EF] dark:text-[#121318]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      New
                    </button>
                    <button
                      type="button"
                      onClick={() => resetSection('skills', 'Skills')}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-semibold dark:border-white/15"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {skills.map((s) => (
                    <div
                      key={s.id}
                      className={`editorial-card flex items-center justify-between gap-2 rounded-2xl p-3.5 ${
                        editingSkillId === s.id ? 'ring-2 ring-violet-500 dark:ring-cyan-400' : ''
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{s.name}</p>
                        <p className="font-mono text-[10px] uppercase text-zinc-500">
                          {s.category} · Ring {s.ring}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => startEditSkill(s)}
                          className="rounded-lg border border-black/15 p-1.5 text-xs hover:border-violet-600 dark:border-white/15"
                          aria-label={`Edit ${s.name}`}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSkill(s.id, s.name)}
                          className="rounded-lg border border-black/15 p-1.5 text-xs text-rose-600 hover:bg-rose-500/10 dark:border-white/15"
                          aria-label={`Delete ${s.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form
                ref={skillFormRef}
                onSubmit={handleSaveSkill}
                className="editorial-card space-y-4 rounded-3xl p-5 sm:p-6 lg:sticky lg:top-24 lg:col-span-6 lg:self-start"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold">
                    {editingSkillId ? 'Edit Skill' : 'Add Skill to Orbit'}
                  </h2>
                  {editingSkillId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSkillId('');
                        setSkillForm(EMPTY_SKILL);
                      }}
                      className="text-xs font-semibold text-zinc-500 hover:text-rose-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold">Skill Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TypeScript, Express.js"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm((s) => ({ ...s, name: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold">Category</label>
                    <select
                      value={skillForm.category}
                      onChange={(e) => setSkillForm((s) => ({ ...s, category: e.target.value }))}
                      className={inputClass}
                    >
                      <option value="programming">Programming</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                      <option value="tools">Tools</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold">Orbit Ring (1–3)</label>
                    <select
                      value={skillForm.ring}
                      onChange={(e) => setSkillForm((s) => ({ ...s, ring: Number(e.target.value) }))}
                      className={inputClass}
                    >
                      <option value={1}>Ring 1 (Inner)</option>
                      <option value={2}>Ring 2 (Middle)</option>
                      <option value={3}>Ring 3 (Outer)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold">Angle (0–359°)</label>
                    <input
                      type="number"
                      min={0}
                      max={359}
                      value={skillForm.angle}
                      onChange={(e) => setSkillForm((s) => ({ ...s, angle: Number(e.target.value) }))}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold">Role / Description Note</label>
                  <input
                    type="text"
                    placeholder="Shown below the orbit when hovered or tapped"
                    value={skillForm.note}
                    onChange={(e) => setSkillForm((s) => ({ ...s, note: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B1B1E] px-5 py-2.5 text-xs font-semibold text-[#FAF9F6] hover:bg-violet-700 dark:bg-[#F4F3EF] dark:text-[#121318]"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  <span>{editingSkillId ? 'Save Skill Changes' : 'Add Skill'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: EDUCATION & EXPERIENCE */}
          {activeTab === 'career' && (
            <div className="space-y-10">
              {/* Education Editor */}
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="space-y-3 lg:col-span-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-extrabold">Education ({education.length})</h2>
                    <button
                      type="button"
                      onClick={() => resetSection('education', 'Education')}
                      className="inline-flex items-center gap-1 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-semibold dark:border-white/15"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset
                    </button>
                  </div>
                  {education.map((edu) => (
                    <div key={edu.id} className="editorial-card flex items-start justify-between gap-3 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-bold">{edu.degree}</p>
                        <p className="text-xs text-zinc-500">{edu.institution} · {edu.status}</p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEditEdu(edu)}
                          className="rounded-lg border border-black/15 px-2.5 py-1 text-xs font-semibold dark:border-white/15"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEdu(edu.id)}
                          className="rounded-lg border border-black/15 px-2.5 py-1 text-xs text-rose-600 dark:border-white/15"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  ref={eduFormRef}
                  onSubmit={handleSaveEdu}
                  className="editorial-card space-y-3 rounded-3xl p-5 sm:p-6 lg:col-span-6"
                >
                  <h2 className="text-lg font-extrabold">
                    {editingEduId ? 'Edit Education' : 'Add Education'}
                  </h2>
                  <input
                    type="text"
                    required
                    placeholder="Degree / Course"
                    value={eduForm.degree}
                    onChange={(e) => setEduForm((ed) => ({ ...ed, degree: e.target.value }))}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Institution"
                    value={eduForm.institution}
                    onChange={(e) => setEduForm((ed) => ({ ...ed, institution: e.target.value }))}
                    className={inputClass}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Status (e.g. Currently Pursuing)"
                      value={eduForm.status}
                      onChange={(e) => setEduForm((ed) => ({ ...ed, status: e.target.value }))}
                      className={inputClass}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={eduForm.location}
                      onChange={(e) => setEduForm((ed) => ({ ...ed, location: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Academic highlights (one per line)"
                    value={eduForm.highlightsText}
                    onChange={(e) => setEduForm((ed) => ({ ...ed, highlightsText: e.target.value }))}
                    className={inputClass}
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B1B1E] px-5 py-2 text-xs font-semibold text-[#FAF9F6] dark:bg-[#F4F3EF] dark:text-[#121318]"
                  >
                    <Save className="h-4 w-4" />
                    {editingEduId ? 'Save Education' : 'Add Education'}
                  </button>
                </form>
              </div>

              {/* Experience & Workshops Editor */}
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="space-y-3 lg:col-span-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-extrabold">Experience & Workshops ({experience.length})</h2>
                    <button
                      type="button"
                      onClick={() => resetSection('experience', 'Experience')}
                      className="inline-flex items-center gap-1 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-semibold dark:border-white/15"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset
                    </button>
                  </div>
                  {experience.map((exp) => (
                    <div key={exp.id} className="editorial-card flex items-start justify-between gap-3 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-bold">{exp.role}</p>
                        <p className="text-xs text-zinc-500">{exp.organization} · {exp.duration}</p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEditExp(exp)}
                          className="rounded-lg border border-black/15 px-2.5 py-1 text-xs font-semibold dark:border-white/15"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExp(exp.id)}
                          className="rounded-lg border border-black/15 px-2.5 py-1 text-xs text-rose-600 dark:border-white/15"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  ref={expFormRef}
                  onSubmit={handleSaveExp}
                  className="editorial-card space-y-3 rounded-3xl p-5 sm:p-6 lg:col-span-6"
                >
                  <h2 className="text-lg font-extrabold">
                    {editingExpId ? 'Edit Experience / Workshop' : 'Add Experience / Workshop'}
                  </h2>
                  <input
                    type="text"
                    required
                    placeholder="Role / Workshop Title"
                    value={expForm.role}
                    onChange={(e) => setExpForm((ex) => ({ ...ex, role: e.target.value }))}
                    className={inputClass}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Organization"
                      value={expForm.organization}
                      onChange={(e) => setExpForm((ex) => ({ ...ex, organization: e.target.value }))}
                      className={inputClass}
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. May 2025)"
                      value={expForm.duration}
                      onChange={(e) => setExpForm((ex) => ({ ...ex, duration: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Key points (one per line)"
                    value={expForm.pointsText}
                    onChange={(e) => setExpForm((ex) => ({ ...ex, pointsText: e.target.value }))}
                    className={inputClass}
                  />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      placeholder="Participation certificate PDF / URL"
                      value={expForm.certificateUrl}
                      onChange={(e) =>
                        setExpForm((ex) => ({ ...ex, certificateUrl: e.target.value }))
                      }
                      className="w-full rounded-xl border border-black/15 bg-[#FAF9F6] px-3.5 py-2.5 text-base dark:border-white/15 dark:bg-[#121318] sm:text-sm"
                    />
                    <label className="inline-flex min-h-[42px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-black/15 px-3.5 py-2 text-xs font-semibold dark:border-white/15">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingField === 'expCert' ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="application/pdf,image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(e) =>
                          handleFileUpload(e.target.files?.[0], 'expCert', (url) =>
                            setExpForm((ex) => ({ ...ex, certificateUrl: url }))
                          )
                        }
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B1B1E] px-5 py-2 text-xs font-semibold text-[#FAF9F6] dark:bg-[#F4F3EF] dark:text-[#121318]"
                  >
                    <Save className="h-4 w-4" />
                    {editingExpId ? 'Save Experience' : 'Add Experience'}
                  </button>
                </form>
              </div>

              {/* Internship Banner Editor */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveSection(
                    'internshipStatus',
                    {
                      heading: internshipForm.heading.trim(),
                      summary: internshipForm.summary.trim(),
                      targets: internshipForm.targetsText
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    },
                    'Updated Internship Readiness banner.'
                  );
                }}
                className="editorial-card space-y-4 rounded-3xl p-5 sm:p-6"
              >
                <h2 className="text-lg font-extrabold">Internship Status Banner</h2>
                <input
                  type="text"
                  value={internshipForm.heading}
                  onChange={(e) => setInternshipForm((i) => ({ ...i, heading: e.target.value }))}
                  className={inputClass}
                />
                <textarea
                  rows={2}
                  value={internshipForm.summary}
                  onChange={(e) => setInternshipForm((i) => ({ ...i, summary: e.target.value }))}
                  className={inputClass}
                />
                <textarea
                  rows={3}
                  placeholder="Target roles (one per line)"
                  value={internshipForm.targetsText}
                  onChange={(e) =>
                    setInternshipForm((i) => ({ ...i, targetsText: e.target.value }))
                  }
                  className={inputClass}
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#1B1B1E] px-5 py-2 text-xs font-semibold text-[#FAF9F6] dark:bg-[#F4F3EF] dark:text-[#121318]"
                >
                  <Save className="h-4 w-4" />
                  Save Internship Banner
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: CONTACT INBOX */}
          {activeTab === 'inbox' && (
            <div className="editorial-card rounded-3xl p-6">
              <h2 className="text-lg font-extrabold">Contact Submissions ({messages.length})</h2>
              {messages.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  No contact inquiries recorded yet.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex flex-col justify-between gap-3 rounded-2xl border border-black/10 p-4 dark:border-white/10 sm:flex-row sm:items-start"
                    >
                      <div>
                        <p className="text-sm font-bold">
                          {msg.name}{' '}
                          <span className="font-mono text-xs font-normal text-zinc-500">
                            &lt;{msg.email}&gt;
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-violet-700 dark:text-cyan-400">
                          {msg.subject}
                        </p>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                          {msg.message}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        aria-label={`Delete message from ${msg.name}`}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 text-rose-600 hover:bg-rose-500/10 dark:border-white/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
