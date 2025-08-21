import { z } from 'zod';

// Base validation schemas
const dateStringSchema = z.string().refine(
  (date) => !isNaN(Date.parse(date)),
  { message: 'Invalid date format' }
);

const urlSchema = z.string().url().optional().or(z.literal(''));

const emailSchema = z.string().email('Invalid email format');

const phoneSchema = z.string().min(1, 'Phone number is required');

// Contact Information Schema
export const contactInfoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: emailSchema,
  phone: phoneSchema,
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  linkedin: urlSchema,
  website: urlSchema,
  github: urlSchema,
  portfolio: urlSchema,
});

// Experience Schema
export const experienceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Job title is required').max(100, 'Title too long'),
  company: z.string().min(1, 'Company is required').max(100, 'Company name too long'),
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  startDate: dateStringSchema,
  endDate: dateStringSchema.optional(),
  isPresent: z.boolean(),
  description: z.string().max(500, 'Description too long').optional(),
  bullets: z.array(z.string().min(1, 'Bullet point cannot be empty').max(300, 'Bullet point too long')),
  skills: z.array(z.string()).optional(),
}).refine(
  (data) => data.isPresent || data.endDate,
  {
    message: 'End date is required when not currently employed',
    path: ['endDate'],
  }
).refine(
  (data) => {
    if (data.endDate && !data.isPresent) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'Start date must be before end date',
    path: ['endDate'],
  }
);

// Education Schema
export const educationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, 'Degree is required').max(100, 'Degree too long'),
  institution: z.string().min(1, 'Institution is required').max(100, 'Institution name too long'),
  location: z.string().max(100, 'Location too long').optional(),
  startDate: dateStringSchema,
  endDate: dateStringSchema.optional(),
  gpa: z.string().max(10, 'GPA too long').optional(),
  honors: z.string().max(100, 'Honors too long').optional(),
  relevantCourses: z.array(z.string().max(100, 'Course name too long')).optional(),
}).refine(
  (data) => {
    if (data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'Start date must be before end date',
    path: ['endDate'],
  }
);

// Project Schema
export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  technologies: z.array(z.string().max(50, 'Technology name too long')).optional(),
  url: urlSchema,
  github: urlSchema,
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
  highlights: z.array(z.string().max(200, 'Highlight too long')).optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'Start date must be before end date',
    path: ['endDate'],
  }
);

// Certification Schema
export const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Certification name is required').max(100, 'Name too long'),
  issuer: z.string().min(1, 'Issuer is required').max(100, 'Issuer name too long'),
  issueDate: dateStringSchema,
  expiryDate: dateStringSchema.optional(),
  credentialId: z.string().max(100, 'Credential ID too long').optional(),
  url: urlSchema,
}).refine(
  (data) => {
    if (data.expiryDate) {
      return new Date(data.issueDate) <= new Date(data.expiryDate);
    }
    return true;
  },
  {
    message: 'Issue date must be before expiry date',
    path: ['expiryDate'],
  }
);

// Language Schema
export const languageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Language name is required').max(50, 'Language name too long'),
  proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'native']),
});

// Award Schema
export const awardSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Award title is required').max(100, 'Title too long'),
  issuer: z.string().min(1, 'Issuer is required').max(100, 'Issuer name too long'),
  date: dateStringSchema,
  description: z.string().max(300, 'Description too long').optional(),
});

// Publication Schema
export const publicationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Publication title is required').max(200, 'Title too long'),
  publisher: z.string().min(1, 'Publisher is required').max(100, 'Publisher name too long'),
  date: dateStringSchema,
  url: urlSchema,
  description: z.string().max(300, 'Description too long').optional(),
});

