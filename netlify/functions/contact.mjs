import { MongoClient } from 'mongodb';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
let cachedClient = null;

function sanitizeText(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

async function getClient() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    return null;
  }
  if (cachedClient) {
    return cachedClient;
  }
  const client = new MongoClient(uri, {
    maxPoolSize: 3,
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  cachedClient = client;
  return cachedClient;
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Invalid request payload.' }),
      };
    }

    const name = sanitizeText(body.name, 100);
    const email = sanitizeText(body.email, 160).toLowerCase();
    const subject = sanitizeText(body.subject, 140) || 'Portfolio Inquiry';
    const message = sanitizeText(body.message, 2000);

    if (name.length < 2) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Please enter your name (at least 2 characters).' }),
      };
    }
    if (!EMAIL_PATTERN.test(email)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Please provide a valid email address.' }),
      };
    }
    if (message.length < 10) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Please enter a message of at least 10 characters.' }),
      };
    }

    const client = await getClient();
    const createdAt = new Date().toISOString();

    if (!client) {
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ok: false,
          error: 'MONGODB_URI is not configured on this Netlify deployment yet.',
        }),
      };
    }

    const dbName = process.env.MONGODB_DB_NAME?.trim() || 'nayana_portfolio';
    const result = await client.db(dbName).collection('contact_inquiries').insertOne({
      name,
      email,
      subject,
      message,
      createdAt,
      source: 'netlify-function',
    });

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        id: result.insertedId.toString(),
        storage: 'mongodb-atlas',
        createdAt,
        message: 'Thank you for reaching out. Your message has been saved.',
      }),
    };
  } catch (err) {
    console.error('Netlify contact error:', err instanceof Error ? err.message : 'Unknown error');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Unable to submit message at this time.' }),
    };
  }
}
