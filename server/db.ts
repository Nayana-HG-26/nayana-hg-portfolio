import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_STORE_PATH = path.resolve(__dirname, 'local-store.json');

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface StoredContact extends ContactPayload {
  id: string;
  createdAt: string;
  storage: 'mongodb' | 'local-json';
}

export interface AdminAuthRecord {
  salt: string;
  hash: string;
  updatedAt: string;
}

export type PortfolioSectionKey =
  | 'profile'
  | 'about'
  | 'projects'
  | 'skills'
  | 'education'
  | 'experience'
  | 'certifications'
  | 'internshipStatus';

export type PortfolioContentStore = Partial<Record<PortfolioSectionKey, unknown>>;

interface LocalStoreData {
  contacts: StoredContact[];
  adminAuth: AdminAuthRecord | null;
  portfolioContent: PortfolioContentStore;
}

let cachedClient: MongoClient | null = null;

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0);
}

async function getMongoDb() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    return null;
  }

  if (!cachedClient) {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    cachedClient = client;
  }

  const dbName = process.env.MONGODB_DB_NAME?.trim() || 'nayana_portfolio';
  return cachedClient.db(dbName);
}

function readLocalStore(): LocalStoreData {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const raw = fs.readFileSync(LOCAL_STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<LocalStoreData>;
      return {
        contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
        adminAuth:
          parsed.adminAuth &&
          typeof parsed.adminAuth.salt === 'string' &&
          typeof parsed.adminAuth.hash === 'string'
            ? parsed.adminAuth
            : null,
        portfolioContent:
          parsed.portfolioContent &&
          typeof parsed.portfolioContent === 'object' &&
          !Array.isArray(parsed.portfolioContent)
            ? parsed.portfolioContent
            : {},
      };
    }
  } catch {
    // Fall back to empty local store
  }
  return { contacts: [], adminAuth: null, portfolioContent: {} };
}

function writeLocalStore(data: LocalStoreData): void {
  fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function hashPasscode(passcode: string, salt = crypto.randomBytes(16).toString('hex')): AdminAuthRecord {
  const hash = crypto.scryptSync(passcode, salt, 64).toString('hex');
  return {
    salt,
    hash,
    updatedAt: new Date().toISOString(),
  };
}

export function verifyPasscodeHash(passcode: string, record: AdminAuthRecord): boolean {
  const derived = crypto.scryptSync(passcode, record.salt, 64);
  const stored = Buffer.from(record.hash, 'hex');
  if (derived.length !== stored.length) return false;
  return crypto.timingSafeEqual(derived, stored);
}

export async function getAdminAuthRecord(): Promise<AdminAuthRecord | null> {
  const db = await getMongoDb();
  if (db) {
    const doc = await db.collection<{ _id: string } & Partial<AdminAuthRecord>>('portfolio_settings').findOne({
      _id: 'admin_auth',
    });
    if (doc && typeof doc.salt === 'string' && typeof doc.hash === 'string') {
      return {
        salt: doc.salt,
        hash: doc.hash,
        updatedAt: String(doc.updatedAt || ''),
      };
    }
    return null;
  }

  return readLocalStore().adminAuth;
}

export async function claimAdminPasscodeOnce(passcode: string): Promise<boolean> {
  const record = hashPasscode(passcode);
  const db = await getMongoDb();
  if (db) {
    const existing = await db.collection<{ _id: string }>('portfolio_settings').findOne({
      _id: 'admin_auth',
    });
    if (existing) {
      return false;
    }
    await db.collection<{ _id: string } & AdminAuthRecord>('portfolio_settings').insertOne({
      _id: 'admin_auth',
      ...record,
    });
    return true;
  }

  const store = readLocalStore();
  if (store.adminAuth) {
    return false;
  }
  store.adminAuth = record;
  writeLocalStore(store);
  return true;
}

export async function getPortfolioContent(): Promise<PortfolioContentStore> {
  const db = await getMongoDb();
  if (db) {
    const doc = await db
      .collection<{ _id: string; data?: PortfolioContentStore }>('portfolio_content')
      .findOne({ _id: 'main' });
    return doc?.data && typeof doc.data === 'object' ? doc.data : {};
  }

  return readLocalStore().portfolioContent;
}

export async function savePortfolioSection(
  section: PortfolioSectionKey,
  value: unknown
): Promise<PortfolioContentStore> {
  const db = await getMongoDb();
  if (db) {
    const current = await getPortfolioContent();
    const updated = { ...current, [section]: value };
    await db
      .collection<{ _id: string; data: PortfolioContentStore; updatedAt: string }>('portfolio_content')
      .updateOne(
        { _id: 'main' },
        { $set: { data: updated, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    return updated;
  }

  const store = readLocalStore();
  store.portfolioContent = {
    ...store.portfolioContent,
    [section]: value,
  };
  writeLocalStore(store);
  return store.portfolioContent;
}

export async function resetPortfolioSection(section: PortfolioSectionKey): Promise<PortfolioContentStore> {
  const db = await getMongoDb();
  if (db) {
    const current = await getPortfolioContent();
    const updated = { ...current };
    delete updated[section];
    await db
      .collection<{ _id: string; data: PortfolioContentStore; updatedAt: string }>('portfolio_content')
      .updateOne(
        { _id: 'main' },
        { $set: { data: updated, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    return updated;
  }

  const store = readLocalStore();
  const updated = { ...store.portfolioContent };
  delete updated[section];
  store.portfolioContent = updated;
  writeLocalStore(store);
  return updated;
}

export async function saveContactInquiry(payload: ContactPayload): Promise<StoredContact> {
  const createdAt = new Date().toISOString();
  const db = await getMongoDb();

  if (db) {
    const doc = {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
      createdAt,
      source: 'portfolio-web',
    };
    const result = await db.collection('contact_inquiries').insertOne(doc);
    return {
      id: result.insertedId.toString(),
      ...payload,
      createdAt,
      storage: 'mongodb',
    };
  }

  const store = readLocalStore();
  const record: StoredContact = {
    id: `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    ...payload,
    createdAt,
    storage: 'local-json',
  };
  store.contacts.unshift(record);
  if (store.contacts.length > 200) {
    store.contacts = store.contacts.slice(0, 200);
  }
  writeLocalStore(store);
  return record;
}

export async function listContactInquiries(): Promise<StoredContact[]> {
  const db = await getMongoDb();
  if (db) {
    const docs = await db
      .collection('contact_inquiries')
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: String(doc.name || ''),
      email: String(doc.email || ''),
      subject: String(doc.subject || ''),
      message: String(doc.message || ''),
      createdAt: String(doc.createdAt || ''),
      storage: 'mongodb',
    }));
  }

  return readLocalStore().contacts;
}

export async function deleteContactInquiry(id: string): Promise<boolean> {
  const db = await getMongoDb();
  if (db) {
    if (!ObjectId.isValid(id)) return false;
    const result = await db.collection('contact_inquiries').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  const store = readLocalStore();
  const before = store.contacts.length;
  store.contacts = store.contacts.filter((item) => item.id !== id);
  if (store.contacts.length === before) return false;
  writeLocalStore(store);
  return true;
}
