import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/service';

export async function GET(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          status: 'unhealthy',
          error: 'OpenAI API key not configured',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    // Perform health check
    const health = await aiService.healthCheck();

    const statusCode = health.status === 'healthy' ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });

  } catch (error) {
    console.error('AI health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}