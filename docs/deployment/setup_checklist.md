# Pre-Development Setup Checklist

Complete these steps BEFORE we start coding. Check off each item as you complete it.

---

## Step 1: GitHub Account
**Purpose**: Version control and deployment trigger

- [ ] Go to [github.com/signup](https://github.com/signup)
- [ ] Create account (free tier is fine)
- [ ] Verify email address
- [ ] **Note**: Save your username (you'll need it later)

---

## Step 2: Vercel Account
**Purpose**: Hosting + Secret vault + Auto-deployment

- [ ] Go to [vercel.com/signup](https://vercel.com/signup)
- [ ] Sign up with GitHub (click "Continue with GitHub")
- [ ] Authorize Vercel to access your GitHub
- [ ] **Result**: Vercel can now auto-deploy when you push code

**Test**: You should see "Import Git Repository" option on dashboard

---

## Step 3: Supabase Account
**Purpose**: Database + Storage + Realtime features

- [ ] Go to [database.new](https://database.new) (redirects to Supabase)
- [ ] Sign up with GitHub (easiest integration)
- [ ] Create your first project:
  - **Name**: `daxhive-dev`
  - **Database Password**: (Save this somewhere safe!)
  - **Region**: Choose closest to you (US East for USA)
- [ ] Wait 2-3 minutes for project to provision

**Get Your Keys**:
- [ ] Go to Project Settings → API
- [ ] Copy these to a text file (we'll use them later):
  - `Project URL`: `https://yourproject.supabase.co`
  - `anon/public key`: Starts with `eyJ...`
  - `service_role key`: Starts with `eyJ...` (keep this secret!)

---

## Step 4: OpenAI Account
**Purpose**: AI categorization + RAG embeddings

- [ ] Go to [platform.openai.com/signup](https://platform.openai.com/signup)
- [ ] Create account
- [ ] Add payment method (Settings → Billing)
  - **Note**: ~$10-20/month for testing
- [ ] Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- [ ] Click "Create new secret key"
- [ ] **Copy the key** (starts with `sk-...`)
  - ⚠️ You can only see this once!

---

## Step 5: QuickBooks Developer Account
**Purpose**: Connect to client QuickBooks data

- [ ] Go to [developer.intuit.com](https://developer.intuit.com/)
- [ ] Sign up (free)
- [ ] Create an app:
  - Click "My Apps" → "Create an app"
  - Select "QuickBooks Online and Payments"
  - **App Name**: `DaxHive Dev`
  - Select scopes: `com.intuit.quickbooks.accounting`
- [ ] Get your keys (Development → Keys & credentials):
  - `Client ID`: Copy this
  - `Client Secret`: Copy this
- [ ] Add redirect URI:
  - Click "Add URI"
  - Enter: `http://localhost:3000/api/auth/qbo/callback`
  - Click "Save"

**Note**: You now have Sandbox access (free test data)!

---

## Step 6: Clerk Account
**Purpose**: Multi-tenant authentication

- [ ] Go to [clerk.com](https://clerk.com)
- [ ] Sign up (free tier: 10K monthly active users)
- [ ] Create application:
  - **Name**: `DaxHive`
  - **Type**: Choose "Sign in with email + password"
- [ ] Get your keys (Dashboard → API Keys):
  - `Publishable Key`: Starts with `pk_test_...`
  - `Secret Key`: Starts with `sk_test_...`

**Enable Organizations** (for multi-tenancy):
- [ ] Go to "Organizations" in sidebar
- [ ] Toggle "Enable organizations" → ON

---

## Step 7: Stripe Account
**Purpose**: Subscription billing + payments

- [ ] Go to [stripe.com](https://stripe.com)
- [ ] Sign up
- [ ] **Stay in Test Mode** (toggle in top-right)
- [ ] Get your keys (Developers → API keys):
  - `Publishable key`: Starts with `pk_test_...`
  - `Secret key`: Starts with `sk_test_...`

**Note**: We'll only use Test Mode until launch!

---

## Step 8 (Optional): Twilio Account
**Purpose**: SMS notifications

- [ ] Go to [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
- [ ] Sign up (free $15 credit)
- [ ] Get your credentials (Console):
  - `Account SID`
  - `Auth Token`
  - `Phone Number` (you get a free one)

**Skip for now if you want** - we can add this later.

---

## Step 9 (Optional): Resend Account
**Purpose**: Transactional emails

- [ ] Go to [resend.com](https://resend.com)
- [ ] Sign up (free: 100 emails/day)
- [ ] Create API key
- [ ] Copy key (starts with `re_...`)

**Skip for now if you want** - we can add this later.

---

## Credentials Summary Sheet

Once you've completed all steps above, fill this out:

```
GITHUB
├─ Username: _________________

VERCEL
├─ Connected to GitHub: ✓

SUPABASE
├─ Project URL: _________________
├─ Anon Key: _________________
└─ Service Role Key: _________________ (KEEP SECRET!)

OPENAI
└─ API Key: _________________ (starts with sk-)

QUICKBOOKS
├─ Client ID: _________________
├─ Client Secret: _________________
└─ Redirect URI added: ✓

CLERK
├─ Publishable Key: _________________
├─ Secret Key: _________________
└─ Organizations enabled: ✓

STRIPE
├─ Test Publishable Key: _________________
└─ Test Secret Key: _________________

OPTIONAL (Twilio)
├─ Account SID: _________________
├─ Auth Token: _________________
└─ Phone Number: _________________

OPTIONAL (Resend)
└─ API Key: _________________
```

---

## What Happens Next

After you complete these steps:

1. ✅ **You tell me**: "Setup complete"
2. ✅ **I generate**: Initial Next.js project + SQL setup
3. ✅ **You create**: `.env.local` file and paste keys there
4. ✅ **You run**: `npm install` and `npm run dev`
5. ✅ **You test**: See the app running at `localhost:3000`

---

## Time Estimate

- **Required accounts** (Steps 1-7): ~45 minutes
- **Optional accounts** (Steps 8-9): ~15 minutes
- **Total**: ~1 hour max

---

## Important Security Reminders

⚠️ **NEVER**:
- Commit `.env.local` to GitHub
- Share API keys in chat/email
- Use production keys in development

✅ **ALWAYS**:
- Store keys in `.env.local` (local) or Vercel UI (production)
- Use QuickBooks Sandbox for testing
- Use Stripe Test Mode until launch

---

## Need Help?

If you get stuck on any step, just let me know which one and I'll provide detailed screenshots or a video walkthrough!

**Ready to start?** Complete the checklist above and then say "Setup complete" 🚀
