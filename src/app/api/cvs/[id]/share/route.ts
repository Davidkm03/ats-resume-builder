import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { DatabaseUtils, NotFoundError, DatabaseError } from '@/lib/db-utils';
import { generateShareToken } from '@/lib/cv';

interface RouteParams {
  params: {
    id: string;
  };
}

// POST /api/cvs/[id]/share - Generate or regenerate share token
export async function POST(request: NextRequest, { params }: RouteParams) {
  // Apply rate limiting
  const rateLimitResponse = await withRateLimit(request, 'api');
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 401 }
      );
    }

    const { id } = params;

    // Generate share token and make CV public
    const shareToken = generateShareToken();
    const updatedCV = await DatabaseUtils.updateCV(id, session.user.id, {
      shareToken,
      isPublic: true,
    });

    const shareUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/cv/shared/${shareToken}`;

    return NextResponse.json({
      shareToken,
      shareUrl,
      cv: {
        id: updatedCV.id,
        name: updatedCV.name,
        isPublic: updatedCV.isPublic,
        shareToken: updatedCV.shareToken,
      },
      message: 'Share link generated successfully',
    });
  } catch (error) {
    console.error('Error generating share link:', error);

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'CV not found',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }

    if (error instanceof DatabaseError && error.message.includes('Access denied')) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Access denied',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate share link',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/cvs/[id]/share - Remove share token (make CV private)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  // Apply rate limiting
  const rateLimitResponse = await withRateLimit(request, 'api');
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 401 }
      );
    }

    const { id } = params;

    // Remove share token and make CV private
    const updatedCV = await DatabaseUtils.updateCV(id, session.user.id, {
      shareToken: null,
      isPublic: false,
    });

    return NextResponse.json({
      cv: {
        id: updatedCV.id,
        name: updatedCV.name,
        isPublic: updatedCV.isPublic,
        shareToken: updatedCV.shareToken,
      },
      message: 'Share link removed successfully',
    });
  } catch (error) {
    console.error('Error removing share link:', error);

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'CV not found',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }

    if (error instanceof DatabaseError && error.message.includes('Access denied')) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Access denied',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to remove share link',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}