# DaxHive Master Task List

## 🎯 Active Phase: 1. The Foundation

### 1.1 Core Platform Setup
- [ ] **Data Architecture**
    - [ ] Create Supabase Project
    - [ ] Run `knowledge_base/01_core_platform/schema.sql`
    - [ ] Set up RLS Policies (Tenant Isolation)
- [ ] **Authentication**
    - [ ] Configure Clerk (Multi-tenancy + Organizations)
    - [ ] Implemement Auth Middleware (Next.js)
- [ ] **Infrastructure**
    - [ ] Deploy Next.js App to Vercel
    - [ ] Configure Environment Variables

### 1.2 Billing & Subscriptions
- [ ] **Stripe Integration**
    - [ ] Create Products (Starter, Pro, Enterprise)
    - [ ] Create Metered Products (Add-ons)
    - [ ] Implement Stripe Webhook Receiver
- [ ] **Entitlements**
    - [ ] Implement Rate Limiting Middleware
    - [ ] Build "Usage Dashboard"

---

## 📅 Pending Phases

### Phase 2: Data & Documents
- [ ] **QBO Integration** (OAuth, Sync Engine)
- [ ] **Document Management** (PDF Parsing, OCR)
- [ ] **Hybrid File System** (Google Drive Import)

### Phase 3: Intelligence
- [ ] **RAG Pipeline** (Vector Embeddings)
- [ ] **Reconciliation Engine** (Clearing Account Logic)
- [ ] **Audit System** (Anomaly Detection)

### Phase 4: Communication
- [ ] **Unified Chat** (LiveKit Setup)
- [ ] **Client Portal** (Magic Links)
- [ ] **Integrations** (Google Calendar, Notetakers)
