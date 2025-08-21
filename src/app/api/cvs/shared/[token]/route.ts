import { NextRequest, NextResponse } from 'next/server';
import { DatabaseUtils, NotFoundError } from '@/lib/db-utils';
import { sanitizeCVForPublicSharing } from '@/lib/cv';

interface RouteParams {
  params: {
    token: string;
  };
}

// GET /api/cvs/shared/[token] - Get shared CV by token (public access)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = params;

    if (!token || token.length < 10) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid share token',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    // Find CV by share token
    const cv = await DatabaseUtils.findCVByShareToken(token);

    // Sanitize CV data for public sharing
    const sanitizedData = sanitizeCVForPublicSharing(cv.data as any);

    return NextResponse.json({
      cv: {
        id: cv.id,
        name: cv.name,
        template: cv.template,
        data: sanitizedData,
        createdAt: cv.createdAt.toISOString(),
        updatedAt: cv.updatedAt.toISOString(),
        owner: cv.user?.name || 'Anonymous',
      },
    });
  } catch (error) {
    console.error('Error fetching shared CV:', error);

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Shared CV not found or no longer available',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch shared CV',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}