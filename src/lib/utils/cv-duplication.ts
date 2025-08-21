import { CVData, CVRecord } from '@/types/cv';
import { validateAndSanitizeCVData, transformCVDataForStorage, generateSectionId } from './cv-transforms';

/**
 * Duplication options
 */
export interface DuplicationOptions {
  includeSensitiveData: boolean;
  includePersonalProjects: boolean;
  includeVolunteerWork: boolean;
  includeCustomSections: boolean;
  resetDates: boolean;
  anonymize: boolean;
  templateOverride?: string;
}

/**
 * Default duplication options
 */
export const DEFAULT_DUPLICATION_OPTIONS: DuplicationOptions = {
  includeSensitiveData: true,
  includePersonalProjects: true,
  includeVolunteerWork: true,
  includeCustomSections: true,
  resetDates: false,
  anonymize: false,
};

/**
 * Duplicate CV data with advanced options
 */
export function duplicateCVData(
  originalData: CVData,
  newName: string,
  options: DuplicationOptions = DEFAULT_DUPLICATION_OPTIONS
): CVData {
  const duplicated: CVData = {
    ...originalData,
    name: newName,
    // Generate new IDs for all sections
    experience: originalData.experience.map(exp => ({
      ...exp,
      id: generateSectionId(),
    })),
    education: originalData.education.map(edu => ({
      ...edu,
      id: generateSectionId(),
    })),
    projects: originalData.projects.map(proj => ({
      ...proj,
      id: generateSectionId(),
    })),
    certifications: originalData.certifications.map(cert => ({
      ...cert,
      id: generateSectionId(),
    })),
    languages: originalData.languages.map(lang => ({
      ...lang,
      id: generateSectionId(),
    })),
    awards: originalData.awards.map(award => ({
      ...award,
      id: generateSectionId(),
    })),
    publications: originalData.publications.map(pub => ({
      ...pub,
      id: generateSectionId(),
    })),
    volunteerWork: originalData.volunteerWork.map(vol => ({
      ...vol,
      id: generateSectionId(),
    })),
    customSections: originalData.customSections.map(section => ({
      ...section,
      id: generateSectionId(),
    })),
  };

  // Apply duplication options
  if (!options.includeSensitiveData) {
    duplicated.contact = {
      ...duplicated.contact,
      email: '',
      phone: '',
      linkedin: '',
      website: '',
      github: '',
      portfolio: '',
    };
  }

  if (!options.includePersonalProjects) {
    duplicated.projects = [];
  }

  if (!options.includeVolunteerWork) {
    duplicated.volunteerWork = [];
  }

  if (!options.includeCustomSections) {
    duplicated.customSections = [];
  }

  if (options.resetDates) {
    // Reset all dates to empty or current date
    duplicated.experience = duplicated.experience.map(exp => ({
      ...exp,
      startDate: '',
      endDate: exp.isPresent ? undefined : '',
    }));

    duplicated.education = duplicated.education.map(edu => ({
      ...edu,
      startDate: '',
      endDate: '',
    }));

    duplicated.projects = duplicated.projects.map(proj => ({
      ...proj,
      startDate: undefined,
      endDate: undefined,
    }));

    duplicated.certifications = duplicated.certifications.map(cert => ({
      ...cert,
      issueDate: '',
      expiryDate: undefined,
    }));

    duplicated.awards = duplicated.awards.map(award => ({
      ...award,
      date: '',
    }));

    duplicated.publications = duplicated.publications.map(pub => ({
      ...pub,
      date: '',
    }));

    duplicated.volunteerWork = duplicated.volunteerWork.map(vol => ({
      ...vol,
      startDate: '',
      endDate: vol.isPresent ? undefined : '',
    }));
  }

  if (options.anonymize) {
    duplicated.contact = {
      ...duplicated.contact,
      name: 'Anonymous Professional',
      email: 'email@example.com',
      phone: '+1234567890',
      location: 'City, State',
    };

    // Anonymize company names and institutions
    duplicated.experience = duplicated.experience.map(exp => ({
      ...exp,
      company: `Company ${Math.floor(Math.random() * 100) + 1}`,
      location: 'City, State',
    }));

    duplicated.education = duplicated.education.map(edu => ({
      ...edu,
      institution: `University ${Math.floor(Math.random() * 100) + 1}`,
      location: 'City, State',
    }));
  }

  if (options.templateOverride) {
    duplicated.template = options.templateOverride as any;
  }

  // Update metadata
  duplicated.metadata = {
    lastModified: new Date().toISOString(),
    version: 1,
    // Remove original metadata that shouldn't be duplicated
    atsScore: undefined,
    keywords: undefined,
  };

  return duplicated;
}

