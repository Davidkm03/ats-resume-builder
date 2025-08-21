import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/prisma';

export async function GET() {
  try {
    // Skip database check during build
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          database: 'not-configured',
          api: 'running'
        },
        message: 'Health check skipped during build'
      });
    }

    const dbHealth = await checkDatabaseHealth();
    
    const response = {
      status: dbHealth.status === 'healthy' ? 'ok' : 'error',
      timestamp: dbHealth.timestamp.toISOString(),
      services: {
        database: dbHealth.status === 'healthy' ? 'connected' : 'disconnected',
        api: 'running'
      },
      details: {
        database: {
          status: dbHealth.status,
          message: dbHealth.message,
          timestamp: dbHealth.timestamp.toISOString()
        }
      }
    };
    
    return NextResponse.json(
      response,
      { status: dbHealth.status === 'healthy' ? 200 : 500 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          database: 'error',
          api: 'running'
        },
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}