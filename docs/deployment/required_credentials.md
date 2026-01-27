# Required API Credentials - Secure Setup Guide

⚠️ **NEVER paste API keys in chat or commit them to git.**

---

## Secure Setup Strategy

### For Local Development
Create a `.env.local` file in your project root (auto-ignored by git):

```env
# OpenAI
OPENAI_API_KEY=sk-...

# QuickBooks Online
QBO_CLIENT_ID=...
QBO_CLIENT_SECRET=...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Optional: SMS & Email
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
RESEND_API_KEY=re_...
```

### For Production (Vercel)
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable (Vercel encrypts them at rest)
3. Deploy - variables are injected at runtime

---

## How to Obtain Each Credential

### 1. OpenAI API Key
1. Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy to `.env.local` as `OPENAI_API_KEY`

### 2. QuickBooks Online
1. Visit [developer.intuit.com](https://developer.intuit.com/)
2. Create app → Get Client ID & Secret
3. Use **Sandbox** for development (free)

### 3. Supabase
1. Visit [database.new](https://database.new)
2. Create project
3. Copy URL and `anon` key from Settings → API

### 4. Clerk
1. Visit [clerk.com](https://clerk.com)
2. Create application
3. Copy keys from API Keys section

### 5. Twilio (Optional)
1. Visit [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Get free trial credits
3. Copy Account SID & Auth Token

### 6. Resend (Optional)
1. Visit [resend.com](https://resend.com)
2. Create API key (100 emails/day free)

---

## What I'll Do

When you're ready to build:
1. I'll generate code with `process.env.VARIABLE_NAME` references
2. You create `.env.local` and paste your keys there
3. The app reads them securely at runtime

**Your keys stay on your machine.** ✅
