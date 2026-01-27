# Uncat App

An AI-powered bookkeeping SaaS platform for QuickBooks Online, similar to Booke.ai.

## 🎯 Project Overview

Uncat App is a multi-tenant SaaS application that provides:
- **AI Bookkeeper**: Intelligent transaction categorization and bookkeeping assistance
- **QuickBooks Integration**: Seamless sync with QuickBooks Online
- **Multi-tenant Architecture**: Support for accounting firms managing multiple clients
- **Practice Management**: Tools for accountants to manage their clients efficiently

## 📚 Documentation

All project documentation is organized in the [`docs/`](./docs/) directory:

- **[Getting Started](./docs/planning/PROJECT_SUMMARY.md)** - High-level project overview
- **[Architecture](./docs/architecture/)** - System architecture and technical specs
- **[Implementation Plan](./docs/planning/implementation_plan.md)** - Development roadmap
- **[Setup Guide](./docs/deployment/setup_checklist.md)** - Setup instructions
- **[Cost Breakdown](./docs/planning/cost_breakdown.md)** - Budget and cost analysis

See the [docs README](./docs/README.md) for complete documentation index.

## 🚀 Quick Start

1. Review the [PROJECT_SUMMARY.md](./docs/planning/PROJECT_SUMMARY.md) for project overview
2. Follow the [setup_checklist.md](./docs/deployment/setup_checklist.md) for environment setup
3. Check [implementation_plan.md](./docs/planning/implementation_plan.md) for development approach
4. Review [tasks.md](./docs/planning/tasks.md) for current task list

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI/ML**: OpenAI GPT-4, RAG (Retrieval-Augmented Generation)
- **Integrations**: QuickBooks Online API, Stripe
- **Hosting**: Vercel (frontend), Supabase (backend)

## 📋 Project Status

See [tasks.md](./docs/planning/tasks.md) for current progress and task tracking.

## 🔐 Security & Credentials

Required credentials and API keys are documented in [required_credentials.md](./docs/deployment/required_credentials.md).

**⚠️ Never commit credentials to version control!** Use environment variables and `.env.local` files.

## 📖 Key Documentation Files

- **Architecture**: [architecture.md](./docs/architecture/architecture.md)
- **ML Architecture**: [ml_architecture.md](./docs/architecture/ml_architecture.md)
- **Cost Analysis**: [cost_breakdown.md](./docs/planning/cost_breakdown.md)
- **Database Schema**: [supabase_setup.sql](./docs/database/supabase_setup.sql)
- **AI Decision Tree**: [decision_tree_logic.json](./docs/ai/decision_tree_logic.json)

## 🧪 Testing

Testing documentation is available in [`docs/testing/`](./docs/testing/):
- [testing_strategy.md](./docs/testing/testing_strategy.md) - Overall testing approach
- [testing_spec.md](./docs/testing/testing_spec.md) - Detailed test specifications

## 📞 Support

For questions or issues, refer to the relevant documentation in the `docs/` directory.

---
**Last Updated**: 2026-01-22
