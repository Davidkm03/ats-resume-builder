import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { aiService } from '@/lib/ai/service';
import { z } from 'zod';

const analyzeATSSchema = z.object({
  cvContent: z.string().min(100, 'CV content must be at least 100 characters'),
  jobDescription: z.string().optional(),
  targetKeywords: z.array(z.string()).optional(),
  industry: z.string().optional(),
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
    const validatedData = analyzeATSSchema.parse(body);

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is not configured' },
        { status: 503 }
      );
    }

    // Extract plan type and remove it from the request data
    const { planType, ...atsRequest } = validatedData;

    // Perform ATS analysis
    const result = await aiService.analyzeATS(
      atsRequest,
      session.user.id,
      planType
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.includes('limit') ? 429 : 500 }
      );
    }

    // Add rate limit headers
    const rateLimitHeaders = await aiService.getRateLimitHeaders(
      session.user.id,
      planType
    );

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        usage: result.usage,
        model: result.model,
      },
      {
        status: 200,
        headers: rateLimitHeaders,
      }
    );

  } catch (error) {
    console.error('ATS analysis API error:', error);

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