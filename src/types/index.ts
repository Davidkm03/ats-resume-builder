// Re-export CV types from dedicated CV types file
export * from './cv';

// Legacy type aliases for backward compatibility
export type { ContactInfo, Experience, Education, Project, Certification, CustomSection, CVData, TemplateType, ExportFormat } from './cv';

export interface AISuggestion {
  type: 'content' | 'structure' | 'keywords' | 'optimization';
  section: string;
  suggestion: string;
  confidence: number;
  premium: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  subscriptionTier: 'free' | 'premium';
  subscriptionExpiresAt?: Date;
}

export interface APIError {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}