-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'free',
    "subscriptionExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create cvs table
CREATE TABLE IF NOT EXISTS "cvs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "template" TEXT NOT NULL DEFAULT 'modern',
    "data" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cvs_pkey" PRIMARY KEY ("id")
);

-- Create templates table
CREATE TABLE IF NOT EXISTS "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "previewUrl" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "config" JSONB NOT NULL,
    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- Create ai_usage table
CREATE TABLE IF NOT EXISTS "ai_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_usage_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "cvs_shareToken_key" ON "cvs"("shareToken");

-- Create regular indexes
CREATE INDEX IF NOT EXISTS "cvs_userId_idx" ON "cvs"("userId");
CREATE INDEX IF NOT EXISTS "user_sessions_userId_idx" ON "user_sessions"("userId");
CREATE INDEX IF NOT EXISTS "ai_usage_userId_idx" ON "ai_usage"("userId");

-- Add foreign key constraints
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert default templates
INSERT INTO "templates" ("id", "name", "description", "isPremium", "category", "config") VALUES
('modern', 'Modern Professional', 'Clean and modern design perfect for tech professionals', false, 'professional', '{"colors": {"primary": "#2563eb", "secondary": "#64748b"}, "fonts": {"heading": "Inter", "body": "Inter"}}'),
('classic', 'Classic Elegant', 'Traditional and elegant layout for conservative industries', false, 'traditional', '{"colors": {"primary": "#1f2937", "secondary": "#6b7280"}, "fonts": {"heading": "Georgia", "body": "Georgia"}}'),
('creative', 'Creative Bold', 'Eye-catching design for creative professionals', true, 'creative', '{"colors": {"primary": "#7c3aed", "secondary": "#a78bfa"}, "fonts": {"heading": "Poppins", "body": "Open Sans"}}'),
('minimal', 'Minimal Clean', 'Ultra-clean minimalist design', false, 'minimal', '{"colors": {"primary": "#000000", "secondary": "#666666"}, "fonts": {"heading": "Helvetica", "body": "Helvetica"}}'),
('executive', 'Executive Premium', 'Premium design for senior executives', true, 'executive', '{"colors": {"primary": "#991b1b", "secondary": "#dc2626"}, "fonts": {"heading": "Times New Roman", "body": "Times New Roman"}}'),
('tech', 'Tech Savvy', 'Modern tech-focused design with accent colors', false, 'tech', '{"colors": {"primary": "#059669", "secondary": "#10b981"}, "fonts": {"heading": "Roboto", "body": "Roboto"}}'),
('academic', 'Academic Scholar', 'Professional academic and research focused', false, 'academic', '{"colors": {"primary": "#1e40af", "secondary": "#3b82f6"}, "fonts": {"heading": "Times New Roman", "body": "Times New Roman"}}'),
('startup', 'Startup Dynamic', 'Dynamic design for startup professionals', true, 'startup', '{"colors": {"primary": "#ea580c", "secondary": "#fb923c"}, "fonts": {"heading": "Inter", "body": "Inter"}}')
ON CONFLICT ("id") DO NOTHING;
