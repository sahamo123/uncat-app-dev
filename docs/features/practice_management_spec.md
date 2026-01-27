# DaxHive: AI-First Practice Management Platform Specification

## Vision
Transform DaxHive from just an "Auto-Categorizer" into a complete **AI Operating System for Accounting Firms**. It connects Data (QBO), Communication (Email/SMS/Chat), and Intelligence (RAG) into one seamless workflow.

---

## Part 1: Core Features Breakdown

### 1. Uncategorized Transaction Management (The Core)
- **Two-Way QBO Sync**: Auto-fetch transactions where `Account = Uncategorized Expense/Asset` or `Ask My Accountant`.
- **Hybrid AI Logic**:
  1. **RAG Search**: Check past client history for this vendor.
  2. **LLM Reasoning**: If no history, use Chain-of-Thought (Vendor name, industry, amount).
  3. **Prediction**: Suggest category with Confidence Score.

### 2. Client Portal & Collaboration ("The Ask")
- **Magic Links**: Send clients a secure link to review their specific uncategorized items (no login required for simple reviews).
- **Intelligent Interview UI**: Gamified "Tinder-style" card interface.
    - **Decision Tree Logic**:
        - *Step 1*: "Is this $5,000 deposit **Income** or a **Loan**?"
        - *Step 2 (if Loan)*: "Is it a **Private Loan** or **Bank Loan**?"
        - *Step 3 (if Private)*: "Do you have a Promissory Note?" -> **Action**: Create "Task" to upload document.
    - **Max 3 Steps**: If logic isn't resolved in 3 questions, auto-flag for "Manual Review" to avoid fatigue.
    - **Undo Button**: "Oops" button to reverse the last swipe/decision.
- **Asset/Liability Logic**: specialized flows for high-value items (e.g., "Is this new Equipment > $2,500?").

### 3. Analytics & Business Insights
- **KPI Dashboard**: Real-time metrics from QBO (Cash Flow, A/R Aging, Profit Margin).
- **Advisory Mode**: AI analyzes trends (e.g., "Marketing spend up 20% vs last month, but Revenue flat").

### 4. Hybrid RAG (The "Brain") 🧠
- **Scope**: Per-Client RAG.
- **Data Sources**:
  - Transactions (QBO)
  - Documents (PDFs, Receipts)
  - Emails/Chat Logs
  - Meeting Transcripts
- **Adaptive Learning**: Every human correction updates the Vector Database *instantly*. The model gets smarter with every click.

### 5. Omni-Channel Communication
- **SMS (Twilio)**: "Hey, you have 3 urgent items to review." -> User replies text -> RAG processes it.
- **Email (SendGrid/AWS SES)**: Automated reminders, weekly digests.
- **Chat (Realtime)**: Internal firm chat + Client-facing chat (Slack-style interface).

### 6. Vendor & 1099 Management
- **Vendor Sync**: Pull all vendors from QBO.
- **W-9 Collection**: Automate "Request W-9" email to vendors.
- **1099 Prep**: Tag transactions as "1099 Eligible", track threshold ($600), ready for filing.

### 7. Scheduling & Meetings
- **Google Calendar Sync**: Two-way sync for client meetings.
- **AI Note Taker Integration**:
  - Ingest public URLs from Otter/Firefly/Fathom.
  - **RAG Ingestion**: Transcript becomes searchable memory ("Client mentioned they bought a strict in the meeting").

---

## Part 2: Technical Architecture for Scale (Millions of Users)

### A. File System Architecture (Scalable)
**Problem**: Storing millions of receipts, transcripts, and W-9s.
**Solution**: **Object Storage (S3) + CDN**.

1.  **Storage Provider**: AWS S3 (industry standard) or Supabase Storage (S3 wrapper).
2.  **Structure**:
    ```text
    /tenants
      /{tenant_id}
        /clients
          /{client_id}
            /documents      <-- PDFs, Receipts
            /transcripts    <-- Meeting logs
            /w9s            <-- Vendor tax forms
    ```
3.  **RAG Pipeline**:
    - **Upload** -> Trigger Serverless Function.
    - **OCR**: Extract text (Amazon Textract or OpenAI Vision).
    - **Embed**: Generate Vectors (OpenAI `text-embedding-3`).
    - **Store**: Save to Qdrant/pgvector collection `client_{id}`.
    - **Query**: "Find the invoice for that $5k apple purchase" -> Searches vectors.

### B. Email Architecture (The Hard Part)
**Problem**: Integrating *their* email (reading/sending) at scale.
**Solution**: **Nylas** or **Aurinko** (Unified APIs) vs **AWS SES** (Raw).

*Recommendation for Practice Management:*
-   **Sending (System)**: Use **Resend** or **AWS SES**. High deliverability for notifications.
-   **Syncing (User Inbox)**: Use **Nylas** (expensive but easiest) or **Microsoft Graph API / Gmail API** (harder dev, cheaper).
    -   *MVP Strategy*: Don't build a full email client yet. Start with "System Notifications" and "Reply-to-Log" (emails sent to `receipts@daxhive.com` get auto-logged).

### C. Chat Architecture (Realtime)
**Tech Stack**: Supabase Realtime (WebSockets).
-   **Channels**:
    -   `room_internal_{firm_id}`
    -   `room_client_{client_id}`
-   **Persistence**: All messages stored in Postgres.
-   **RAG Connection**: Every message is embedded. You can ask "What did John ask about the truck purchase last month?"

---

## Part 3: Updated Data Model (Schema Additions)

```sql
-- Communication Logs (Email/SMS/Chat)
CREATE TABLE communication_logs (
    id UUID PRIMARY KEY,
    tenant_id UUID,
    client_id UUID,
    type VARCHAR, -- 'email', 'sms', 'chat', 'meeting_transcript'
    sender VARCHAR,
    content TEXT,
    embedding VECTOR(1536), -- Make communication searchable!
    timestamp TIMESTAMP
);

-- Vendor 1099 Tracking
CREATE TABLE vendor_compliance (
    vendor_id VARCHAR, -- from QBO
    tenant_id UUID,
    w9_status VARCHAR, -- 'requested', 'received', 'verified'
    total_paid_ytd DECIMAL,
    eligible_1099 BOOLEAN
);

-- Integrations (Calendar, Notetakers)
CREATE TABLE integrations (
    id UUID PRIMARY KEY,
    user_id UUID,
    provider VARCHAR, -- 'google_calendar', 'otter', 'twilio'
    access_token TEXT, -- Encrypted
    settings JSONB
);
```

---

## Part 4: UI Implications (Design Update)

We need a **"Command Center"** layout, not just a dashboard.

1.  **Sidebar**:
    -   **Inbox**: Unified (Chat + Email + SMS).
    -   **Clients**: List of connected files.
    -   **Tasks**: Uncategorized transactions, 1099 reqs.
    -   **Intelligence**: Ask RAG ("Draft an email to Bob about his high travel expenses").
    
2.  **Split View (Transaction Review)**:
    -   **Left**: The Transaction (Vendor, Amount).
    -   **Right**: **"The Context"** (RAG results: Past bills, similar transactions, related emails, chat logs).

3.  **Client Portal (Mobile First)**:
    -   Since clients answer queries on almost exclusively mobile, the "Ask" interface must be a Tinder-style swipe or simplistic chat interface.
