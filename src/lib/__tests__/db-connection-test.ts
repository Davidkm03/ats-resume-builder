#!/usr/bin/env tsx

// Test database utilities without importing prisma client
// This avoids the DATABASE_URL requirement for structure testing

async function testDatabaseUtilities() {
  console.log('🔄 Testing database utilities structure...\n');

  try {
    // Test 1: Check Prisma schema file exists and is valid
    console.log('1. Testing Prisma schema...');
    const fs = require('fs');
    const path = require('path');
    
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    if (!fs.existsSync(schemaPath)) {
      throw new Error('Prisma schema file not found');
    }
    
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const requiredModels = ['User', 'CV', 'Template', 'UserSession', 'AIUsage'];
    
    for (const model of requiredModels) {
      if (!schemaContent.includes(`model ${model}`)) {
        throw new Error(`Model ${model} not found in schema`);
      }
    }
    console.log(`   ✅ All required models found in schema: ${requiredModels.join(', ')}\n`);

    // Test 2: Check seed file exists
    console.log('2. Testing seed file...');
    const seedPath = path.join(process.cwd(), 'prisma', 'seed.ts');
    if (!fs.existsSync(seedPath)) {
      throw new Error('Seed file not found');
    }
    
    const seedContent = fs.readFileSync(seedPath, 'utf8');
    if (!seedContent.includes('templates') || !seedContent.includes('prisma.template.upsert')) {
      throw new Error('Seed file does not contain template seeding logic');
    }
    console.log('   ✅ Seed file exists and contains template data\n');

    // Test 3: Check database utility files exist
    console.log('3. Testing utility files...');
    const utilFiles = [
      'src/lib/prisma.ts',
      'src/lib/db-utils.ts',
      'src/lib/db-init.ts'
    ];
    
    for (const file of utilFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Utility file ${file} not found`);
      }
    }
    console.log(`   ✅ All utility files exist: ${utilFiles.join(', ')}\n`);

    // Test 4: Check package.json scripts
    console.log('4. Testing package.json scripts...');
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredScripts = ['db:generate', 'db:push', 'db:migrate', 'db:studio', 'db:seed'];
    for (const script of requiredScripts) {
      if (!packageContent.scripts[script]) {
        throw new Error(`Script ${script} not found in package.json`);
      }
    }
    console.log(`   ✅ All database scripts configured: ${requiredScripts.join(', ')}\n`);

    console.log('🎉 All database structure tests passed!');
    console.log('📝 Database schema, utilities, and configuration are properly set up');
    console.log('🚀 To use with a real database:');
    console.log('   1. Set up PostgreSQL locally or use a cloud provider');
    console.log('   2. Update DATABASE_URL in .env.local');
    console.log('   3. Run: npm run db:migrate');
    console.log('   4. Run: npm run db:seed');
    
  } catch (error) {
    console.error('❌ Database structure test failed:', error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDatabaseUtilities();
}

export default testDatabaseUtilities;