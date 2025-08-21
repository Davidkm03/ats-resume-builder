// Enhanced CV Data Models and Types

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  github?: string;
  portfolio?: string;
}

export interface Experience {
  id?: string;
  title: string;
  company: string;
  location: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  isPresent: boolean;
  description?: string;
  bullets: string[];
  skills?: string[];
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  gpa?: string;
  honors?: string;
  relevantCourses?: string[];
  description?: string;
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  technologies?: string[];
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  issueDate: string; // ISO date string
  expiryDate?: string; // ISO date string
  credentialId?: string;
  url?: string;
}

export interface CustomSection {
  id?: string;
  title: string;
  content?: string;
  type: 'text' | 'list' | 'bullets';
  items?: string[];
}

export interface Language {
  id?: string;
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
}

export interface Award {
  id?: string;
  title: string;
  issuer: string;
  date: string; // ISO date string
  description?: string;
}

export interface Publication {
  id?: string;
  title: string;
  publisher: string;
  date: string; // ISO date string
  url?: string;
  description?: string;
}

export interface VolunteerWork {
  id?: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  isPresent: boolean;
  description?: string;
  achievements?: string[];
}

// Main CV Data Structure
export interface CVData {
  id?: string;
  name: string;
  template: TemplateType;
  contact: ContactInfo;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  awards: Award[];
  publications: Publication[];
  volunteerWork: VolunteerWork[];
  customSections: CustomSection[];
  metadata?: CVMetadata;
}

export interface CVMetadata {
  lastModified: string; // ISO date string
  version: number;
  atsScore?: number;
  keywords?: string[];
  targetRole?: string;
  targetIndustry?: string;
}

// CV Database Model (matches Prisma schema)
export interface CVRecord {
  id: string;
  userId: string;
  name: string;
  description?: string;
  template: string;
  data: CVData;
  isPublic: boolean;
  shareToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Template Types
export type TemplateType = 
  | 'modern' 
  | 'classic' 
  | 'minimal' 
  | 'executive'
  | 'creative'
  | 'technical'
  | 'academic'
  | 'sales'
  | 'professional'
  | 'designer'
  | 'startup';

// Export Formats
export type ExportFormat = 'pdf' | 'docx' | 'txt' | 'json' | 'latex' | 'html';

// CV Creation and Update DTOs
export interface CreateCVRequest {
  name: string;
  description?: string;
  template?: TemplateType;
  data?: Partial<CVData>;
}

export interface UpdateCVRequest {
  name?: string;
  description?: string;
  template?: TemplateType;
  data?: Partial<CVData>;
  isPublic?: boolean;
}

export interface DuplicateCVRequest {
  name: string;
  description?: string;
}

// API Response Types
export interface CVListResponse {
  cvs: Array<{
    id: string;
    name: string;
    description?: string;
    template: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    atsScore?: number;
  }>;
  total: number;
  page: number;
  limit: number;
}

export interface CVResponse {
  cv: CVRecord;
}

export interface ShareableCVResponse {
  cv: {
    id: string;
    name: string;
    template: string;
    data: CVData;
    createdAt: string;
    updatedAt: string;
  };
}