// Volunteer Work Schema
export const volunteerWorkSchema = z.object({
  id: z.string().optional(),
  organization: z.string().min(1, 'Organization is required').max(100, 'Organization name too long'),
  role: z.string().min(1, 'Role is required').max(100, 'Role too long'),
  startDate: dateStringSchema,
  endDate: dateStringSchema.optional(),
  isPresent: z.boolean(),
  description: z.string().max(300, 'Description too long').optional(),
  achievements: z.array(z.string().max(200, 'Achievement too long')).optional(),
}).refine(
  (data) => data.isPresent || data.endDate,
  {
    message: 'End date is required when not currently volunteering',
    path: ['endDate'],
  }
).refine(
  (data) => {
    if (data.endDate && !data.isPresent) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'Start date must be before end date',
    path: ['endDate'],
  }
);

// Custom Section Schema
export const customSectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Section title is required').max(50, 'Title too long'),
  content: z.string().max(1000, 'Content too long').optional(),
  type: z.enum(['text', 'list', 'bullets']),
  items: z.array(z.string().max(200, 'Item too long')).optional(),
}).refine(
  (data) => {
    if (data.type === 'text') {
      return data.content && data.content.length > 0;
    }
    if (data.type === 'list' || data.type === 'bullets') {
      return data.items && data.items.length > 0;
    }
    return true;
  },
  {
    message: 'Content or items are required based on section type',
    path: ['content'],
  }
);

// CV Metadata Schema
export const cvMetadataSchema = z.object({
  lastModified: dateStringSchema,
  version: z.number().int().positive(),
  atsScore: z.number().min(0).max(100).optional(),
  keywords: z.array(z.string().max(50, 'Keyword too long')).optional(),
  targetRole: z.string().max(100, 'Target role too long').optional(),
  targetIndustry: z.string().max(100, 'Target industry too long').optional(),
});

// Template Type Schema
export const templateTypeSchema = z.enum([
  'modern',
  'classic',
  'minimal',
  'professional',
  'creative',
  'academic',
  'technical',
  'executive',
  'designer',
  'startup',
]);

// Main CV Data Schema
export const cvDataSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'CV name is required').max(100, 'CV name too long'),
  template: templateTypeSchema,
  contact: contactInfoSchema,
  summary: z.string().max(1000, 'Summary too long').optional(),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string().min(1, 'Skill cannot be empty').max(50, 'Skill name too long')),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
  languages: z.array(languageSchema),
  awards: z.array(awardSchema),
  publications: z.array(publicationSchema),
  volunteerWork: z.array(volunteerWorkSchema),
  customSections: z.array(customSectionSchema),
  metadata: cvMetadataSchema.optional(),
});

// API Request Schemas
export const createCVRequestSchema = z.object({
  name: z.string().min(1, 'CV name is required').max(100, 'CV name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  template: templateTypeSchema.optional(),
  data: cvDataSchema.partial().optional(),
});

export const updateCVRequestSchema = z.object({
  name: z.string().min(1, 'CV name is required').max(100, 'CV name too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
  template: templateTypeSchema.optional(),
  data: cvDataSchema.partial().optional(),
  isPublic: z.boolean().optional(),
});

export const duplicateCVRequestSchema = z.object({
  name: z.string().min(1, 'CV name is required').max(100, 'CV name too long'),
  description: z.string().max(500, 'Description too long').optional(),
});

// Export Format Schema
export const exportFormatSchema = z.enum(['pdf', 'docx', 'txt', 'json', 'latex', 'html']);

// Query Parameters Schema
export const cvListQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional(),
  search: z.string().max(100).optional(),
  template: templateTypeSchema.optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Type exports for use in components
export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
export type LanguageInput = z.infer<typeof languageSchema>;
export type AwardInput = z.infer<typeof awardSchema>;
export type PublicationInput = z.infer<typeof publicationSchema>;
export type VolunteerWorkInput = z.infer<typeof volunteerWorkSchema>;
export type CustomSectionInput = z.infer<typeof customSectionSchema>;
export type CVDataInput = z.infer<typeof cvDataSchema>;
export type CreateCVRequestInput = z.infer<typeof createCVRequestSchema>;
export type UpdateCVRequestInput = z.infer<typeof updateCVRequestSchema>;
export type DuplicateCVRequestInput = z.infer<typeof duplicateCVRequestSchema>;
export type CVListQueryInput = z.infer<typeof cvListQuerySchema>;