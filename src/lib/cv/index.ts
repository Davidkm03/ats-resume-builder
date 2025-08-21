// CV Data Models and Types
export * from '@/types/cv';

// Validation Schemas
export * from '@/lib/validations/cv';

// Transformation Utilities
export * from '@/lib/utils/cv-transforms';

// Sharing Utilities
export * from '@/lib/utils/cv-sharing';

// Duplication Utilities
export * from '@/lib/utils/cv-duplication';

// Re-export commonly used types and functions for convenience
export type {
  CVData,
  CVRecord,
  ContactInfo,
  Experience,
  Education,
  Project,
  Certification,
  Language,
  Award,
  Publication,
  VolunteerWork,
  CustomSection,
  CVMetadata,
  TemplateType,
  ExportFormat,
  CreateCVRequest,
  UpdateCVRequest,
  DuplicateCVRequest,
  CVListResponse,
  CVResponse,
  ShareableCVResponse,
} from '@/types/cv';

export {
  contactInfoSchema,
  experienceSchema,
  educationSchema,
  projectSchema,
  certificationSchema,
  cvDataSchema,
  createCVRequestSchema,
  updateCVRequestSchema,
  duplicateCVRequestSchema,
  exportFormatSchema,
  cvListQuerySchema,
} from '@/lib/validations/cv';

export {
  createDefaultCVData,
  validateAndSanitizeCVData,
  mergeCVData,
  extractKeywordsFromCV,
  calculateCVCompleteness,
  generateShareToken,
  sanitizeCVForPublicSharing,
  convertCVToPlainText,
  validateDateRange,
  formatDateForDisplay,
  generateSectionId,
  transformCVRecordToResponse,
  transformCVDataForStorage,
} from '@/lib/utils/cv-transforms';

export {
  sanitizeCVForSharing,
  generateShareURL,
  isValidShareToken,
  generateShareMetadata,
  isShareExpired,
  generateTimeLimitedShareToken,
  validateShareAccess,
  SharePermission,
  DEFAULT_SHARE_CONFIG,
} from '@/lib/utils/cv-sharing';

export {
  duplicateCVData,
  getDuplicationOptionsForStrategy,
  bulkDuplicateCV,
  duplicateForRole,
  validateDuplication,
  generateDuplicationSummary,
  DuplicationStrategy,
  DEFAULT_DUPLICATION_OPTIONS,
} from '@/lib/utils/cv-duplication';