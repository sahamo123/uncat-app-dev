# DaxHive Architecture Overview

## System Architecture

```mermaid
graph TB
    subgraph "User Types"
        A[Accountant/Bookkeeper]
        C[Client Business Owner]
    end
    
    subgraph "DaxHive Platform"
        AP[Accountant Portal]
        CP[Client Portal]
        API[Next.js API Routes]
        AUTH[Clerk Auth]
        DB[(Supabase PostgreSQL)]
    end
    
    subgraph "External Services"
        QBO[QuickBooks Online API]
        OPENAI[OpenAI GPT-4]
    end
    
    A -->|Manages Multiple Clients| AP
    C -->|Reviews Transactions| CP
    
    AP --> AUTH
    CP --> AUTH
    AUTH --> API
    
    API <-->|Store/Fetch Data| DB
    API <-->|OAuth2 + REST API| QBO
    API <-->|Chain of Thought Prompts| OPENAI
    
    QBO -->|Bank Feed Transactions| API
    API -->|Categorized Transactions| QBO
```

## Data Flow: Transaction Categorization

```mermaid
sequenceDiagram
    participant QBO as QuickBooks Online
    participant API as DaxHive API
    participant DB as Database
    participant AI as OpenAI GPT-4
    participant ACC as Accountant

    QBO->>API: Webhook: New Transaction
    API->>DB: Save Raw Transaction
    API->>DB: Fetch Chart of Accounts
    API->>DB: Fetch Historical Categories (2 years)
    
    API->>AI: Chain of Thought Prompt<br/>(Transaction + Context)
    AI->>API: JSON Response<br/>(Category + Confidence + Reasoning)
    
    alt Confidence >= 90%
        API->>DB: Save to Approval Queue (High Confidence)
    else Confidence < 90%
        API->>DB: Save to Review Queue (Needs Human)
    end
    
    ACC->>API: Review Queue
    API->>ACC: Show AI Suggestion + Reasoning
    ACC->>API: Approve / Change / Reject
    
    API->>QBO: Update Transaction Category
    API->>DB: Log to Audit Trail
```

## Two-Portal Architecture

### Accountant Portal
- **Dashboard**: Overview of all clients
- **Client Switcher**: Dropdown to switch between clients
- **Transaction Queue**: AI suggestions awaiting approval
- **Month-End Tools**: Checklists, reconciliation, reports
- **Settings**: Manage team, billing, integrations

### Client Portal
- **My Transactions**: Flagged items needing clarification
- **Upload Receipts**: Attach supporting documents
- **Answer Queries**: Respond to accountant questions
- **Reports**: View-only P&L, Balance Sheet

## AI Chain of Thought Process

```mermaid
flowchart LR
    T[New Transaction] --> A1[Step 1: Vendor Analysis]
    A1 --> A2[Step 2: Historical Lookup]
    A2 --> A3[Step 3: Account Type Match]
    A3 --> A4[Step 4: Industry Rules]
    A4 --> A5[Step 5: Calculate Confidence]
    A5 --> R{Confidence?}
    
    R -->|>= 90%| HIGH[High Confidence<br/>Suggest + Approve Eligible]
    R -->|70-89%| MED[Medium Confidence<br/>Suggest + Require Review]
    R -->|< 70%| LOW[Low Confidence<br/>Mark for Human Review]
```

## Database Schema (Simplified)

```mermaid
erDiagram
    USERS ||--o{ CLIENTS : manages
    CLIENTS ||--|| QBO_CONNECTIONS : has
    CLIENTS ||--o{ CHART_OF_ACCOUNTS : has
    CLIENTS ||--o{ TRANSACTIONS : has
    TRANSACTIONS ||--o{ AI_SUGGESTIONS : has
    USERS ||--o{ AUDIT_LOG : creates
    
    USERS {
        uuid id PK
        string email
        string role
        timestamp created_at
    }
    
    CLIENTS {
        uuid id PK
        uuid accountant_id FK
        string business_name
        string industry
    }
    
    QBO_CONNECTIONS {
        uuid id PK
        uuid client_id FK
        string access_token_encrypted
        string refresh_token_encrypted
        string realm_id
    }
    
    CHART_OF_ACCOUNTS {
        uuid id PK
        uuid client_id FK
        string qbo_account_id
        string account_name
        string account_type
        string account_subtype
    }
    
    TRANSACTIONS {
        uuid id PK
        uuid client_id FK
        string qbo_transaction_id
        decimal amount
        string vendor
        date transaction_date
        string status
    }
    
    AI_SUGGESTIONS {
        uuid id PK
        uuid transaction_id FK
        uuid suggested_account_id FK
        int confidence_score
        text reasoning
        string status
    }
    
    AUDIT_LOG {
        uuid id PK
        uuid user_id FK
        uuid client_id FK
        string action
        jsonb details
        timestamp created_at
    }
```

## Guardrails Summary

| Guardrail | Implementation | Purpose |
|-----------|---------------|---------|
| **Confidence Threshold** | 90% minimum for auto-suggest | Prevent incorrect categorizations |
| **Approval Queue** | All suggestions visible before posting | Human oversight required |
| **Audit Trail** | Log every action with user + timestamp | Compliance and debugging |
| **Rollback Capability** | "Undo" button for last 30 days | Recover from mistakes |
| **Daily Digest Email** | Summary of all AI actions | Keep accountant informed |
| **Data Isolation** | Client data never crosses boundaries | Multi-tenant security |
| **Encrypted Tokens** | QBO tokens use AES-256 encryption | Protect OAuth credentials |

## Industry-Specific Handling

### Auto-Detection Logic
```typescript
function detectIndustry(chartOfAccounts) {
  const accountNames = chartOfAccounts.map(a => a.account_name.toLowerCase());
  
  if (accountNames.includes('inventory') && accountNames.includes('cogs')) {
    return 'Retail/Manufacturing';
  }
  if (accountNames.includes('rental income')) {
    return 'Real Estate';
  }
  if (accountNames.includes('billable hours')) {
    return 'Professional Services';
  }
  // ... more rules
  
  return 'General Business';
}
```

### Account Type Mapping
| Account Type | Debit Increases | Credit Increases | Common Examples |
|--------------|----------------|------------------|-----------------|
| **Asset** | ✓ | | Cash, Inventory, Equipment |
| **Liability** | | ✓ | Loans, Credit Cards, A/P |
| **Equity** | | ✓ | Owner's Equity, Retained Earnings |
| **Income** | | ✓ | Sales, Services, Interest |
| **Expense** | ✓ | | Rent, Salaries, Supplies |
| **COGS** | ✓ | | Raw Materials, Direct Labor |
