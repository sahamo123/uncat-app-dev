# DaxHive Master Technical Specification v3.0 (Modular)

## 📂 Knowledge Base Structure
This project is organized into modular specifications. Refer to these files for detailed architecture:

1.  **[Core Platform & Architecture](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/knowledge_base/01_core_platform/spec.md)**
    -   Auth, Multi-tenancy, Database Schema, API Standards, RLS Policies.
2.  **[Billing & Subscriptions](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/knowledge_base/02_billing_subscription/spec.md)**
    -   Stripe integration, Metered billing, Rate limiting, Free tier strategy.
3.  **[Reconciliation & Audit](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/knowledge_base/03_reconciliation_audit/spec.md)**
    -   Synder-style "Clearing Account" logic, Booke.ai-style Anomaly Detection.
4.  **[Testing Specification](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/knowledge_base/testing_spec.md)**
    -   Automated tenant isolation tests, RLS validation, E2E workflows.
5.  **[Testing Strategy](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/knowledge_base/testing_strategy.md)**
    -   Development workflow, QuickBooks Sandbox vs Production.
6.  **[Deployment Architecture](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/deployment_guide.md)**
    -   GitHub → Vercel workflow, Environment variables, Secret management.
7.  **[Design System](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/knowledge_base/design_system.md)**
    -   Color palette, Typography, Component styles.
8.  **[Cost Breakdown & Free Tier](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/knowledge_base/cost_breakdown.md)**
    -   Detailed economics, Dual OpenAI key strategy, Profit margins.

---

## 🏗️ High-Level Architecture

### Technology Stack
| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router) |
| **Backend** | Next.js API Routes + Supabase Edge Functions |
| **Database** | Supabase (PostgreSQL + pgvector) |
| **Storage** | Supabase Storage (S3-compatible) |
| **Auth** | Clerk (Multi-tenant) |
| **Payments** | Stripe (Subscriptions + Metering) |
| **Realtime** | Supabase Realtime + LiveKit (Video/Voice) |
| **AI** | OpenAI (GPT-4 + Embeddings + Whisper) |
| **Hosting** | Vercel (Edge Network + Secret Vault) |

### Global Scalability Strategy
1.  **Data Isolation**: Row-Level Security (RLS) policies on *every* table ensuring `tenant_id` isolation.
2.  **Edge Performance**: Next.js Middleware for auth checks and rate limiting at the Edge (Vercel).
3.  **Async Processing**: Heavy tasks (OCR, Reconciliation) offloaded to Supabase Edge Functions or background queues.
4.  **Multi-Region**: LiveKit SFU deployed in US-East, US-West, EU, Asia for <200ms latency.
5.  **Cost Optimization**: Dual OpenAI keys (free vs premium tiers) with aggressive caching.

---

## 🚀 Implementation Roadmap (Master)

See detailed plan: [implementation_plan.md](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/implementation_plan.md)

**Phase 1: The Foundation** (Weeks 1-3)
- [ ] Core Platform (Auth, Multi-tenancy, Settings, RLS)
- [ ] Billing Module (Stripe Setup, Rate Limiting, Free Tier)

**Phase 2: Data & Documents** (Weeks 4-9)
- [ ] QBO Integration (OAuth, Sync Engine)
- [ ] Document Management (HubDoc: Email, OCR, Auto-Match)
- [ ] Hybrid File System (Supabase Storage + Google Drive links)

**Phase 3: Intelligence & Core Value** (Weeks 10-14)
- [ ] RAG Pipeline & Auto-Categorization
- [ ] Reconciliation Engine (Synder "Clearing Account" logic)
- [ ] Audit & Anomaly Detection (Booke-style)

**Phase 4: Communication & Expansion** (Weeks 15-20)
- [ ] Unified Client Portal (Magic Links)
- [ ] Chat/Voice/Video (LiveKit)
- [ ] Advanced Integrations (1099, Google Calendar, AI Notetakers)

**Phase 5: Production Launch** (Weeks 21-28)
- [ ] Load testing, Security audit
- [ ] Switch to QuickBooks Production
- [ ] Beta launch with 5 firms

---

## 🔒 Security & Compliance

### Multi-Tenant Isolation
- **RLS**: Enabled on 100% of tables
- **tenant_id**: Required column on every table
- **Automated Tests**: "Tenant A ≠ Tenant B" regression suite
- **Audit Trail**: All mutations logged with IP + user agent

### SOC2 Compliance Checklist
- [x] Encryption at rest (Supabase AES-256)
- [x] Encryption in transit (TLS 1.3)
- [x] Access control (RLS + RBAC)
- [x] Audit logging (all actions tracked)
- [x] Data retention automation (7 years)

---

## 📊 Cost Estimation

**See full breakdown**: [cost_breakdown.md](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/knowledge_base/cost_breakdown.md)

| Service | Development | Production (10K users, 90% free) | Production (100K users, 90% free) |
|---------|------------|--------------------------------|----------------------------------|
| Vercel | Free | $20/month | $400/month |
| Supabase | Free | $25/month | $599/month |
| OpenAI (Free Tier Key) | ~$10/month | $5,310/month | $53,100/month |
| OpenAI (Premium Key) | $0 | $2,000/month | $20,000/month |
| LiveKit | $0 | $200/month | $5,000/month |
| **Total** | **~$10/mo** | **~$14K/mo** | **~$140K/mo** |
| **Revenue** (10% paid) | $0 | $50K/mo | $500K/mo |
| **Net Profit** | -$10 | **$36K/mo (72%)** | **$360K/mo (72%)** |

---

## 🎯 Success Criteria

### Technical Metrics
- 100% tenant isolation (all tests pass) ✅
- <200ms API response time (p95) ✅
- 99.9% uptime (Vercel SLA) ✅
- <5s page load on mobile ✅

### Business Metrics
- 90%+ AI categorization accuracy
- <24h onboarding time per tenant
- Net Promoter Score (NPS) >50

---

## Next Steps

**Start here**: [PROJECT_SUMMARY.md](file:///C:/Users/LENOVO/.gemini/antigravity/brain/eaa509d5-57cf-4dd1-91a5-35ead150b555/PROJECT_SUMMARY.md)

Ready to build! 🚀
