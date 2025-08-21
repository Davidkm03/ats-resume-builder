import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { DatabaseUtils, NotFoundError, DatabaseError } from '@/lib/db-utils';
import {
  updateCVRequestSchema,
  validateAndSanitizeCVData,
  transformCVDataForStorage,
  mergeCVData,
} from '@/lib/cv';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/cvs/[id] - Get specific CV
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    // Get CV with ownership verification
    const cv = await DatabaseUtils.findCVById(id, session.user.id);

    return NextResponse.json({
      cv: {
        id: cv.id,
        userId: cv.userId,
        name: cv.name,
        description: cv.description,
        template: cv.template,
        data: cv.data,
        isPublic: cv.isPublic,
        shareToken: cv.shareToken,
        createdAt: cv.createdAt.toISOString(),
        updatedAt: cv.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching CV:', error);

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
          message: 'Failed to fetch CV',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

// PUT /api/cvs/[id] - Update specific CV
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
    const validatedData = updateCVRequestSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid update data',
            details: validatedData.error.errors,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    const { name, description, template, data, isPublic } = validatedData.data;

    // Get existing CV to merge data
    const existingCV = await DatabaseUtils.findCVById(id, session.user.id);

    // Prepare update data
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (template !== undefined) updateData.template = template;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    // Handle CV data updates
    if (data) {
      try {
        const existingCVData = validateAndSanitizeCVData(existingCV.data);
        const mergedData = mergeCVData(existingCVData, data);
        const storageData = transformCVDataForStorage(mergedData);
        updateData.data = storageData;
      } catch (error) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid CV data structure',
              details: error instanceof Error ? error.message : 'Unknown validation error',
              timestamp: new Date().toISOString(),
            },
          },
          { status: 400 }
        );
      }
    }

    // Update CV in database
    const updatedCV = await DatabaseUtils.updateCV(id, session.user.id, updateData);

    return NextResponse.json({
      cv: {
        id: updatedCV.id,
        userId: updatedCV.userId,
        name: updatedCV.name,
        description: updatedCV.description,
        template: updatedCV.template,
        data: updatedCV.data,
        isPublic: updatedCV.isPublic,
        shareToken: updatedCV.shareToken,
        createdAt: updatedCV.createdAt.toISOString(),
        updatedAt: updatedCV.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating CV:', error);

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
          message: 'Failed to update CV',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/cvs/[id] - Delete specific CV
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

    // Delete CV with ownership verification
    await DatabaseUtils.deleteCV(id, session.user.id);

    return NextResponse.json(
      {
        message: 'CV deleted successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting CV:', error);

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
          message: 'Failed to delete CV',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}