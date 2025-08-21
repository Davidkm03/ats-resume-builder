import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { aiService } from '@/lib/ai/service';
import { z } from 'zod';

const generateBulletsSchema = z.object({
  jobTitle: z.string().min(2, 'Job title is required'),
  company: z.string().min(2, 'Company name is required'),
  industry: z.string().min(2, 'Industry is required'),
  responsibilities: z.array(z.string()).min(1, 'At least one responsibility is required'),
  achievements: z.array(z.string()).min(1, 'At least one achievement is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  context: z.string().optional(),
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
    const validatedData = generateBulletsSchema.parse(body);

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is not configured' },
        { status: 503 }
      );
    }

    // Extract plan type and remove it from the request data
    const { planType, ...bulletRequest } = validatedData;

    // Generate bullet points
    const result = await aiService.generateBulletPoints(
      bulletRequest,
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
    console.error('Bullet generation API error:', error);

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