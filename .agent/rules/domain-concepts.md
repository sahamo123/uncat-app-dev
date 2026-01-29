---
trigger: always_on
---

# Domain Concepts (Authoritative)

These concepts are used throughout all rules.
Agents MUST map these concepts to the actual implementation.

## Tenant
A tenant represents a legally isolated customer entity.
The tenant identifier is the immutable value used to associate all data, files, and embeddings to a single customer.

The tenant identifier may be named differently in different tables.
Agents must determine the correct tenant identifier per table.

## Tenant Scope
Tenant scope means explicitly filtering or enforcing access using the tenant identifier.
Tenant scope must be enforced:
- in queries
- in RLS policies
- in storage access
- in RAG retrieval

## Private Data
Private data includes any accounting, bookkeeping, financial, tax, payroll, or client document.
Private data must never be publicly accessible.

## Entitlement
Entitlement is the server-side decision logic that determines feature access
(e.g. free vs paid).
Entitlement must never be trusted from the client.

## RAG Corpus
A RAG corpus is the collection of documents, chunks, and embeddings belonging to a single tenant.
RAG corpora must never be shared across tenants.
