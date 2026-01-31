-- Schema untuk License Server System
-- SQLite version

-- Admin Table
CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- License Table
CREATE TABLE IF NOT EXISTS license (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_key TEXT UNIQUE NOT NULL,
    max_domains INTEGER NOT NULL DEFAULT 1,
    expire_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'expired')),
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Domain Table
CREATE TABLE IF NOT EXISTS domain (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_id INTEGER NOT NULL,
    domain TEXT NOT NULL,
    last_check_at TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (license_id) REFERENCES license(id) ON DELETE CASCADE,
    UNIQUE(license_id, domain)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_license_key ON license(license_key);
CREATE INDEX IF NOT EXISTS idx_license_status ON license(status);
CREATE INDEX IF NOT EXISTS idx_domain_license_id ON domain(license_id);
CREATE INDEX IF NOT EXISTS idx_domain_domain ON domain(domain);
