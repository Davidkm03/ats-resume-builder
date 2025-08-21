import { describe, it, expect } from '@jest/globals';
import {
  contactInfoSchema,
  experienceSchema,
  educationSchema,
  projectSchema,
  certificationSchema,
  cvDataSchema,
  createCVRequestSchema,
  updateCVRequestSchema,
} from '@/lib/validations/cv';
import {
  createDefaultCVData,
  validateAndSanitizeCVData,
  mergeCVData,
  extractKeywordsFromCV,
  calculateCVCompleteness,
  generateShareToken,
  convertCVToPlainText,
  validateDateRange,
  formatDateForDisplay,
} from '@/lib/utils/cv-transforms';
import { CVData } from '@/types/cv';

describe('CV Validation Schemas', () => {
  describe('contactInfoSchema', () => {
    it('should validate valid contact info', () => {
      const validContact = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York, NY',
        linkedin: 'https://linkedin.com/in/johndoe',
        website: 'https://johndoe.com',
      };

      expect(() => contactInfoSchema.parse(validContact)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidContact = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '+1234567890',
        location: 'New York, NY',
      };

      expect(() => contactInfoSchema.parse(invalidContact)).toThrow();
    });

    it('should reject empty required fields', () => {
      const invalidContact = {
        name: '',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York, NY',
      };

      expect(() => contactInfoSchema.parse(invalidContact)).toThrow();
    });
  });

  describe('experienceSchema', () => {
    it('should validate valid experience', () => {
      const validExperience = {
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2022-01-01',
        endDate: '2023-12-31',
        isPresent: false,
        bullets: ['Developed web applications', 'Led team of 3 developers'],
      };

      expect(() => experienceSchema.parse(validExperience)).not.toThrow();
    });

    it('should validate current position without end date', () => {
      const currentExperience = {
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2022-01-01',
        isPresent: true,
        bullets: ['Developing web applications'],
      };

      expect(() => experienceSchema.parse(currentExperience)).not.toThrow();
    });

    it('should reject past position without end date', () => {
      const invalidExperience = {
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2022-01-01',
        isPresent: false,
        bullets: ['Developed web applications'],
      };

      expect(() => experienceSchema.parse(invalidExperience)).toThrow();
    });

    it('should reject invalid date range', () => {
      const invalidExperience = {
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2023-01-01',
        endDate: '2022-12-31',
        isPresent: false,
        bullets: ['Developed web applications'],
      };

      expect(() => experienceSchema.parse(invalidExperience)).toThrow();
    });
  });

  describe('cvDataSchema', () => {
    it('should validate complete CV data', () => {
      const validCV: CVData = {
        name: 'My Resume',
        template: 'modern',
        contact: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          location: 'New York, NY',
        },
        summary: 'Experienced software engineer',
        experience: [{
          title: 'Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          startDate: '2022-01-01',
          isPresent: true,
          bullets: ['Developed web applications'],
        }],
        education: [{
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Technology',
          startDate: '2018-09-01',
          endDate: '2022-05-31',
        }],
        skills: ['JavaScript', 'React', 'Node.js'],
        projects: [],
        certifications: [],
        languages: [],
        awards: [],
        publications: [],
        volunteerWork: [],
        customSections: [],
      };

      expect(() => cvDataSchema.parse(validCV)).not.toThrow();
    });
  });
});

