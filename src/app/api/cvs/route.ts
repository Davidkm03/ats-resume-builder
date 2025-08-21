import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { DatabaseUtils } from '@/lib/db-utils';
import { prisma } from '@/lib/prisma';
import {
  createCVRequestSchema,
  cvListQuerySchema,
  createDefaultCVData,
  transformCVDataForStorage,
  validateAndSanitizeCVData,
} from '@/lib/cv';
import { CVListResponse } from '@/types/cv';

// GET /api/cvs - List user's CVs
export async function GET(request: NextRequest) {
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

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const validatedQuery = cvListQuerySchema.safeParse(queryParams);
    if (!validatedQuery.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: validatedQuery.error.errors,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    const {
      page = 1,
      limit = 20,
      search,
      template,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
    } = validatedQuery.data;

    const offset = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause: any = {
      userId: session.user.id,
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (template) {
      whereClause.template = template;
    }

    // Get CVs with filtering and pagination
    const [cvs, total] = await Promise.all([
      prisma.cV.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          description: true,
          template: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
          data: true, // Include data to calculate ATS score
        },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
      }),
      prisma.cV.count({ where: whereClause }),
    ]);

    // Transform CVs for response (calculate ATS scores)
    const transformedCVs = cvs.map((cv) => {
      let atsScore: number | undefined;
      try {
        const cvData = validateAndSanitizeCVData(cv.data);
        // You could implement ATS scoring here
        // atsScore = calculateATSScore(cvData);
      } catch {
        // If CV data is invalid, skip ATS score
      }

      return {
        id: cv.id,
        name: cv.name,
        description: cv.description || undefined,
        template: cv.template,
        isPublic: cv.isPublic,
        createdAt: cv.createdAt.toISOString(),
        updatedAt: cv.updatedAt.toISOString(),
        atsScore,
      };
    });

    const response: CVListResponse = {
      cvs: transformedCVs,
      total,
      page,
      limit,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching CVs:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch CVs',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/cvs - Create new CV
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createCVRequestSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid CV data',
            details: validatedData.error.errors,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    const { name, description, template = 'modern', data } = validatedData.data;

    // Create default CV data or use provided data
    let cvData;
    if (data) {
      try {
        cvData = validateAndSanitizeCVData(data);
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
    } else {
      cvData = createDefaultCVData(name, template);
    }

    // Transform data for storage
    const storageData = transformCVDataForStorage(cvData);

    // Create CV in database
    const cv = await DatabaseUtils.createCV({
      userId: session.user.id,
      name,
      description,
      template,
      data: storageData,
    });

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating CV:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create CV',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}