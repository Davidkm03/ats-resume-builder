#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying ATS Resume Builder setup...\n');

const checks = [
  {
    name: 'Next.js configuration',
    check: () => fs.existsSync('next.config.js'),
    fix: 'Run the setup script again'
  },
  {
    name: 'TypeScript configuration',
    check: () => fs.existsSync('tsconfig.json'),
    fix: 'Run the setup script again'
  },
  {
    name: 'Tailwind CSS configuration',
    check: () => fs.existsSync('tailwind.config.js'),
    fix: 'Run the setup script again'
  },
  {
    name: 'Prisma schema',
    check: () => fs.existsSync('prisma/schema.prisma'),
    fix: 'Run the setup script again'
  },
  {
    name: 'Environment variables',
    check: () => fs.existsSync('.env.local'),
    fix: 'Copy .env.example to .env.local and configure'
  },
  {
    name: 'Package.json',
    check: () => {
      try {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        return pkg.dependencies && pkg.dependencies.next;
      } catch {
        return false;
      }
    },
    fix: 'Run npm install'
  },
  {
    name: 'Node modules',
    check: () => fs.existsSync('node_modules'),
    fix: 'Run npm install'
  },
  {
    name: 'Prisma client',
    check: () => fs.existsSync('node_modules/.prisma/client'),
    fix: 'Run npx prisma generate'
  },
  {
    name: 'Source directory structure',
    check: () => fs.existsSync('src/app') && fs.existsSync('src/lib') && fs.existsSync('src/types'),
    fix: 'Run the setup script again'
  }
];

let allPassed = true;

checks.forEach(({ name, check, fix }) => {
  const passed = check();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${name}`);
  
  if (!passed) {
    console.log(`   Fix: ${fix}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All checks passed! Your setup is ready.');
  console.log('\n📋 Next steps:');
  console.log('1. Configure your environment variables in .env.local');
  console.log('2. Set up your PostgreSQL database');
  console.log('3. Run "npm run dev" to start development');
  console.log('4. Visit http://localhost:3000');
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above.');
  process.exit(1);
}

console.log('\n🚀 Happy coding!');