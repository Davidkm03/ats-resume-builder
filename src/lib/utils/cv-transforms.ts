import { CVData, CVRecord, ContactInfo, Experience, Education } from '@/types/cv';
import { cvDataSchema } from '@/lib/validations/cv';
import { z } from 'zod';
import { randomBytes } from 'crypto';

/**
 * Transform database CV record to client-safe CV data
 */
export function transformCVRecordToResponse(record: CVRecord): CVRecord {
  return {
    ...record,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    data: record.data as CVData,
  };
}

/**
 * Transform CV data for database storage
 */
export function transformCVDataForStorage(data: CVData): CVData {
  const now = new Date().toISOString();
  
  return {
    ...data,
    metadata: {
      ...data.metadata,
      lastModified: now,
      version: (data.metadata?.version || 0) + 1,
    },
  };
}

/**
 * Create default CV data structure
 */
export function createDefaultCVData(name: string, template: string = 'modern'): CVData {
  return {
    name,
    template: template as any,
    contact: {
      name: '',
      email: '',
      phone: '',
      location: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    awards: [],
    publications: [],
    volunteerWork: [],
    customSections: [],
    metadata: {
      lastModified: new Date().toISOString(),
      version: 1,
    },
  };
}

/**
 * Validate and sanitize CV data
 */
export function validateAndSanitizeCVData(data: unknown): CVData {
  try {
    return cvDataSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid CV data: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw new Error('Invalid CV data format');
  }
}

/**
 * Merge partial CV data with existing data
 */
export function mergeCVData(existing: CVData, updates: Partial<CVData>): CVData {
  const merged = {
    ...existing,
    ...updates,
    metadata: {
      ...existing.metadata,
      ...updates.metadata,
      lastModified: new Date().toISOString(),
      version: (existing.metadata?.version || 0) + 1,
    },
  };

  return validateAndSanitizeCVData(merged);
}

/**
 * Extract keywords from CV data for search and ATS optimization
 */
export function extractKeywordsFromCV(data: CVData): string[] {
  const keywords = new Set<string>();

  // Extract from contact info
  if (data.contact.name) {
    data.contact.name.split(' ').forEach(word => keywords.add(word.toLowerCase()));
  }

  // Extract from summary
  if (data.summary) {
    data.summary.split(/\s+/).forEach(word => {
      const cleaned = word.replace(/[^\w]/g, '').toLowerCase();
      if (cleaned.length > 2) keywords.add(cleaned);
    });
  }

  // Extract from experience
  data.experience.forEach(exp => {
    exp.title.split(/\s+/).forEach(word => {
      const cleaned = word.replace(/[^\w]/g, '').toLowerCase();
      if (cleaned.length > 2) keywords.add(cleaned);
    });
    exp.company.split(/\s+/).forEach(word => {
      const cleaned = word.replace(/[^\w]/g, '').toLowerCase();
      if (cleaned.length > 2) keywords.add(cleaned);
    });
    exp.bullets.forEach(bullet => {
      bullet.split(/\s+/).forEach(word => {
        const cleaned = word.replace(/[^\w]/g, '').toLowerCase();
        if (cleaned.length > 2) keywords.add(cleaned);
      });
    });
    exp.skills?.forEach(skill => keywords.add(skill.toLowerCase()));
  });

  // Extract from education
  data.education.forEach(edu => {
    keywords.add(edu.degree.toLowerCase());
    keywords.add(edu.institution.toLowerCase());
    edu.relevantCourses?.forEach(course => keywords.add(course.toLowerCase()));
  });

  // Extract from skills
  data.skills.forEach(skill => keywords.add(skill.toLowerCase()));

  // Extract from projects
  data.projects.forEach(project => {
    keywords.add(project.name.toLowerCase());
    project.technologies?.forEach(tech => keywords.add(tech.toLowerCase()));
  });

  // Extract from certifications
  data.certifications.forEach(cert => {
    keywords.add(cert.name.toLowerCase());
    keywords.add(cert.issuer.toLowerCase());
  });

  return Array.from(keywords).filter(keyword => keyword.length > 2);
}

/**
 * Calculate CV completeness score (0-100)
 */
export function calculateCVCompleteness(data: CVData): number {
  let score = 0;
  let maxScore = 0;

  // Contact information (20 points)
  maxScore += 20;
  const contactFields = ['name', 'email', 'phone', 'location'];
  const filledContactFields = contactFields.filter(field => 
    data.contact[field as keyof ContactInfo]?.trim()
  ).length;
  score += (filledContactFields / contactFields.length) * 20;

  // Summary (15 points)
  maxScore += 15;
  if (data.summary?.trim()) {
    score += data.summary.length > 50 ? 15 : 10;
  }

  // Experience (25 points)
  maxScore += 25;
  if (data.experience.length > 0) {
    const avgBullets = data.experience.reduce((sum, exp) => sum + exp.bullets.length, 0) / data.experience.length;
    score += Math.min(25, data.experience.length * 10 + avgBullets * 3);
  }

  // Education (15 points)
  maxScore += 15;
  if (data.education.length > 0) {
    score += Math.min(15, data.education.length * 10);
  }

  // Skills (10 points)
  maxScore += 10;
  if (data.skills.length > 0) {
    score += Math.min(10, data.skills.length * 2);
  }

  // Additional sections (15 points)
  maxScore += 15;
  let additionalScore = 0;
  if (data.projects.length > 0) additionalScore += 5;
  if (data.certifications.length > 0) additionalScore += 5;
  if (data.languages.length > 0) additionalScore += 3;
  if (data.awards.length > 0) additionalScore += 2;
  score += Math.min(15, additionalScore);

  return Math.round((score / maxScore) * 100);
}

/**
 * Generate a shareable token for CV
 */
export function generateShareToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Sanitize CV data for public sharing (remove sensitive info)
 */
export function sanitizeCVForPublicSharing(data: CVData): CVData {
  return {
    ...data,
    contact: {
      ...data.contact,
      // Keep name and location, but optionally hide other contact details
      // This can be configured based on user preferences
    },
    metadata: {
      lastModified: data.metadata?.lastModified || new Date().toISOString(),
      version: data.metadata?.version || 1,
      ...data.metadata,
      // Remove any internal tracking data
      atsScore: undefined,
      keywords: undefined,
    },
  };
}

/**
 * Convert CV data to plain text format
 */
export function convertCVToPlainText(data: CVData): string {
  let text = '';

  // Header
  text += `${data.contact.name}\n`;
  text += `${data.contact.email} | ${data.contact.phone}\n`;
  text += `${data.contact.location}\n`;
  if (data.contact.linkedin) text += `LinkedIn: ${data.contact.linkedin}\n`;
  if (data.contact.website) text += `Website: ${data.contact.website}\n`;
  text += '\n';

  // Summary
  if (data.summary) {
    text += 'SUMMARY\n';
    text += `${data.summary}\n\n`;
  }

  // Experience
  if (data.experience.length > 0) {
    text += 'EXPERIENCE\n';
    data.experience.forEach(exp => {
      text += `${exp.title} | ${exp.company} | ${exp.location}\n`;
      text += `${exp.startDate} - ${exp.isPresent ? 'Present' : exp.endDate}\n`;
      exp.bullets.forEach(bullet => {
        text += `• ${bullet}\n`;
      });
      text += '\n';
    });
  }

  // Education
  if (data.education.length > 0) {
    text += 'EDUCATION\n';
    data.education.forEach(edu => {
      text += `${edu.degree} | ${edu.institution}\n`;
      text += `${edu.startDate} - ${edu.endDate || 'Present'}\n`;
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
      text += '\n';
    });
  }

  // Skills
  if (data.skills.length > 0) {
    text += 'SKILLS\n';
    text += `${data.skills.join(', ')}\n\n`;
  }

  // Projects
  if (data.projects.length > 0) {
    text += 'PROJECTS\n';
    data.projects.forEach(project => {
      text += `${project.name}\n`;
      text += `${project.description}\n`;
      if (project.technologies) {
        text += `Technologies: ${project.technologies.join(', ')}\n`;
      }
      text += '\n';
    });
  }

  return text;
}

/**
 * Validate date range
 */
export function validateDateRange(startDate: string, endDate?: string, isPresent?: boolean): boolean {
  if (!startDate) return false;
  
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return false;

  if (!isPresent && endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) return false;
    return start <= end;
  }

  return true;
}

/**
 * Format date for display
 */
export function formatDateForDisplay(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  } catch {
    return dateString;
  }
}

/**
 * Generate unique ID for CV sections
 */
export function generateSectionId(): string {
  return `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}