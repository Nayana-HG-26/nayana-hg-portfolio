import 'dotenv/config';
import crypto from 'crypto';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  claimAdminPasscodeOnce,
  deleteContactInquiry,
  getAdminAuthRecord,
  getPortfolioContent,
  isMongoConfigured,
  listContactInquiries,
  PortfolioSectionKey,
  resetPortfolioSection,
  saveContactInquiry,
  savePortfolioSection,
  verifyPasscodeHash,
} from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const UPLOAD_DIR = path.resolve(__dirname, 'public', 'uploads');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VALID_SKILL_CATEGORIES = new Set(['programming', 'frontend', 'backend', 'database', 'tools']);
const VALID_SECTIONS = new Set<PortfolioSectionKey>([
  'profile',
  'about',
  'projects',
  'skills',
  'education',
  'experience',
  'certifications',
  'internshipStatus',
]);

const ALLOWED_UPLOAD_MIMES: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const TOKEN_SECRET =
  process.env.ADMIN_TOKEN_SECRET?.trim() || crypto.randomBytes(32).toString('hex');

function getConfiguredEnvPasscode(): string {
  return process.env.ADMIN_PASSCODE?.trim() || '';
}

function isAllowedCorsOrigin(origin: string): boolean {
  try {
    const parsed = new URL(origin);
    if (
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === '[::1]'
    ) {
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    }
    const configured = [process.env.APP_URL, ...(process.env.ALLOWED_ORIGINS || '').split(',')]
      .map((item) => (item || '').trim())
      .filter(Boolean);
    return configured.some((allowed) => {
      try {
        return new URL(allowed).origin === parsed.origin;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

function sanitizeMultilineText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function sanitizeSafeUrl(value: unknown): string {
  const url = sanitizeText(value, 500);
  if (!url) return '';
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return '';
}

function sanitizeStringArray(value: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => sanitizeText(item, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

function verifyMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === 'application/pdf') {
    return buffer.length >= 5 && buffer.subarray(0, 5).toString('ascii') === '%PDF-';
  }
  if (mimeType === 'image/png') {
    return (
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  if (mimeType === 'image/jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === 'image/webp') {
    return (
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    );
  }
  return false;
}

function sanitizeSectionPayload(section: PortfolioSectionKey, payload: unknown): unknown {
  if (section === 'profile') {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('Invalid profile payload.');
    }
    const obj = payload as Record<string, unknown>;
    return {
      fullName: sanitizeText(obj.fullName, 80),
      tagline: sanitizeText(obj.tagline, 160),
      heroHeadline: sanitizeText(obj.heroHeadline, 200),
      heroIntro: sanitizeMultilineText(obj.heroIntro, 1200),
      locationCurrent: sanitizeText(obj.locationCurrent, 120),
      locationHome: sanitizeText(obj.locationHome, 160),
      email: sanitizeText(obj.email, 160),
      phone: sanitizeText(obj.phone, 40),
      whatsappUrl: sanitizeSafeUrl(obj.whatsappUrl),
      githubUrl: sanitizeSafeUrl(obj.githubUrl),
      linkedinUrl: sanitizeSafeUrl(obj.linkedinUrl),
      profileImagePrimary: sanitizeSafeUrl(obj.profileImagePrimary),
      resumePdfUrl: sanitizeSafeUrl(obj.resumePdfUrl),
    };
  }

  if (section === 'about') {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('Invalid about payload.');
    }
    const obj = payload as Record<string, unknown>;
    const stats = Array.isArray(obj.stats)
      ? obj.stats
          .slice(0, 6)
          .map((item) => {
            const s = (item || {}) as Record<string, unknown>;
            return {
              value: sanitizeText(s.value, 24),
              label: sanitizeText(s.label, 80),
            };
          })
          .filter((item) => item.value && item.label)
      : [];
    return {
      heading: sanitizeText(obj.heading, 120),
      tagline: sanitizeText(obj.tagline, 140),
      paragraphs: sanitizeStringArray(obj.paragraphs, 8, 1000),
      careerObjective: sanitizeMultilineText(obj.careerObjective, 1000),
      strengths: sanitizeStringArray(obj.strengths, 10, 200),
      stats,
    };
  }

  if (section === 'internshipStatus') {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('Invalid internship status payload.');
    }
    const obj = payload as Record<string, unknown>;
    return {
      heading: sanitizeText(obj.heading, 160),
      summary: sanitizeMultilineText(obj.summary, 1000),
      targets: sanitizeStringArray(obj.targets, 8, 180),
    };
  }

  if (section === 'projects') {
    if (!Array.isArray(payload)) throw new Error('Projects list must be an array.');
    return payload.slice(0, 30).map((item, idx) => {
      const p = (item || {}) as Record<string, unknown>;
      const title = sanitizeText(p.title, 140);
      const description = sanitizeMultilineText(p.description, 1500);
      if (!title) throw new Error(`Project #${idx + 1} requires a title.`);
      return {
        id: sanitizeText(p.id, 64) || `prj_${Date.now().toString(36)}_${idx}`,
        number: String(idx + 1).padStart(2, '0'),
        featured: Boolean(p.featured),
        category: sanitizeText(p.category, 80) || 'Software Project',
        title,
        image: sanitizeSafeUrl(p.image) || '/assets/images/project-fullstack.jpg',
        description,
        techStack: sanitizeStringArray(p.techStack, 14, 50),
        features: sanitizeStringArray(p.features, 12, 240),
        githubUrl: sanitizeSafeUrl(p.githubUrl),
        liveUrl: sanitizeSafeUrl(p.liveUrl),
        liveLabel: sanitizeText(p.liveLabel, 40),
      };
    });
  }

  if (section === 'certifications') {
    if (!Array.isArray(payload)) throw new Error('Certifications list must be an array.');
    return payload.slice(0, 40).map((item, idx) => {
      const c = (item || {}) as Record<string, unknown>;
      const title = sanitizeText(c.title, 140);
      if (!title) throw new Error(`Certification #${idx + 1} requires a title.`);
      return {
        id: sanitizeText(c.id, 64) || `cert_${Date.now().toString(36)}_${idx}`,
        title,
        issuer: sanitizeText(c.issuer, 120) || 'Issuer',
        year: sanitizeText(c.year, 20) || String(new Date().getFullYear()),
        description: sanitizeMultilineText(c.description, 600),
        pdfUrl: sanitizeSafeUrl(c.pdfUrl),
      };
    });
  }

  if (section === 'skills') {
    if (!Array.isArray(payload)) throw new Error('Skills list must be an array.');
    return payload.slice(0, 40).map((item, idx) => {
      const s = (item || {}) as Record<string, unknown>;
      const name = sanitizeText(s.name, 60);
      if (!name) throw new Error(`Skill #${idx + 1} requires a name.`);
      const rawCat = sanitizeText(s.category, 20).toLowerCase();
      const category = VALID_SKILL_CATEGORIES.has(rawCat) ? rawCat : 'tools';
      const ringNum = Number(s.ring);
      const ring = ringNum === 1 || ringNum === 2 || ringNum === 3 ? ringNum : ((idx % 3) + 1);
      const angleNum = Number(s.angle);
      const angle = Number.isFinite(angleNum) ? ((angleNum % 360) + 360) % 360 : (idx * 45) % 360;
      const levelNum = Number(s.level);
      const level = Number.isFinite(levelNum) ? Math.min(100, Math.max(20, Math.round(levelNum))) : 75;
      return {
        id: sanitizeText(s.id, 64) || `skl_${Date.now().toString(36)}_${idx}`,
        name,
        category,
        ring,
        angle,
        level,
        note: sanitizeText(s.note, 200),
      };
    });
  }

  if (section === 'education') {
    if (!Array.isArray(payload)) throw new Error('Education list must be an array.');
    return payload.slice(0, 15).map((item, idx) => {
      const e = (item || {}) as Record<string, unknown>;
      const degree = sanitizeText(e.degree, 160);
      if (!degree) throw new Error(`Education #${idx + 1} requires a degree title.`);
      return {
        id: sanitizeText(e.id, 64) || `edu_${Date.now().toString(36)}_${idx}`,
        degree,
        institution: sanitizeText(e.institution, 180),
        status: sanitizeText(e.status, 60),
        location: sanitizeText(e.location, 120),
        highlights: sanitizeStringArray(e.highlights, 8, 260),
      };
    });
  }

  if (section === 'experience') {
    if (!Array.isArray(payload)) throw new Error('Experience list must be an array.');
    return payload.slice(0, 25).map((item, idx) => {
      const ex = (item || {}) as Record<string, unknown>;
      const role = sanitizeText(ex.role, 160);
      if (!role) throw new Error(`Experience #${idx + 1} requires a role.`);
      return {
        id: sanitizeText(ex.id, 64) || `exp_${Date.now().toString(36)}_${idx}`,
        role,
        organization: sanitizeText(ex.organization, 180),
        duration: sanitizeText(ex.duration, 60),
        points: sanitizeStringArray(ex.points, 8, 280),
        certificateUrl: sanitizeSafeUrl(ex.certificateUrl),
      };
    });
  }

  throw new Error('Unsupported portfolio section.');
}

function signAdminToken(ttlMs = 1000 * 60 * 60 * 8): string {
  const payload = Buffer.from(
    JSON.stringify({ role: 'admin', exp: Date.now() + ttlMs })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyAdminToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as {
      role?: string;
      exp?: number;
    };
    return decoded.role === 'admin' && typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized. Please sign in as admin.' });
  }
  next();
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  app.disable('x-powered-by');
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  // Strict origin allowlist CORS for local dev / configured Netlify URL
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && isAllowedCorsOrigin(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Serve uploaded certificate PDFs and project images safely
  app.use(
    '/uploads',
    express.static(UPLOAD_DIR, {
      setHeaders: (res) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
      },
    })
  );

  // Larger JSON limit strictly for authenticated file uploads
  app.post(
    '/api/admin/upload',
    requireAdmin,
    express.json({ limit: '8mb' }),
    (req, res) => {
      try {
        if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
          return res.status(400).json({ ok: false, error: 'Invalid upload payload.' });
        }
        const body = req.body as Record<string, unknown>;
        const mimeType = sanitizeText(body.mimeType, 60).toLowerCase();
        const ext = ALLOWED_UPLOAD_MIMES[mimeType];
        if (!ext) {
          return res.status(400).json({
            ok: false,
            error: 'Unsupported file type. Please upload a PDF, PNG, JPG, or WebP file.',
          });
        }

        const rawBase64 = typeof body?.base64Data === 'string' ? body.base64Data : '';
        const cleanedBase64 = rawBase64.replace(/^data:[^;]+;base64,/, '').trim();
        if (!cleanedBase64) {
          return res.status(400).json({ ok: false, error: 'No file data provided.' });
        }

        const buffer = Buffer.from(cleanedBase64, 'base64');
        if (buffer.length === 0 || buffer.length > MAX_UPLOAD_BYTES) {
          return res.status(400).json({
            ok: false,
            error: 'File must be between 1 byte and 5 MB.',
          });
        }

        if (!verifyMagicBytes(buffer, mimeType)) {
          return res.status(400).json({
            ok: false,
            error: 'File content does not match the selected PDF or image format.',
          });
        }

        const safeFileName = `upload_${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`;
        const resolvedPath = path.resolve(UPLOAD_DIR, safeFileName);
        if (!resolvedPath.startsWith(UPLOAD_DIR + path.sep)) {
          return res.status(400).json({ ok: false, error: 'Invalid upload destination.' });
        }

        fs.writeFileSync(resolvedPath, buffer);
        return res.status(201).json({
          ok: true,
          url: `/uploads/${safeFileName}`,
          filename: safeFileName,
        });
      } catch {
        return res.status(500).json({ ok: false, error: 'Failed to save uploaded file.' });
      }
    }
  );

  app.use(express.json({ limit: '128kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      database: isMongoConfigured() ? 'mongodb' : 'local-json',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/portfolio', async (_req, res) => {
    try {
      const content = await getPortfolioContent();
      res.json({ ok: true, content });
    } catch {
      res.status(500).json({ ok: false, error: 'Failed to load portfolio content.' });
    }
  });

  app.post('/api/contact', async (req, res) => {
    try {
      const body = req.body;
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({ ok: false, error: 'Invalid request payload.' });
      }

      const name = sanitizeText((body as Record<string, unknown>).name, 100);
      const email = sanitizeText((body as Record<string, unknown>).email, 160).toLowerCase();
      const subject = sanitizeText((body as Record<string, unknown>).subject, 140) || 'Portfolio Inquiry';
      const message = sanitizeText((body as Record<string, unknown>).message, 2000);

      if (name.length < 2) {
        return res.status(400).json({ ok: false, error: 'Please enter your name (at least 2 characters).' });
      }
      if (!EMAIL_PATTERN.test(email)) {
        return res.status(400).json({ ok: false, error: 'Please provide a valid email address.' });
      }
      if (message.length < 10) {
        return res.status(400).json({ ok: false, error: 'Please enter a message of at least 10 characters.' });
      }

      const saved = await saveContactInquiry({ name, email, subject, message });

      return res.status(201).json({
        ok: true,
        id: saved.id,
        storage: saved.storage,
        createdAt: saved.createdAt,
        message: 'Thank you for reaching out. Your message has been saved.',
      });
    } catch (error) {
      console.error('Contact API error:', error instanceof Error ? error.message : 'Unknown error');
      return res.status(500).json({
        ok: false,
        error: 'Unable to submit your message right now. Please email nayanahg26@gmail.com directly.',
      });
    }
  });

  app.get('/api/admin/status', async (_req, res) => {
    try {
      const envPasscode = getConfiguredEnvPasscode();
      if (envPasscode) {
        return res.json({ ok: true, configured: true, mode: 'env' });
      }
      const record = await getAdminAuthRecord();
      if (record) {
        return res.json({ ok: true, configured: true, mode: 'db' });
      }
      return res.json({ ok: true, configured: false, mode: 'setup' });
    } catch {
      return res.status(500).json({ ok: false, error: 'Unable to check admin status.' });
    }
  });

  app.post('/api/admin/setup', async (req, res) => {
    try {
      if (getConfiguredEnvPasscode()) {
        return res.status(409).json({
          ok: false,
          error: 'Admin passcode is configured via environment variables.',
        });
      }
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ ok: false, error: 'Invalid setup payload.' });
      }
      const passcode = sanitizeText((req.body as Record<string, unknown>).passcode, 120);
      if (passcode.length < 6) {
        return res.status(400).json({
          ok: false,
          error: 'Please choose an admin passcode of at least 6 characters.',
        });
      }

      const claimed = await claimAdminPasscodeOnce(passcode);
      if (!claimed) {
        return res.status(409).json({
          ok: false,
          error: 'Admin passcode has already been set. Please sign in instead.',
        });
      }

      const token = signAdminToken();
      return res.status(201).json({
        ok: true,
        token,
        database: isMongoConfigured() ? 'mongodb' : 'local-json',
      });
    } catch {
      return res.status(500).json({ ok: false, error: 'Failed to save admin passcode.' });
    }
  });

  app.post('/api/admin/login', async (req, res) => {
    try {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ ok: false, error: 'Invalid login payload.' });
      }
      const passcode = sanitizeText((req.body as Record<string, unknown>).passcode, 120);
      if (!passcode) {
        return res.status(400).json({ ok: false, error: 'Passcode is required.' });
      }

      const envPasscode = getConfiguredEnvPasscode();
      if (envPasscode) {
        const inputBuf = Buffer.from(passcode);
        const expectedBuf = Buffer.from(envPasscode);
        if (inputBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(inputBuf, expectedBuf)) {
          return res.status(401).json({ ok: false, error: 'Invalid admin passcode.' });
        }
      } else {
        const record = await getAdminAuthRecord();
        if (!record) {
          return res.status(403).json({
            ok: false,
            error: 'Admin passcode has not been set yet. Please complete first-time setup.',
          });
        }
        if (!verifyPasscodeHash(passcode, record)) {
          return res.status(401).json({ ok: false, error: 'Invalid admin passcode.' });
        }
      }

      const token = signAdminToken();
      return res.json({
        ok: true,
        token,
        database: isMongoConfigured() ? 'mongodb' : 'local-json',
      });
    } catch {
      return res.status(500).json({ ok: false, error: 'Unable to sign in.' });
    }
  });

  app.put('/api/admin/portfolio/:section', requireAdmin, async (req, res) => {
    try {
      const rawSection = sanitizeText(req.params.section, 32) as PortfolioSectionKey;
      if (!VALID_SECTIONS.has(rawSection)) {
        return res.status(400).json({ ok: false, error: 'Invalid portfolio section.' });
      }

      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ ok: false, error: 'Invalid section payload.' });
      }
      const body = req.body as Record<string, unknown>;
      const sanitized = sanitizeSectionPayload(rawSection, body.data);
      const content = await savePortfolioSection(rawSection, sanitized);
      return res.json({ ok: true, content });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        error: error instanceof Error ? error.message : 'Invalid section payload.',
      });
    }
  });

  app.post('/api/admin/portfolio/reset/:section', requireAdmin, async (req, res) => {
    try {
      const rawSection = sanitizeText(req.params.section, 32) as PortfolioSectionKey;
      if (!VALID_SECTIONS.has(rawSection)) {
        return res.status(400).json({ ok: false, error: 'Invalid portfolio section.' });
      }
      const content = await resetPortfolioSection(rawSection);
      return res.json({ ok: true, content });
    } catch {
      return res.status(500).json({ ok: false, error: 'Failed to reset section.' });
    }
  });

  app.get('/api/admin/messages', requireAdmin, async (_req, res) => {
    try {
      const messages = await listContactInquiries();
      res.json({ ok: true, messages });
    } catch {
      res.status(500).json({ ok: false, error: 'Failed to load contact messages.' });
    }
  });

  app.delete('/api/admin/messages/:id', requireAdmin, async (req, res) => {
    try {
      const deleted = await deleteContactInquiry(sanitizeText(req.params.id, 64));
      if (!deleted) {
        return res.status(404).json({ ok: false, error: 'Message not found.' });
      }
      res.json({ ok: true });
    } catch {
      res.status(500).json({ ok: false, error: 'Failed to delete message.' });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  const port = Number(process.env.PORT) || 3000;
  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
