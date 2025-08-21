import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { aiService } from '@/lib/ai/service';
import { aiRequestSchema } from '@/types/ai';
import { z } from 'zod';

const analyzeJobSchema = z.object({
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters'),
  planType: z.enum(['FREE', 'PREMIUM', 'ENTERPRISE']).optional().default('FREE'),
});

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const validatedData = analyzeJobSchema.parse(body);

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is not configured' },
        { status: 503 }
      );
    }

    // Analyze job description
    const analysis = await aiService.analyzeJobDescription(
      validatedData.jobDescription,
      session.user.id,
      validatedData.planType
    );

    if (!analysis.success) {
      return NextResponse.json(
        { error: analysis.error },
        { status: analysis.error?.includes('limit') ? 429 : 500 }
      );
    }

    // Add rate limit headers
    const rateLimitHeaders = await aiService.getRateLimitHeaders(
      session.user.id,
      validatedData.planType
    );

    return NextResponse.json(
      {
        success: true,
        data: analysis.data,
        usage: analysis.usage,
        model: analysis.model,
      },
      {
        status: 200,
        headers: rateLimitHeaders,
      }
    );

  } catch (error) {
    console.error('Job analysis API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Get usage statistics for the current user
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const usage = await aiService.getCurrentUsage(session.user.id);
    const stats = await aiService.getUserUsageStats(session.user.id);
    const warnings = await aiService.checkUsageWarnings(session.user.id);

    return NextResponse.json({
      usage,
      stats,
      warnings,
    });

  } catch (error) {
    console.error('Usage stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to get usage statistics' },
      { status: 500 }
    );
  }
}