/**
 * Duplication strategies for different use cases
 */
export enum DuplicationStrategy {
  EXACT_COPY = 'exact_copy',
  TEMPLATE_ONLY = 'template_only',
  ANONYMIZED = 'anonymized',
  CLEAN_SLATE = 'clean_slate',
  ROLE_SPECIFIC = 'role_specific',
}

/**
 * Get duplication options for a specific strategy
 */
export function getDuplicationOptionsForStrategy(strategy: DuplicationStrategy): DuplicationOptions {
  switch (strategy) {
    case DuplicationStrategy.EXACT_COPY:
      return DEFAULT_DUPLICATION_OPTIONS;

    case DuplicationStrategy.TEMPLATE_ONLY:
      return {
        ...DEFAULT_DUPLICATION_OPTIONS,
        includeSensitiveData: false,
        includePersonalProjects: false,
        includeVolunteerWork: false,
        includeCustomSections: false,
        resetDates: true,
      };

    case DuplicationStrategy.ANONYMIZED:
      return {
        ...DEFAULT_DUPLICATION_OPTIONS,
        anonymize: true,
      };

    case DuplicationStrategy.CLEAN_SLATE:
      return {
        ...DEFAULT_DUPLICATION_OPTIONS,
        includeSensitiveData: false,
        resetDates: true,
      };

    case DuplicationStrategy.ROLE_SPECIFIC:
      return {
        ...DEFAULT_DUPLICATION_OPTIONS,
        includePersonalProjects: false,
        includeVolunteerWork: false,
        resetDates: false,
      };

    default:
      return DEFAULT_DUPLICATION_OPTIONS;
  }
}

/**
 * Bulk duplication for creating multiple versions
 */
export interface BulkDuplicationRequest {
  baseCV: CVData;
  variations: Array<{
    name: string;
    strategy: DuplicationStrategy;
    templateOverride?: string;
    customOptions?: Partial<DuplicationOptions>;
  }>;
}

export function bulkDuplicateCV(request: BulkDuplicationRequest): CVData[] {
  return request.variations.map(variation => {
    const baseOptions = getDuplicationOptionsForStrategy(variation.strategy);
    const finalOptions = {
      ...baseOptions,
      ...variation.customOptions,
      templateOverride: variation.templateOverride,
    };

    return duplicateCVData(request.baseCV, variation.name, finalOptions);
  });
}

/**
 * Smart duplication based on target role
 */
export interface RoleBasedDuplicationConfig {
  targetRole: string;
  targetIndustry?: string;
  emphasizeSkills: string[];
  deemphasizeSkills: string[];
  includeProjects: boolean;
  includeVolunteerWork: boolean;
  maxExperienceYears?: number;
}

export function duplicateForRole(
  originalData: CVData,
  newName: string,
  config: RoleBasedDuplicationConfig
): CVData {
  const duplicated = duplicateCVData(originalData, newName, {
    ...DEFAULT_DUPLICATION_OPTIONS,
    includePersonalProjects: config.includeProjects,
    includeVolunteerWork: config.includeVolunteerWork,
  });

  // Adjust skills based on role requirements
  const adjustedSkills = duplicated.skills.filter(skill => {
    // Remove deemphasized skills
    if (config.deemphasizeSkills.some(deemphasize => 
      skill.toLowerCase().includes(deemphasize.toLowerCase())
    )) {
      return false;
    }
    return true;
  });

  // Add emphasized skills if not already present
  config.emphasizeSkills.forEach(skill => {
    if (!adjustedSkills.some(existing => 
      existing.toLowerCase().includes(skill.toLowerCase())
    )) {
      adjustedSkills.unshift(skill);
    }
  });

  duplicated.skills = adjustedSkills;

  // Filter experience based on relevance and max years
  if (config.maxExperienceYears) {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - config.maxExperienceYears);

    duplicated.experience = duplicated.experience.filter(exp => {
      if (!exp.startDate) return true;
      return new Date(exp.startDate) >= cutoffDate;
    });
  }

  // Update metadata with role targeting
  duplicated.metadata = {
    lastModified: new Date().toISOString(),
    version: (duplicated.metadata?.version || 0) + 1,
    ...duplicated.metadata,
    targetRole: config.targetRole,
    targetIndustry: config.targetIndustry,
  };

  return duplicated;
}

