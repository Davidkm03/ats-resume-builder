import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Test database connection
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Test user query
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionTier: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      status: 'success',
      database: {
        connected: true,
        test: dbTest,
        userCount: users.length,
        users: users
      },
      environment: {
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
        nextauthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
        nextauthUrl: process.env.NEXTAUTH_URL || 'Not set'
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
        nextauthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
        nextauthUrl: process.env.NEXTAUTH_URL || 'Not set'
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found',
        debug: { email, userExists: false }
      }, { status: 404 });
    }

    // Test password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    return NextResponse.json({
      status: 'success',
      debug: {
        email,
        userExists: true,
        passwordValid: isValid,
        userId: user.id,
        userName: user.name
      }
    });

  } catch (error) {
    console.error('Debug POST error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