describe('CV Transformation Utilities', () => {
  describe('createDefaultCVData', () => {
    it('should create valid default CV data', () => {
      const defaultCV = createDefaultCVData('Test CV', 'modern');
      
      expect(defaultCV.name).toBe('Test CV');
      expect(defaultCV.template).toBe('modern');
      expect(defaultCV.contact.name).toBe('');
      expect(defaultCV.experience).toEqual([]);
      expect(defaultCV.metadata?.version).toBe(1);
    });
  });

  describe('validateAndSanitizeCVData', () => {
    it('should validate correct CV data', () => {
      const validCV = createDefaultCVData('Test CV');
      validCV.contact = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York, NY',
      };

      expect(() => validateAndSanitizeCVData(validCV)).not.toThrow();
    });

    it('should throw error for invalid CV data', () => {
      const invalidCV = {
        name: '',
        template: 'invalid-template',
        contact: {
          email: 'invalid-email',
        },
      };

      expect(() => validateAndSanitizeCVData(invalidCV)).toThrow();
    });
  });

  describe('mergeCVData', () => {
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

  describe('extractKeywordsFromCV', () => {
    it('should extract keywords from CV data', () => {
      const cv = createDefaultCVData('Test CV');
      cv.contact.name = 'John Doe';
      cv.summary = 'Experienced software engineer with React expertise';
      cv.skills = ['JavaScript', 'React', 'Node.js'];
      cv.experience = [{
        title: 'Senior Developer',
        company: 'Tech Corp',
        location: 'SF',
        startDate: '2022-01-01',
        isPresent: true,
        bullets: ['Built scalable web applications using React'],
      }];

      const keywords = extractKeywordsFromCV(cv);

      expect(keywords).toContain('john');
      expect(keywords).toContain('doe');
      expect(keywords).toContain('react');
      expect(keywords).toContain('javascript');
      expect(keywords).toContain('senior');
      expect(keywords).toContain('developer');
    });
  });

  describe('calculateCVCompleteness', () => {
    it('should calculate completeness score', () => {
      const cv = createDefaultCVData('Test CV');
      cv.contact = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York, NY',
      };
      cv.summary = 'Experienced software engineer with 5 years of experience';
      cv.experience = [{
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'SF',
        startDate: '2022-01-01',
        isPresent: true,
        bullets: ['Developed applications', 'Led team'],
      }];
      cv.education = [{
        degree: 'BS Computer Science',
        institution: 'University',
        startDate: '2018-09-01',
        endDate: '2022-05-31',
      }];
      cv.skills = ['JavaScript', 'React', 'Node.js'];

      const score = calculateCVCompleteness(cv);
      expect(score).toBeGreaterThan(60);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return low score for minimal CV', () => {
      const cv = createDefaultCVData('Test CV');
      cv.contact = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        location: '',
      };

      const score = calculateCVCompleteness(cv);
      expect(score).toBeLessThan(30);
    });
  });

  describe('generateShareToken', () => {
    it('should generate unique tokens', () => {
      const token1 = generateShareToken();
      const token2 = generateShareToken();

      expect(token1).toHaveLength(32);
      expect(token2).toHaveLength(32);
      expect(token1).not.toBe(token2);
    });
  });

  describe('convertCVToPlainText', () => {
    it('should convert CV to plain text format', () => {
      const cv = createDefaultCVData('Test CV');
      cv.contact = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York, NY',
      };
      cv.summary = 'Software engineer';
      cv.experience = [{
        title: 'Developer',
        company: 'Tech Corp',
        location: 'SF',
        startDate: '2022-01-01',
        isPresent: true,
        bullets: ['Built applications'],
      }];

      const plainText = convertCVToPlainText(cv);

      expect(plainText).toContain('John Doe');
      expect(plainText).toContain('john@example.com');
      expect(plainText).toContain('Software engineer');
      expect(plainText).toContain('Developer');
      expect(plainText).toContain('Tech Corp');
      expect(plainText).toContain('Built applications');
    });
  });

  describe('validateDateRange', () => {
    it('should validate correct date ranges', () => {
      expect(validateDateRange('2022-01-01', '2023-01-01', false)).toBe(true);
      expect(validateDateRange('2022-01-01', undefined, true)).toBe(true);
    });

    it('should reject invalid date ranges', () => {
      expect(validateDateRange('2023-01-01', '2022-01-01', false)).toBe(false);
      expect(validateDateRange('invalid-date')).toBe(false);
    });
  });

  describe('formatDateForDisplay', () => {
    it('should format dates correctly', () => {
      expect(formatDateForDisplay('2022-01-15')).toBe('Jan 2022');
      expect(formatDateForDisplay('2023-12-31')).toBe('Dec 2023');
    });

    it('should handle invalid dates gracefully', () => {
      expect(formatDateForDisplay('invalid-date')).toBe('invalid-date');
    });
  });
});

describe('API Request Schemas', () => {
  describe('createCVRequestSchema', () => {
    it('should validate create CV request', () => {
      const validRequest = {
        name: 'My New CV',
        description: 'A professional resume',
        template: 'modern',
      };

      expect(() => createCVRequestSchema.parse(validRequest)).not.toThrow();
    });

    it('should reject empty name', () => {
      const invalidRequest = {
        name: '',
        template: 'modern',
      };

      expect(() => createCVRequestSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe('updateCVRequestSchema', () => {
    it('should validate update CV request', () => {
      const validRequest = {
        name: 'Updated CV Name',
        isPublic: true,
      };

      expect(() => updateCVRequestSchema.parse(validRequest)).not.toThrow();
    });

    it('should allow partial updates', () => {
      const validRequest = {
        description: 'Updated description only',
      };

      expect(() => updateCVRequestSchema.parse(validRequest)).not.toThrow();
    });
  });
});