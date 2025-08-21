import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  createCVRequestSchema,
  updateCVRequestSchema,
  duplicateCVRequestSchema,
  cvListQuerySchema,
  createDefaultCVData,
  validateAndSanitizeCVData,
  mergeCVData,
} from '@/lib/cv';

// Mock dependencies to avoid database initialization
jest.mock('@/lib/prisma', () => ({
  prisma: {
    cV: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('next-auth');
jest.mock('@/lib/rate-limit', () => ({
  withRateLimit: jest.fn().mockResolvedValue(null),
}));

describe('CV API Validation and Business Logic', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockSession = {
    user: mockUser,
    expires: '2024-12-31',
  };

  const mockCV = {
    id: 'cv-123',
    userId: 'user-123',
    name: 'Test CV',
    description: 'A test CV',
    template: 'modern',
    data: createDefaultCVData('Test CV'),
    isPublic: false,
    shareToken: null,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    user: mockUser,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API Request Validation', () => {
    it('should validate create CV request', () => {
      const validRequest = {
        name: 'My New CV',
        description: 'A professional resume',
        template: 'modern',
      };

      const result = createCVRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should reject invalid create CV request', () => {
      const invalidRequest = {
        name: '', // Empty name
        template: 'invalid-template',
      };

      const result = createCVRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should validate update CV request', () => {
      const validRequest = {
        name: 'Updated CV Name',
        isPublic: true,
      };

      const result = updateCVRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should validate duplicate CV request', () => {
      const validRequest = {
        name: 'Copy of My CV',
        description: 'Duplicated resume',
      };

      const result = duplicateCVRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should validate CV list query parameters', () => {
      const validQuery = {
        page: '1',
        limit: '20',
        search: 'software engineer',
        template: 'modern',
        sortBy: 'updatedAt',
        sortOrder: 'desc',
      };

      const result = cvListQuerySchema.safeParse(validQuery);
      expect(result.success).toBe(true);
      expect(result.data?.page).toBe(1);
      expect(result.data?.limit).toBe(20);
    });

    it('should reject invalid query parameters', () => {
      const invalidQuery = {
        page: 'invalid',
        limit: '1000', // Too high
        sortBy: 'invalid-field',
      };

      const result = cvListQuerySchema.safeParse(invalidQuery);
      expect(result.success).toBe(false);
    });
  });

  describe('CV Data Operations', () => {
    it('should create default CV data', () => {
      const cvData = createDefaultCVData('Test CV', 'modern');
      
      expect(cvData.name).toBe('Test CV');
      expect(cvData.template).toBe('modern');
      expect(cvData.contact.name).toBe('');
      expect(cvData.experience).toEqual([]);
      expect(cvData.metadata?.version).toBe(1);
    });

    it('should validate and sanitize CV data', () => {
      const validCV = createDefaultCVData('Test CV');
      validCV.contact = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York, NY',
      };

      expect(() => validateAndSanitizeCVData(validCV)).not.toThrow();
    });

    it('should merge CV data correctly', () => {
      const existing = createDefaultCVData('Original CV');
      existing.contact = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York, NY',
      };

      const updates = {
        summary: 'Updated summary',
        skills: ['JavaScript', 'React'],
      };

      const merged = mergeCVData(existing, updates);

      expect(merged.summary).toBe('Updated summary');
      expect(merged.skills).toEqual(['JavaScript', 'React']);
      expect(merged.contact.name).toBe('John Doe');
      expect(merged.metadata?.version).toBe(2);
    });
  });
});