import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { premiumAIService } from '@/lib/ai/premium-service';
import { z } from 'zod';

const industryAnalysisSchema = z.object({
  industry: z.string().min(2, 'Industry is required'),
  role: z.string().min(2, 'Role is required'),
  experience: z.string().min(2, 'Experience level is required'),
  location: z.string().optional(),
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
    const validatedData = industryAnalysisSchema.parse(body);

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is not configured' },
        { status: 503 }
      );
    }

    // TODO: Check user's subscription plan
    // For now, we'll assume they have premium access
    // In production, validate subscription status against database

    // Extract plan type and remove it from the request data
    const { planType, ...analysisRequest } = validatedData;

    // Perform industry analysis
    const result = await premiumAIService.analyzeIndustry(
      analysisRequest,
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
    console.error('Industry analysis API error:', error);

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