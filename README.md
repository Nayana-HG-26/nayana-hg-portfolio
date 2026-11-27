# Nayana H G — Developer Portfolio

Full-stack developer portfolio built with **React**, **Vite**, **Tailwind CSS**, **Framer Motion**, **Node.js + Express**, and **MongoDB**.

## Editing Content & Uploading Certificates

You can update every section of the portfolio in two ways:
1. **Admin Studio (`/admin` in the app)**:
   - On your first visit to `/admin` (when `ADMIN_PASSCODE` is not set in `.env`), create your own admin passcode right in the browser, or set `ADMIN_PASSCODE` in `.env` for production.
   - Edit, delete, or add any built-in or new **Projects** (overview, features, tech stack, preview image, GitHub/Live links).
   - Upload **Certification PDFs/Images** directly from your device, edit existing certificates, or delete them.
   - Edit **Home Overview**, **Profile Photo**, **Resume PDF**, **About Biography**, **Skills Orbit**, **Education**, **Experience & Workshops**, and inspect **Contact Inbox** messages.
2. **Default Code Data (`src/data/portfolioData.js`)**:
   - All built-in projects, certifications, skills, education, and biography defaults live in `src/data/portfolioData.js` if you prefer editing source files directly.

## Run Locally (VS Code / Terminal)

1. Unzip `nayana-hg-portfolio.zip` and open the folder in VS Code.
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Copy `.env.example` to `.env` if you want to connect MongoDB Atlas or set `ADMIN_PASSCODE`:
   ```bash
   cp .env.example .env
   ```
   Without a `.env` file, admin updates, uploaded files (`public/uploads/`), and contact messages automatically persist locally in `server/local-store.json`.
4. Start the full-stack dev server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

## Deploy to Netlify

The repository includes `netlify.toml` and `netlify/functions/contact.mjs`.

1. Push the unzipped project folder to a GitHub repository (or deploy directly with Netlify CLI).
2. In Netlify, set:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
3. (Optional) In **Site settings → Environment variables**, add:
   - `MONGODB_URI` and `MONGODB_DB_NAME` (for the built-in Netlify `/api/contact` serverless function), **or**
   - `VITE_API_BASE_URL` pointing to your hosted Express backend (Render/Railway) if you host `server.ts` separately (set `ALLOWED_ORIGINS` to your Netlify URL on that backend).
4. Click **Deploy site**.
