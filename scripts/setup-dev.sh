#!/bin/bash

echo "🚀 Setting up ATS Resume Builder development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Installing via Homebrew..."
    if command -v brew &> /dev/null; then
        brew install postgresql@14
        brew services start postgresql@14
    else
        echo "❌ Please install PostgreSQL 14+ manually"
        exit 1
    fi
fi

# Create database if it doesn't exist
echo "📊 Setting up database..."
createdb ats_resume_builder 2>/dev/null || echo "Database already exists"

# Update DATABASE_URL in .env.local
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' 's|DATABASE_URL="postgresql://localhost:5432/ats_resume_builder"|DATABASE_URL="postgresql://localhost:5432/ats_resume_builder"|g' .env.local
else
    # Linux
    sed -i 's|DATABASE_URL="postgresql://localhost:5432/ats_resume_builder"|DATABASE_URL="postgresql://localhost:5432/ats_resume_builder"|g' .env.local
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️  Setting up database schema..."
npx prisma db push

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Configure your API keys in .env.local (optional for basic functionality)"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to see your application"
echo ""
echo "📚 Available commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run db:studio    - Open Prisma Studio"
echo "  npm run lint         - Run ESLint"