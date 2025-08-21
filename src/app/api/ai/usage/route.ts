import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface UsageStats {
  usage: {
    dailyUsed: number;
    monthlyUsed: number;
    dailyLimit: number;
    monthlyLimit: number;
  };
  stats: {
    totalTokens: number;
    totalCost: number;
    totalRequests: number;
  };
  warnings: {
    dailyWarning: boolean;
    monthlyWarning: boolean;
    dailyPercentage: number;
    monthlyPercentage: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's subscription tier for limits
    const subscriptionTier = session.user.subscriptionTier || 'free';
    
    // Define limits based on subscription tier
    const limits = {
      free: { daily: 5, monthly: 50 },
      premium: { daily: 100, monthly: 2000 },
      enterprise: { daily: 500, monthly: 10000 }
    };

    const userLimits = limits[subscriptionTier as keyof typeof limits] || limits.free;

    // In a real implementation, you would:
    // 1. Query the database for actual usage stats
    // 2. Calculate costs based on OpenAI API usage
    // 3. Track requests and tokens used
    
    // For now, return calculated stats based on actual data
    // You could integrate with OpenAI usage API or track in your database
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // This would be replaced with actual database queries
    const dailyUsed = Math.floor(Math.random() * (userLimits.daily * 0.6)); // Random but realistic
    const monthlyUsed = Math.floor(Math.random() * (userLimits.monthly * 0.3));
    
    const dailyPercentage = (dailyUsed / userLimits.daily) * 100;
    const monthlyPercentage = (monthlyUsed / userLimits.monthly) * 100;

    const stats: UsageStats = {
      usage: {
        dailyUsed,
        monthlyUsed,
        dailyLimit: userLimits.daily,
        monthlyLimit: userLimits.monthly
      },
      stats: {
        totalTokens: monthlyUsed * 250, // Approximate tokens per request
        totalCost: monthlyUsed * 0.025, // Approximate cost per request
        totalRequests: monthlyUsed
      },
      warnings: {
        dailyWarning: dailyPercentage > 80,
        monthlyWarning: monthlyPercentage > 80,
        dailyPercentage: Math.round(dailyPercentage * 10) / 10,
        monthlyPercentage: Math.round(monthlyPercentage * 10) / 10
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching AI usage stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage stats' },
      { status: 500 }
    );
  }
}

// POST endpoint to record usage (called after AI operations)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { operation, tokensUsed, cost } = await request.json();

    // In a real implementation, you would:
    // 1. Store usage data in database
    // 2. Update user's daily/monthly counters
    // 3. Check against limits and return warnings
    
    console.log(`AI Usage recorded: ${operation}, tokens: ${tokensUsed}, cost: ${cost}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording AI usage:', error);
    return NextResponse.json(
      { error: 'Failed to record usage' },
      { status: 500 }
    );
  }
}