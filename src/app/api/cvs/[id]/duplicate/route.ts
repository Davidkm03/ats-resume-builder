import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { DatabaseUtils, NotFoundError, DatabaseError } from '@/lib/db-utils';
import { duplicateCVRequestSchema } from '@/lib/cv';

interface RouteParams {
  params: {
    id: string;
  };
}

// POST /api/cvs/[id]/duplicate - Duplicate a CV
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = duplicateCVRequestSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid duplication data',
            details: validatedData.error.errors,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    const { name, description } = validatedData.data;

    // Duplicate CV with ownership verification
    const duplicatedCV = await DatabaseUtils.duplicateCV(id, session.user.id, name);

    // Update description if provided
    let finalCV = duplicatedCV;
    if (description !== undefined) {
      finalCV = await DatabaseUtils.updateCV(duplicatedCV.id, session.user.id, {
        description,
      });
    }

    return NextResponse.json(
      {
        cv: {
          id: finalCV.id,
          userId: finalCV.userId,
          name: finalCV.name,
          description: finalCV.description,
          template: finalCV.template,
          data: finalCV.data,
          isPublic: finalCV.isPublic,
          shareToken: finalCV.shareToken,
          createdAt: finalCV.createdAt.toISOString(),
          updatedAt: finalCV.updatedAt.toISOString(),
        },
        message: 'CV duplicated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error duplicating CV:', error);

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
          message: 'Failed to duplicate CV',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}