import { prisma, checkDatabaseHealth } from './prisma';
import { DatabaseUtils } from './db-utils';

/**
 * Initialize database with health checks and cleanup
 */
export async function initializeDatabase() {
  console.log('🔄 Initializing database...');

  try {
    // Check database health
    const health = await checkDatabaseHealth();
    if (health.status !== 'healthy') {
      throw new Error(`Database health check failed: ${health.message}`);
    }
    console.log('✅ Database connection verified');

    // Clean up expired sessions
    const cleanupResult = await DatabaseUtils.cleanupExpiredSessions();
    console.log(`🧹 Cleaned up ${cleanupResult.count} expired sessions`);

    // Verify templates exist
    const templates = await DatabaseUtils.findAllTemplates();
    console.log(`📋 Found ${templates.length} templates`);

    if (templates.length === 0) {
      console.log('⚠️  No templates found. Run `npm run db:seed` to populate templates.');
    }

    console.log('✅ Database initialization completed successfully');
    
    return {
      status: 'success',
      health,
      templatesCount: templates.length,
      cleanedSessions: cleanupResult.count,
    };
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Graceful database shutdown
 */
export async function shutdownDatabase() {
  console.log('🔄 Shutting down database connections...');
  
  try {
    await prisma.$disconnect();
    console.log('✅ Database connections closed gracefully');
  } catch (error) {
    console.error('❌ Error during database shutdown:', error);
    throw error;
  }
}

/**
 * Database maintenance tasks
 */
export async function performDatabaseMaintenance() {
  console.log('🔄 Performing database maintenance...');

  try {
    // Clean up expired sessions
    const sessionCleanup = await DatabaseUtils.cleanupExpiredSessions();
    console.log(`🧹 Cleaned up ${sessionCleanup.count} expired sessions`);

    // Get database statistics
    const stats = await prisma.$queryRaw<Array<{ table_name: string; row_count: bigint }>>`
      SELECT 
        schemaname,
        tablename as table_name,
        n_tup_ins - n_tup_del as row_count
      FROM pg_stat_user_tables 
      ORDER BY n_tup_ins - n_tup_del DESC;
    `;

    console.log('📊 Database statistics:');
    stats.forEach(stat => {
      console.log(`  - ${stat.table_name}: ${stat.row_count} rows`);
    });

    return {
      status: 'success',
      cleanedSessions: sessionCleanup.count,
      tableStats: stats,
    };
  } catch (error) {
    console.error('❌ Database maintenance failed:', error);
    throw error;
  }
}

// Export for use in API routes or scripts
const dbInit = {
  initializeDatabase,
  shutdownDatabase,
  performDatabaseMaintenance,
};

export default dbInit;