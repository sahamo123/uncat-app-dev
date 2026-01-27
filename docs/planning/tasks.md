# DaxHive Master Task List

## 🎯 Active Phase: 1. The Foundation

### 1.1 Core Platform Setup
- [x] **Data Architecture**
    - [x] Create Supabase Project
    - [x] Run `knowledge_base/01_core_platform/schema.sql`
    - [x] Set up RLS Policies (Tenant Isolation)
- [x] **Authentication**
    - [x] Configure Clerk (Multi-tenancy + Organizations)
    - [x] Implemement Auth Middleware (Next.js)
- [x] **Infrastructure**
    - [x] Deploy Next.js App to Vercel
    - [x] Configure Environment Variables

### 1.2 Billing & Subscriptions
- [x] **Stripe Integration**
    - [x] Create Products (Starter, Pro, Enterprise)
    - [x] Create Metered Products (Add-ons)
    - [x] Implement Stripe Webhook Receiver
- [ ] **Entitlements**
    - [ ] Implement Rate Limiting Middleware
    - [ ] Build "Usage Dashboard"

---

## 📅 Pending Phases

### Phase 2: Data & Documents
- [/] **QBO Integration**
    - [x] OAuth Connection Flow
    - [x] Sync Engine (Transactions, Accounts)
### Phase 2: Data & Documents
- [/] **QBO Integration**
    - [x] OAuth Connection Flow
    - [x] Sync Engine (Transactions, Accounts)
    - [x] Handle "Uncategorized" Logic (AI Pipeline Implemented)
- [ ] **Document Management** (PDF Parsing, OCR)
- [ ] **Document Management** (PDF Parsing, OCR)
- [ ] **Hybrid File System** (Google Drive Import)

### Phase 3: Intelligence
- [/] **RAG Pipeline** (Vector Embeddings) - *Implemented V1*
- [/] **Reconciliation Engine** (Clearing Account Logic) - *Rule-Based Logic Implemented*
- [x] **Decision Tree UI** (Client-side categorization wizard)
- [ ] **Audit System** (Anomaly Detection)

### Phase 4: Communication
- [ ] **Unified Chat** (LiveKit Setup)
- [ ] **Client Portal** (Magic Links)
- [ ] **Integrations** (Google Calendar, Notetakers)
