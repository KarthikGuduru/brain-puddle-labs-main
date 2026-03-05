PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS inventory (
    key TEXT PRIMARY KEY,
    total INTEGER NOT NULL,
    claimed INTEGER NOT NULL,
    remaining INTEGER NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS claim_submissions (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    full_name_enc TEXT NOT NULL,
    delivery_address_enc TEXT NOT NULL,
    linkedin_slug TEXT,
    linkedin_hash TEXT,
    ai_run_id TEXT,
    ip_hash TEXT,
    ua_hash TEXT,
    status TEXT NOT NULL,
    card_id TEXT,
    email TEXT
);

CREATE INDEX IF NOT EXISTS idx_claim_submissions_created_at
    ON claim_submissions(created_at DESC);

CREATE TABLE IF NOT EXISTS ai_runs (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    input_type TEXT,
    linkedin_slug TEXT,
    linkedin_hash TEXT,
    input_char_count INTEGER,
    score INTEGER,
    tier TEXT,
    analysis_latency_ms INTEGER,
    image_source TEXT,
    share_clicked INTEGER DEFAULT 0,
    r2_object_key TEXT
);

CREATE INDEX IF NOT EXISTS idx_ai_runs_created_at
    ON ai_runs(created_at DESC);

CREATE TABLE IF NOT EXISTS shared_cards (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    ai_run_id TEXT,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    score INTEGER NOT NULL,
    tier TEXT NOT NULL,
    r2_object_key TEXT NOT NULL,
    public_image_url TEXT NOT NULL,
    expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_shared_cards_created_at
    ON shared_cards(created_at DESC);

CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    count INTEGER NOT NULL,
    window_start TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_updated_at
    ON rate_limits(updated_at DESC);
