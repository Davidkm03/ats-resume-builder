import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { prisma } from '../prisma';
import { DatabaseUtils, DatabaseError, NotFoundError, DuplicateError } from '../db-utils';

// Test data
const testUser = {
  email: 'test@example.com',
  passwordHash: 'hashed_password_123',
  name: 'Test User',
};

const testCV = {
  name: 'Test CV',
  description: 'A test CV',
  template: 'modern',
  data: {
    contact: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
    },
    summary: 'Test summary',
    experience: [],
    education: [],
    skills: [],
  },
};

describe('DatabaseUtils', () => {
  let testUserId: string;
  let testCVId: string;

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.cV.deleteMany({ where: { user: { email: testUser.email } } });
    await prisma.user.deleteMany({ where: { email: testUser.email } });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.cV.deleteMany({ where: { user: { email: testUser.email } } });
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  describe('User utilities', () => {
    it('should create a new user', async () => {
      const user = await DatabaseUtils.createUser(testUser);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(testUser.email);
      expect(user.name).toBe(testUser.name);
      expect(user.subscriptionTier).toBe('free');
      
      testUserId = user.id;
    });

    it('should throw DuplicateError for existing email', async () => {
      await expect(DatabaseUtils.createUser(testUser)).rejects.toThrow(DuplicateError);
    });

    it('should find user by email', async () => {
      const user = await DatabaseUtils.findUserByEmail(testUser.email);
      
      expect(user).toBeDefined();
      expect(user?.email).toBe(testUser.email);
      expect(user?.id).toBe(testUserId);
    });

    it('should find user by id', async () => {
      const user = await DatabaseUtils.findUserById(testUserId);
      
      expect(user).toBeDefined();
      expect(user.id).toBe(testUserId);
      expect(user.email).toBe(testUser.email);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      await expect(DatabaseUtils.findUserById('non-existent-id')).rejects.toThrow(NotFoundError);
    });

    it('should update user subscription', async () => {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      const updatedUser = await DatabaseUtils.updateUserSubscription(testUserId, 'premium', expiresAt);
      
      expect(updatedUser.subscriptionTier).toBe('premium');
      expect(updatedUser.subscriptionExpiresAt).toEqual(expiresAt);
    });
  });

  describe('CV utilities', () => {
    it('should create a new CV', async () => {
      const cv = await DatabaseUtils.createCV({
        userId: testUserId,
        ...testCV,
      });
      
      expect(cv).toBeDefined();
      expect(cv.name).toBe(testCV.name);
      expect(cv.userId).toBe(testUserId);
      expect(cv.template).toBe(testCV.template);
      
      testCVId = cv.id;
    });

    it('should find CV by id', async () => {
      const cv = await DatabaseUtils.findCVById(testCVId, testUserId);
      
      expect(cv).toBeDefined();
      expect(cv.id).toBe(testCVId);
      expect(cv.name).toBe(testCV.name);
    });

    it('should throw error for unauthorized CV access', async () => {
      await expect(DatabaseUtils.findCVById(testCVId, 'different-user-id')).rejects.toThrow(DatabaseError);
    });

    it('should find user CVs', async () => {
      const result = await DatabaseUtils.findUserCVs(testUserId);
      
      expect(result.cvs).toBeDefined();
      expect(result.total).toBe(1);
      expect(result.cvs[0].id).toBe(testCVId);
    });

    it('should update CV', async () => {
      const updatedName = 'Updated CV Name';
      const updatedCV = await DatabaseUtils.updateCV(testCVId, testUserId, {
        name: updatedName,
      });
      
      expect(updatedCV.name).toBe(updatedName);
    });

    it('should duplicate CV', async () => {
      const duplicateName = 'Duplicated CV';
      const duplicatedCV = await DatabaseUtils.duplicateCV(testCVId, testUserId, duplicateName);
      
      expect(duplicatedCV).toBeDefined();
      expect(duplicatedCV.name).toBe(duplicateName);
      expect(duplicatedCV.template).toBe(testCV.template);
      expect(duplicatedCV.userId).toBe(testUserId);
      expect(duplicatedCV.isPublic).toBe(false);
      
      // Clean up the duplicate
      await DatabaseUtils.deleteCV(duplicatedCV.id, testUserId);
    });

    it('should generate share token', async () => {
      const sharedCV = await DatabaseUtils.generateShareToken(testCVId, testUserId);
      
      expect(sharedCV.shareToken).toBeDefined();
      expect(sharedCV.isPublic).toBe(true);
    });

    it('should find CV by share token', async () => {
      const cv = await DatabaseUtils.findCVById(testCVId);
      const sharedCV = await DatabaseUtils.findCVByShareToken(cv.shareToken!);
      
      expect(sharedCV).toBeDefined();
      expect(sharedCV.id).toBe(testCVId);
    });
  });

  describe('Template utilities', () => {
    it('should find all templates', async () => {
      const templates = await DatabaseUtils.findAllTemplates();
      
      expect(templates).toBeDefined();
      expect(Array.isArray(templates)).toBe(true);
    });

    it('should find free templates', async () => {
      const freeTemplates = await DatabaseUtils.findFreeTemplates();
      
      expect(freeTemplates).toBeDefined();
      expect(freeTemplates.every(t => !t.isPremium)).toBe(true);
    });

    it('should find premium templates', async () => {
      const premiumTemplates = await DatabaseUtils.findPremiumTemplates();
      
      expect(premiumTemplates).toBeDefined();
      expect(premiumTemplates.every(t => t.isPremium)).toBe(true);
    });
  });

  describe('Session utilities', () => {
    it('should create and find user session', async () => {
      const token = 'test-session-token';
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      const session = await DatabaseUtils.createUserSession(testUserId, token, expiresAt);
      expect(session).toBeDefined();
      expect(session.token).toBe(token);
      
      const foundSession = await DatabaseUtils.findValidSession(token);
      expect(foundSession).toBeDefined();
      expect(foundSession?.token).toBe(token);
      expect(foundSession?.user.id).toBe(testUserId);
      
      // Clean up
      await DatabaseUtils.deleteUserSession(token);
    });
  });

  describe('AI Usage utilities', () => {
    it('should track AI usage', async () => {
      const usage = await DatabaseUtils.trackAIUsage(testUserId, 'content-generation', 150);
      
      expect(usage).toBeDefined();
      expect(usage.feature).toBe('content-generation');
      expect(usage.tokensUsed).toBe(150);
    });

    it('should get user AI usage', async () => {
      const result = await DatabaseUtils.getUserAIUsage(testUserId);
      
      expect(result).toBeDefined();
      expect(result.totalTokens).toBeGreaterThan(0);
      expect(result.usage.length).toBeGreaterThan(0);
    });
  });

  describe('User stats', () => {
    it('should get user statistics', async () => {
      const stats = await DatabaseUtils.getUserStats(testUserId);
      
      expect(stats).toBeDefined();
      expect(stats.totalCVs).toBe(1);
      expect(stats.totalAIRequests).toBeGreaterThan(0);
      expect(stats.totalTokensUsed).toBeGreaterThan(0);
    });
  });

  describe('Cleanup', () => {
    it('should delete CV', async () => {
      await DatabaseUtils.deleteCV(testCVId, testUserId);
      
      await expect(DatabaseUtils.findCVById(testCVId)).rejects.toThrow(NotFoundError);
    });
  });
});