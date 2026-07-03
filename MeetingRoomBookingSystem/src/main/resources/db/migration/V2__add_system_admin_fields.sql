-- Add System Admin tracking fields to users table
ALTER TABLE users ADD COLUMN is_system_admin BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN created_by BIGINT DEFAULT NULL;

-- Mark the first admin (admin@company.com) as System Admin
UPDATE users SET is_system_admin = true WHERE email = 'admin@company.com' LIMIT 1;

-- Add foreign key for created_by (optional, for audit trail)
-- ALTER TABLE users ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id);
