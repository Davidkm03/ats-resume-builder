import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { premiumAIService } from '@/lib/ai/premium-service';
import { z } from 'zod';

const coverLetterSchema = z.object({
  cvData: z.any(), // CV data object
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters'),
  company: z.string().min(2, 'Company name is required'),
  position: z.string().min(2, 'Position is required'),
  tone: z.enum(['formal', 'casual', 'enthusiastic']).default('formal'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  planType: z.enum(['PREMIUM', 'ENTERPRISE']).default('PREMIUM'),
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
    const validatedData = coverLetterSchema.parse(body);

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is not configured' },
        { status: 503 }
      );
    }

    // TODO: Check user's subscription plan
    // For now, we'll assume they have premium access

    // Extract plan type and remove it from the request data
    const { planType, ...coverLetterRequest } = validatedData;

    // Generate cover letter
    const result = await premiumAIService.generateCoverLetter(
      coverLetterRequest,
      session.user.id,
      planType
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.includes('premium') ? 403 : 
                   result.error?.includes('limit') ? 429 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      usage: result.usage,
      model: result.model,
    });

  } catch (error) {
    console.error('Cover letter generation API error:', error);

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