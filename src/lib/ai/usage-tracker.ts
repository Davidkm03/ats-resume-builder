import { UsageLimit, TokenUsage, PlanType, USAGE_LIMITS } from '@/types/ai';
import { enhancedRedis as redis } from '@/lib/redis';

export class UsageTracker {
  private static instance: UsageTracker;

  private constructor() {}

  static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  /**
   * Check if user can make a request
   */
  async canMakeRequest(
    userId: string, 
    requestedTokens: number,
    planType: PlanType = 'FREE'
  ): Promise<{ allowed: boolean; reason?: string; resetTime?: Date }> {
    try {
      const currentUsage = await this.getCurrentUsage(userId);
      const limits = USAGE_LIMITS[planType];
      
      // Check daily limit
      if (currentUsage.dailyUsed + requestedTokens > limits.daily) {
        return {
          allowed: false,
          reason: 'Daily token limit exceeded',
          resetTime: this.getNextResetTime('daily'),
        };
      }

      // Check monthly limit
      if (currentUsage.monthlyUsed + requestedTokens > limits.monthly) {
        return {
          allowed: false,
          reason: 'Monthly token limit exceeded',
          resetTime: this.getNextResetTime('monthly'),
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Usage check failed:', error);
      // Fail open for availability
      return { allowed: true };
    }
  }

  /**
   * Record token usage
   */
  async recordUsage(
    userId: string,
    usage: TokenUsage,
    metadata: {
      model: string;
      feature: string;
      requestId?: string;
    }
  ): Promise<void> {
    try {
      const now = new Date();
      const dailyKey = `usage:daily:${userId}:${this.getDateKey(now)}`;
      const monthlyKey = `usage:monthly:${userId}:${this.getMonthKey(now)}`;
      
      // Use Redis pipeline for atomic operations
      const pipeline = redis.pipeline();
      
      // Update daily usage
      pipeline.hincrby(dailyKey, 'tokens', usage.totalTokens);
      pipeline.hincrbyfloat(dailyKey, 'cost', usage.cost);
      pipeline.hincrby(dailyKey, 'requests', 1);
      pipeline.expire(dailyKey, 86400 * 2); // Expire after 2 days
      
      // Update monthly usage
      pipeline.hincrby(monthlyKey, 'tokens', usage.totalTokens);
      pipeline.hincrbyfloat(monthlyKey, 'cost', usage.cost);
      pipeline.hincrby(monthlyKey, 'requests', 1);
      pipeline.expire(monthlyKey, 86400 * 35); // Expire after 35 days
      
      // Store detailed usage record
      const usageRecord = {
        userId,
        timestamp: now.toISOString(),
        usage,
        metadata,
      };
      
      pipeline.lpush(
        `usage:history:${userId}`,
        JSON.stringify(usageRecord)
      );
      pipeline.ltrim(`usage:history:${userId}`, 0, 999); // Keep last 1000 records
      
      await pipeline.exec();

      // Update user's usage statistics
      await this.updateUserStats(userId, usage, metadata);
      
    } catch (error) {
      console.error('Failed to record usage:', error);
      // Don't throw - usage tracking should not break the main flow
    }
  }

  /**
   * Get current usage for a user
   */
  async getCurrentUsage(userId: string): Promise<UsageLimit> {
    try {
      const now = new Date();
      const dailyKey = `usage:daily:${userId}:${this.getDateKey(now)}`;
      const monthlyKey = `usage:monthly:${userId}:${this.getMonthKey(now)}`;
      
      const [dailyUsage, monthlyUsage] = await Promise.all([
        redis.hgetall(dailyKey),
        redis.hgetall(monthlyKey),
      ]);

      return {
        userId,
        dailyLimit: USAGE_LIMITS.FREE.daily,
        monthlyLimit: USAGE_LIMITS.FREE.monthly,
        dailyUsed: parseInt(dailyUsage.tokens || '0'),
        monthlyUsed: parseInt(monthlyUsage.tokens || '0'),
        resetTime: this.getNextResetTime('daily'),
      };
    } catch (error) {
      console.error('Failed to get current usage:', error);
      return {
        userId,
        dailyLimit: USAGE_LIMITS.FREE.daily,
        monthlyLimit: USAGE_LIMITS.FREE.monthly,
        dailyUsed: 0,
        monthlyUsed: 0,
        resetTime: this.getNextResetTime('daily'),
      };
    }
  }

  /**
   * Get usage statistics for a user
   */
  async getUsageStats(
    userId: string,
    timeRange: 'day' | 'week' | 'month' = 'month'
  ): Promise<{
    totalTokens: number;
    totalCost: number;
    totalRequests: number;
    averageCostPerRequest: number;
    topFeatures: Array<{ feature: string; tokens: number; cost: number }>;
    dailyBreakdown: Array<{ date: string; tokens: number; cost: number }>;
  }> {
    try {
      const history = await redis.lrange(`usage:history:${userId}`, 0, -1);
      const records = history.map((record: any) => JSON.parse(record));
      
      const now = new Date();
      const cutoffDate = this.getCutoffDate(now, timeRange);
      
      const filteredRecords = records.filter((record: any) => 
        new Date(record.timestamp) >= cutoffDate
      );

      // Calculate aggregated statistics
      const stats = filteredRecords.reduce((acc: any, record: any) => {
        acc.totalTokens += record.usage.totalTokens;
        acc.totalCost += record.usage.cost;
        acc.totalRequests += 1;
        
        // Track feature usage
        const feature = record.metadata.feature;
        if (!acc.featureUsage[feature]) {
          acc.featureUsage[feature] = { tokens: 0, cost: 0 };
        }
        acc.featureUsage[feature].tokens += record.usage.totalTokens;
        acc.featureUsage[feature].cost += record.usage.cost;
        
        // Track daily breakdown
        const date = record.timestamp.split('T')[0];
        if (!acc.dailyBreakdown[date]) {
          acc.dailyBreakdown[date] = { tokens: 0, cost: 0 };
        }
        acc.dailyBreakdown[date].tokens += record.usage.totalTokens;
        acc.dailyBreakdown[date].cost += record.usage.cost;
        
        return acc;
      }, {
        totalTokens: 0,
        totalCost: 0,
        totalRequests: 0,
        featureUsage: {} as Record<string, { tokens: number; cost: number }>,
        dailyBreakdown: {} as Record<string, { tokens: number; cost: number }>,
      });

      // Sort features by token usage
      const topFeatures = Object.entries(stats.featureUsage)
        .map(([feature, usage]: [string, any]) => ({ feature, tokens: usage.tokens, cost: usage.cost }))
        .sort((a, b) => b.tokens - a.tokens)
        .slice(0, 10);

      // Convert daily breakdown to array
      const dailyBreakdown = Object.entries(stats.dailyBreakdown)
        .map(([date, usage]: [string, any]) => ({ date, tokens: usage.tokens, cost: usage.cost }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalTokens: stats.totalTokens,
        totalCost: Math.round(stats.totalCost * 10000) / 10000,
        totalRequests: stats.totalRequests,
        averageCostPerRequest: stats.totalRequests > 0 ? 
          Math.round((stats.totalCost / stats.totalRequests) * 10000) / 10000 : 0,
        topFeatures,
        dailyBreakdown,
      };
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return {
        totalTokens: 0,
        totalCost: 0,
        totalRequests: 0,
        averageCostPerRequest: 0,
        topFeatures: [],
        dailyBreakdown: [],
      };
    }
  }

  /**
   * Check if user is approaching limits
   */
  async checkLimitWarnings(
    userId: string,
    planType: PlanType = 'FREE'
  ): Promise<{
    dailyWarning: boolean;
    monthlyWarning: boolean;
    dailyPercentage: number;
    monthlyPercentage: number;
  }> {
    const usage = await this.getCurrentUsage(userId);
    const limits = USAGE_LIMITS[planType];
    
    const dailyPercentage = Math.round((usage.dailyUsed / limits.daily) * 100);
    const monthlyPercentage = Math.round((usage.monthlyUsed / limits.monthly) * 100);
    
    return {
      dailyWarning: dailyPercentage >= 80,
      monthlyWarning: monthlyPercentage >= 80,
      dailyPercentage,
      monthlyPercentage,
    };
  }

  /**
   * Reset usage for a user (admin function)
   */
  async resetUsage(
    userId: string,
    type: 'daily' | 'monthly' | 'all' = 'all'
  ): Promise<void> {
    try {
      const now = new Date();
      const pipeline = redis.pipeline();
      
      if (type === 'daily' || type === 'all') {
        const dailyKey = `usage:daily:${userId}:${this.getDateKey(now)}`;
        pipeline.del(dailyKey);
      }
      
      if (type === 'monthly' || type === 'all') {
        const monthlyKey = `usage:monthly:${userId}:${this.getMonthKey(now)}`;
        pipeline.del(monthlyKey);
      }
      
      if (type === 'all') {
        pipeline.del(`usage:history:${userId}`);
        pipeline.del(`usage:stats:${userId}`);
      }
      
      await pipeline.exec();
    } catch (error) {
      console.error('Failed to reset usage:', error);
      throw error;
    }
  }

  /**
   * Estimate tokens for text
   */
  estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    // This is a simplified estimation - in production, use tiktoken library
    return Math.ceil(text.length / 4);
  }

  /**
   * Get rate limit info for headers
   */
  async getRateLimitHeaders(
    userId: string,
    planType: PlanType = 'FREE'
  ): Promise<Record<string, string>> {
    const usage = await this.getCurrentUsage(userId);
    const limits = USAGE_LIMITS[planType];
    
    return {
      'X-RateLimit-Limit-Daily': limits.daily.toString(),
      'X-RateLimit-Remaining-Daily': Math.max(0, limits.daily - usage.dailyUsed).toString(),
      'X-RateLimit-Reset-Daily': Math.floor(this.getNextResetTime('daily').getTime() / 1000).toString(),
      'X-RateLimit-Limit-Monthly': limits.monthly.toString(),
      'X-RateLimit-Remaining-Monthly': Math.max(0, limits.monthly - usage.monthlyUsed).toString(),
      'X-RateLimit-Reset-Monthly': Math.floor(this.getNextResetTime('monthly').getTime() / 1000).toString(),
    };
  }

  // Private helper methods

  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private getMonthKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private getNextResetTime(type: 'daily' | 'monthly'): Date {
    const now = new Date();
    if (type === 'daily') {
      const tomorrow = new Date(now);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      return tomorrow;
    } else {
      const nextMonth = new Date(now);
      nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
      nextMonth.setUTCDate(1);
      nextMonth.setUTCHours(0, 0, 0, 0);
      return nextMonth;
    }
  }

  private getCutoffDate(now: Date, timeRange: 'day' | 'week' | 'month'): Date {
    const cutoff = new Date(now);
    switch (timeRange) {
      case 'day':
        cutoff.setDate(cutoff.getDate() - 1);
        break;
      case 'week':
        cutoff.setDate(cutoff.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(cutoff.getMonth() - 1);
        break;
    }
    return cutoff;
  }

  private async updateUserStats(
    userId: string,
    usage: TokenUsage,
    metadata: { model: string; feature: string }
  ): Promise<void> {
    try {
      const statsKey = `usage:stats:${userId}`;
      const pipeline = redis.pipeline();
      
      // Update overall stats
      pipeline.hincrby(statsKey, 'totalTokens', usage.totalTokens);
      pipeline.hincrbyfloat(statsKey, 'totalCost', usage.cost);
      pipeline.hincrby(statsKey, 'totalRequests', 1);
      
      // Update model-specific stats
      pipeline.hincrby(statsKey, `model:${metadata.model}:tokens`, usage.totalTokens);
      pipeline.hincrbyfloat(statsKey, `model:${metadata.model}:cost`, usage.cost);
      
      // Update feature-specific stats
      pipeline.hincrby(statsKey, `feature:${metadata.feature}:tokens`, usage.totalTokens);
      pipeline.hincrbyfloat(statsKey, `feature:${metadata.feature}:cost`, usage.cost);
      
      pipeline.expire(statsKey, 86400 * 90); // Expire after 90 days
      
      await pipeline.exec();
    } catch (error) {
      console.error('Failed to update user stats:', error);
    }
  }
}

export const usageTracker = UsageTracker.getInstance();