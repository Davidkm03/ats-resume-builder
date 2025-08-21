import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

// Error types for better error handling
export class DatabaseError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends DatabaseError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}

export class DuplicateError extends DatabaseError {
  constructor(resource: string, field: string) {
    super(`${resource} with this ${field} already exists`);
    this.name = 'DuplicateError';
  }
}

// Generic CRUD utilities
export class DatabaseUtils {
  // User utilities
  static async findUserByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email },
        include: {
          cvs: {
            select: {
              id: true,
              name: true,
              template: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to find user by email', error);
    }
  }

  static async findUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          cvs: {
            select: {
              id: true,
              name: true,
              template: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
      
      if (!user) {
        throw new NotFoundError('User', id);
      }
      
      return user;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to find user by id', error);
    }
  }

  static async createUser(data: {
    email: string;
    passwordHash: string;
    name?: string;
  }) {
    try {
      return await prisma.user.create({
        data,
        select: {
          id: true,
          email: true,
          name: true,
          subscriptionTier: true,
          subscriptionExpiresAt: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new DuplicateError('User', 'email');
        }
      }
      throw new DatabaseError('Failed to create user', error);
    }
  }

  static async updateUserSubscription(
    userId: string,
    subscriptionTier: string,
    expiresAt?: Date
  ) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier,
          subscriptionExpiresAt: expiresAt,
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to update user subscription', error);
    }
  }

  // CV utilities
  static async findCVById(id: string, userId?: string) {
    try {
      const cv = await prisma.cV.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!cv) {
        throw new NotFoundError('CV', id);
      }

      // Check ownership if userId is provided
      if (userId && cv.userId !== userId) {
        throw new DatabaseError('Access denied: CV does not belong to user');
      }

      return cv;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof DatabaseError) throw error;
      throw new DatabaseError('Failed to find CV', error);
    }
  }

  static async findUserCVs(userId: string, limit = 50, offset = 0) {
    try {
      const [cvs, total] = await Promise.all([
        prisma.cV.findMany({
          where: { userId },
          select: {
            id: true,
            name: true,
            description: true,
            template: true,
            isPublic: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.cV.count({ where: { userId } }),
      ]);

      return { cvs, total };
    } catch (error) {
      throw new DatabaseError('Failed to find user CVs', error);
    }
  }

  static async createCV(data: {
    userId: string;
    name: string;
    description?: string;
    template?: string;
    data: any;
  }) {
    try {
      return await prisma.cV.create({
        data,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to create CV', error);
    }
  }

  static async updateCV(
    id: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      template?: string;
      data?: any;
      isPublic?: boolean;
      shareToken?: string | null;
    }
  ) {
    try {
      // First verify ownership
      await this.findCVById(id, userId);

      return await prisma.cV.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof DatabaseError) throw error;
      throw new DatabaseError('Failed to update CV', error);
    }
  }

  static async deleteCV(id: string, userId: string) {
    try {
      // First verify ownership
      await this.findCVById(id, userId);

      return await prisma.cV.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof DatabaseError) throw error;
      throw new DatabaseError('Failed to delete CV', error);
    }
  }

  static async duplicateCV(id: string, userId: string, newName: string) {
    try {
      const originalCV = await this.findCVById(id, userId);

      return await prisma.cV.create({
        data: {
          userId,
          name: newName,
          description: originalCV.description,
          template: originalCV.template,
          data: originalCV.data as any,
          isPublic: false, // Duplicates are private by default
        },
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof DatabaseError) throw error;
      throw new DatabaseError('Failed to duplicate CV', error);
    }
  }

  static async generateShareToken(cvId: string, userId: string) {
    try {
      // Verify ownership
      await this.findCVById(cvId, userId);

      const shareToken = crypto.randomUUID();
      
      return await prisma.cV.update({
        where: { id: cvId },
        data: { 
          shareToken,
          isPublic: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof DatabaseError) throw error;
      throw new DatabaseError('Failed to generate share token', error);
    }
  }

  static async findCVByShareToken(shareToken: string) {
    try {
      const cv = await prisma.cV.findUnique({
        where: { shareToken },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!cv || !cv.isPublic) {
        throw new NotFoundError('Shared CV', shareToken);
      }

      return cv;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to find CV by share token', error);
    }
  }

  // Template utilities
  static async findAllTemplates() {
    try {
      return await prisma.template.findMany({
        orderBy: [
          { isPremium: 'asc' },
          { category: 'asc' },
          { name: 'asc' },
        ],
      });
    } catch (error) {
      throw new DatabaseError('Failed to find templates', error);
    }
  }

  static async findTemplateById(id: string) {
    try {
      const template = await prisma.template.findUnique({
        where: { id },
      });

      if (!template) {
        throw new NotFoundError('Template', id);
      }

      return template;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to find template', error);
    }
  }

  static async findFreeTemplates() {
    try {
      return await prisma.template.findMany({
        where: { isPremium: false },
        orderBy: { name: 'asc' },
      });
    } catch (error) {
      throw new DatabaseError('Failed to find free templates', error);
    }
  }

  static async findPremiumTemplates() {
    try {
      return await prisma.template.findMany({
        where: { isPremium: true },
        orderBy: [
          { category: 'asc' },
          { name: 'asc' },
        ],
      });
    } catch (error) {
      throw new DatabaseError('Failed to find premium templates', error);
    }
  }

  // Session utilities
  static async createUserSession(userId: string, token: string, expiresAt: Date) {
    try {
      return await prisma.userSession.create({
        data: {
          userId,
          token,
          expiresAt,
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to create user session', error);
    }
  }

  static async findValidSession(token: string) {
    try {
      return await prisma.userSession.findFirst({
        where: {
          token,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to find session', error);
    }
  }

  static async deleteUserSession(token: string) {
    try {
      return await prisma.userSession.deleteMany({
        where: { token },
      });
    } catch (error) {
      throw new DatabaseError('Failed to delete session', error);
    }
  }

  static async cleanupExpiredSessions() {
    try {
      return await prisma.userSession.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to cleanup expired sessions', error);
    }
  }

  // AI Usage utilities
  static async trackAIUsage(userId: string, feature: string, tokensUsed: number) {
    try {
      return await prisma.aIUsage.create({
        data: {
          userId,
          feature,
          tokensUsed,
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to track AI usage', error);
    }
  }

  static async getUserAIUsage(userId: string, startDate?: Date, endDate?: Date) {
    try {
      const whereClause: any = { userId };
      
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = startDate;
        if (endDate) whereClause.createdAt.lte = endDate;
      }

      const [usage, totalTokens] = await Promise.all([
        prisma.aIUsage.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.aIUsage.aggregate({
          where: whereClause,
          _sum: {
            tokensUsed: true,
          },
        }),
      ]);

      return {
        usage,
        totalTokens: totalTokens._sum.tokensUsed || 0,
      };
    } catch (error) {
      throw new DatabaseError('Failed to get user AI usage', error);
    }
  }

  // Utility methods
  static async getUserStats(userId: string) {
    try {
      const [cvCount, aiUsage] = await Promise.all([
        prisma.cV.count({ where: { userId } }),
        prisma.aIUsage.aggregate({
          where: { userId },
          _sum: { tokensUsed: true },
          _count: true,
        }),
      ]);

      return {
        totalCVs: cvCount,
        totalAIRequests: aiUsage._count,
        totalTokensUsed: aiUsage._sum.tokensUsed || 0,
      };
    } catch (error) {
      throw new DatabaseError('Failed to get user stats', error);
    }
  }
}

// Export individual utility functions for convenience
export const {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserSubscription,
  findCVById,
  findUserCVs,
  createCV,
  updateCV,
  deleteCV,
  duplicateCV,
  generateShareToken,
  findCVByShareToken,
  findAllTemplates,
  findTemplateById,
  findFreeTemplates,
  findPremiumTemplates,
  createUserSession,
  findValidSession,
  deleteUserSession,
  cleanupExpiredSessions,
  trackAIUsage,
  getUserAIUsage,
  getUserStats,
} = DatabaseUtils;