/**
 * Duplication validation
 */
export interface DuplicationValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateDuplication(
  originalData: CVData,
  duplicatedData: CVData,
  options: DuplicationOptions
): DuplicationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate that duplicated data is valid
  try {
    validateAndSanitizeCVData(duplicatedData);
  } catch (error) {
    errors.push(`Duplicated CV data is invalid: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Check that required sections are preserved
  if (options.includeSensitiveData && !duplicatedData.contact.email) {
    warnings.push('Contact email was not preserved despite includeSensitiveData option');
  }

  if (options.includePersonalProjects && duplicatedData.projects.length === 0 && originalData.projects.length > 0) {
    warnings.push('Personal projects were not preserved despite includePersonalProjects option');
  }

  // Check for data integrity
  if (duplicatedData.name === originalData.name) {
    warnings.push('Duplicated CV has the same name as original');
  }

  // Validate section IDs are unique
  const allIds = [
    ...duplicatedData.experience.map(e => e.id).filter(Boolean),
    ...duplicatedData.education.map(e => e.id).filter(Boolean),
    ...duplicatedData.projects.map(p => p.id).filter(Boolean),
    ...duplicatedData.certifications.map(c => c.id).filter(Boolean),
    ...duplicatedData.customSections.map(s => s.id).filter(Boolean),
  ];

  const uniqueIds = new Set(allIds);
  if (allIds.length !== uniqueIds.size) {
    errors.push('Duplicate section IDs found in duplicated CV');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generate duplication summary
 */
export interface DuplicationSummary {
  originalSections: number;
  duplicatedSections: number;
  preservedData: string[];
  modifiedData: string[];
  removedData: string[];
}

export function generateDuplicationSummary(
  originalData: CVData,
  duplicatedData: CVData,
  options: DuplicationOptions
): DuplicationSummary {
  const preservedData: string[] = [];
  const modifiedData: string[] = [];
  const removedData: string[] = [];

  // Count sections
  const originalSections = [
    originalData.experience.length,
    originalData.education.length,
    originalData.projects.length,
    originalData.certifications.length,
    originalData.customSections.length,
  ].reduce((sum, count) => sum + count, 0);

  const duplicatedSections = [
    duplicatedData.experience.length,
    duplicatedData.education.length,
    duplicatedData.projects.length,
    duplicatedData.certifications.length,
    duplicatedData.customSections.length,
  ].reduce((sum, count) => sum + count, 0);

  // Analyze what was preserved, modified, or removed
  if (duplicatedData.contact.email === originalData.contact.email) {
    preservedData.push('Contact Information');
  } else if (options.anonymize || !options.includeSensitiveData) {
    modifiedData.push('Contact Information');
  }

  if (duplicatedData.experience.length === originalData.experience.length) {
    if (options.resetDates || options.anonymize) {
      modifiedData.push('Work Experience');
    } else {
      preservedData.push('Work Experience');
    }
  } else if (duplicatedData.experience.length === 0) {
    removedData.push('Work Experience');
  }

  if (!options.includePersonalProjects && originalData.projects.length > 0) {
    removedData.push('Personal Projects');
  } else if (duplicatedData.projects.length > 0) {
    preservedData.push('Personal Projects');
  }

  if (!options.includeVolunteerWork && originalData.volunteerWork.length > 0) {
    removedData.push('Volunteer Work');
  } else if (duplicatedData.volunteerWork.length > 0) {
    preservedData.push('Volunteer Work');
  }

  if (!options.includeCustomSections && originalData.customSections.length > 0) {
    removedData.push('Custom Sections');
  } else if (duplicatedData.customSections.length > 0) {
    preservedData.push('Custom Sections');
  }

  return {
    originalSections,
    duplicatedSections,
    preservedData,
    modifiedData,
    removedData,
  };
}