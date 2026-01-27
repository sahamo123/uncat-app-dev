# Deployment Architecture & Workflow

## Architecture Clarification

### What Each Service Does

```
┌─────────────────────────────────────────────────┐
│ YOUR COMPUTER (Development)                     │
│ ├─ Antigravity IDE (Code Editor)               │
│ ├─ .env.local (Local secrets, git-ignored)     │
│ └─ Next.js App (Running on localhost:3000)     │
└─────────────────────────────────────────────────┘
         │ (Push code via Git)
         ▼
┌─────────────────────────────────────────────────┐
│ GITHUB (Code Repository)                        │
│ ├─ All your .ts/.tsx files ✅                  │
│ ├─ package.json ✅                             │
│ └─ .env.local ❌ (Never committed)             │
└─────────────────────────────────────────────────┘
         │ (Auto-deploy trigger)
         ▼
┌─────────────────────────────────────────────────┐
│ VERCEL (Hosting + Secret Vault)                 │
│ ├─ Hosts: Next.js app (frontend + API routes) │
│ ├─ Stores: Environment Variables (encrypted)   │
│ │   • OPENAI_API_KEY                           │
│ │   • QBO_CLIENT_ID                            │
│ │   • SUPABASE_URL                             │
│ └─ Runs: Edge Functions globally              │
└─────────────────────────────────────────────────┘
         │ (Connects to)
         ▼
┌─────────────────────────────────────────────────┐
│ SUPABASE (Backend Services)                     │
│ ├─ Database: PostgreSQL (your data)            │
│ ├─ Storage: Files (receipts, documents)        │
│ ├─ Auth: User authentication                   │
│ └─ Edge Functions: Background jobs (optional)  │
└─────────────────────────────────────────────────┘
```

### The Answer to Your Questions

**Q: Where are API keys stored?**
- **Local Dev**: `.env.local` on your computer
- **Production**: **Vercel Environment Variables** (encrypted vault)
- Supabase does NOT store your other API keys (only its own connection info)

**Q: What is Vercel doing?**
- Vercel is NOT just "publishing" - it's:
  1. **Hosting** the Next.js app (frontend + backend API routes)
  2. **Storing** all your secrets (encrypted at rest)
  3. **Running** serverless functions at the edge (globally distributed)

---

## Deployment Workflow

### Option A: GitHub → Vercel (RECOMMENDED)

**Why this is best:**
- Automatic deployments on every `git push`
- Preview deployments for every branch
- Rollback to previous versions with 1 click
- Industry standard for Next.js

**Steps:**

1. **Create GitHub Repository**
   ```bash
   # From your project folder
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/daxhive.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repo
   - Click "Deploy"
   - Done! ✅

3. **Add Environment Variables in Vercel**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add each key:
     - `OPENAI_API_KEY` = `sk-...`
     - `QBO_CLIENT_ID` = `...`
     - etc.
   - These are encrypted and NEVER exposed

4. **Future Deployments**
   ```bash
   # Make changes to code
   git add .
   git commit -m "Added feature X"
   git push
   # Vercel auto-deploys in ~30 seconds
   ```

### Option B: Direct from Local (NOT Recommended)

You can deploy directly from your machine using Vercel CLI:
```bash
npm i -g vercel
vercel --prod
```

**Why we don't recommend this:**
- No version history
- No automatic deployments
- No collaboration-friendly
- Harder to rollback

---

## From Antigravity IDE to Production

**Current State:** Antigravity IDE doesn't directly deploy to Vercel (it's a code editor, not a deployment tool).

**The Workflow:**

1. **In Antigravity IDE:**
   - I generate code files (you paste them in)
   - You test locally with `.env.local`

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```

3. **Vercel Auto-Deploys:**
   - Sees the commit
   - Builds the app
   - Deploys globally in ~30 seconds

4. **Live at:**
   - `https://daxhive.vercel.app` (or your custom domain)

---

## Environment Variables: Where They Live

| Environment | Where Secrets Live | How App Accesses Them |
|-------------|-------------------|----------------------|
| **Local Dev** | `.env.local` (your computer) | `process.env.OPENAI_API_KEY` |
| **Production** | Vercel Dashboard (encrypted) | `process.env.OPENAI_API_KEY` (same code!) |

**The beauty:** Your code is identical. Next.js reads `process.env.*` in both environments.

---

## Security Flow

```
┌─────────────────────────────────────────────────┐
│ YOU                                              │
│ ├─ Create API keys on OpenAI, QBO, etc.        │
│ └─ Paste them into Vercel UI (one-time)        │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ VERCEL (Encrypted Vault)                        │
│ ├─ Stores: AES-256 encrypted at rest           │
│ ├─ Injects: At runtime to your app             │
│ └─ Never: Exposed in logs, UI, or responses    │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ YOUR APP (Running on Vercel)                    │
│ ├─ Reads: process.env.OPENAI_API_KEY           │
│ └─ Uses: To call APIs securely                 │
└─────────────────────────────────────────────────┘
```

---

## Best Practices

✅ **DO:**
- Store secrets in Vercel Environment Variables (production)
- Use `.env.local` for local development
- Add `.env.local` to `.gitignore`
- Use separate keys for dev/production

❌ **DON'T:**
- Commit `.env.local` to Git
- Paste keys in code files
- Share keys in chat/email
- Use production keys in development

---

## Your Next Steps

1. **Create GitHub account** (if you don't have one)
2. **Create Vercel account** (free tier is plenty for MVP)
3. When ready to deploy:
   - I generate code → You paste into project folder
   - You push to GitHub
   - Connect GitHub to Vercel
   - Add secrets in Vercel UI
   - Deploy! ✅

This is the same workflow used by Stripe, Linear, and every modern SaaS. 🚀
