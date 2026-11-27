import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  ABOUT_CONTENT,
  CERTIFICATIONS_LIST,
  EDUCATION_LIST,
  EXPERIENCE_LIST,
  HOBBIES_LIST,
  INTERNSHIP_STATUS,
  ORBITAL_SKILLS,
  PORTFOLIO_PROFILE,
  PROJECTS_LIST,
} from '../data/portfolioData.js';
import { apiFetch } from '../utils/api.js';

const DEFAULT_ABOUT = {
  ...ABOUT_CONTENT,
  tagline: 'A Journey of Learning, Creating and Growing',
};

function sanitizeClientUrl(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return '';
}

const PortfolioDataContext = createContext({
  profile: PORTFOLIO_PROFILE,
  about: DEFAULT_ABOUT,
  projects: PROJECTS_LIST,
  skills: ORBITAL_SKILLS,
  education: EDUCATION_LIST,
  experience: EXPERIENCE_LIST,
  certifications: CERTIFICATIONS_LIST,
  internshipStatus: INTERNSHIP_STATUS,
  hobbies: HOBBIES_LIST,
  rawOverrides: {},
  adminToken: '',
  setAdminToken: () => {},
  refreshPortfolio: async () => {},
});

export function PortfolioDataProvider({ children }) {
  const [overrides, setOverrides] = useState({});
  // Admin session Bearer token kept strictly in JS memory (never localStorage/sessionStorage)
  const [adminToken, setAdminToken] = useState('');

  const refreshPortfolio = useCallback(async () => {
    try {
      const data = await apiFetch('/api/portfolio');
      if (data?.content && typeof data.content === 'object') {
        setOverrides(data.content);
      }
    } catch {
      // Gracefully fall back to static defaults when offline or static-only
    }
  }, []);

  useEffect(() => {
    refreshPortfolio();
  }, [refreshPortfolio]);

  const rawProfile = {
    ...PORTFOLIO_PROFILE,
    ...(overrides.profile && typeof overrides.profile === 'object' ? overrides.profile : {}),
  };

  if (!rawProfile.fullName) rawProfile.fullName = PORTFOLIO_PROFILE.fullName;
  if (!rawProfile.email) rawProfile.email = PORTFOLIO_PROFILE.email;
  const cleanPhoneDigits = String(rawProfile.phone || '').replace(/[^+\d]/g, '');

  const profile = {
    ...rawProfile,
    phoneHref: cleanPhoneDigits ? `tel:${cleanPhoneDigits}` : PORTFOLIO_PROFILE.phoneHref,
    whatsappUrl: sanitizeClientUrl(rawProfile.whatsappUrl) || PORTFOLIO_PROFILE.whatsappUrl,
    githubUrl: sanitizeClientUrl(rawProfile.githubUrl) || PORTFOLIO_PROFILE.githubUrl,
    linkedinUrl: sanitizeClientUrl(rawProfile.linkedinUrl) || PORTFOLIO_PROFILE.linkedinUrl,
    profileImagePrimary:
      sanitizeClientUrl(rawProfile.profileImagePrimary) || PORTFOLIO_PROFILE.profileImagePrimary,
    resumePdfUrl: sanitizeClientUrl(rawProfile.resumePdfUrl) || PORTFOLIO_PROFILE.resumePdfUrl,
  };

  const about = {
    ...DEFAULT_ABOUT,
    ...(overrides.about && typeof overrides.about === 'object' ? overrides.about : {}),
  };

  const internshipStatus = {
    ...INTERNSHIP_STATUS,
    ...(overrides.internshipStatus && typeof overrides.internshipStatus === 'object'
      ? overrides.internshipStatus
      : {}),
  };

  const projects = (Array.isArray(overrides.projects) ? overrides.projects : PROJECTS_LIST).map(
    (proj, index) => ({
      ...proj,
      number: proj.number || String(index + 1).padStart(2, '0'),
      image: sanitizeClientUrl(proj.image) || '/assets/images/project-fullstack.jpg',
      githubUrl: sanitizeClientUrl(proj.githubUrl),
      liveUrl: sanitizeClientUrl(proj.liveUrl),
    })
  );

  const skills = Array.isArray(overrides.skills) ? overrides.skills : ORBITAL_SKILLS;
  const education = Array.isArray(overrides.education) ? overrides.education : EDUCATION_LIST;

  const experience = (
    Array.isArray(overrides.experience) ? overrides.experience : EXPERIENCE_LIST
  ).map((exp) => ({
    ...exp,
    certificateUrl: sanitizeClientUrl(exp.certificateUrl),
  }));

  const certifications = (
    Array.isArray(overrides.certifications) ? overrides.certifications : CERTIFICATIONS_LIST
  ).map((cert) => ({
    ...cert,
    pdfUrl: sanitizeClientUrl(cert.pdfUrl),
  }));

  return (
    <PortfolioDataContext.Provider
      value={{
        profile,
        about,
        projects,
        skills,
        education,
        experience,
        certifications,
        internshipStatus,
        hobbies: HOBBIES_LIST,
        rawOverrides: overrides,
        adminToken,
        setAdminToken,
        refreshPortfolio,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  return useContext(PortfolioDataContext);
}
