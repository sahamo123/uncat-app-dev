-- Support for Client Tasks (e.g., "Upload Promissory Note")
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    client_id UUID, -- References the specific client entity
    transaction_id UUID REFERENCES transactions(id), -- Linked transaction (optional)
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status in ('pending', 'completed', 'archived')) DEFAULT 'pending',
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Store the Decision Tree Logic (Configurable per tenant or global)
CREATE TABLE decision_trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trigger_criteria JSONB, -- { "min_amount": 5000, "type": "deposit" }
    nodes JSONB -- The full JSON logic structure (questions, next steps)
);

-- Log of Client Answers (Audit Trail)
CREATE TABLE interview_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id),
    question_asked TEXT,
    answer_given TEXT,
    action_taken TEXT, -- 'categorized', 'task_created', 'flagged'
    timestamp TIMESTAMP DEFAULT NOW()
);
