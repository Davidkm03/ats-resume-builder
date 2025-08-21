import { z } from 'zod';

// Template configuration schemas
export const templateColorSchema = z.object({
  primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional(),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional(),
  text: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  background: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  border: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional(),
});

export const templateTypographySchema = z.object({
  fontFamily: z.enum(['serif', 'sans-serif', 'monospace', 'custom']),
  customFont: z.string().optional(),
  fontSize: z.object({
    base: z.number().min(8).max(20),
    heading: z.number().min(12).max(36),
    small: z.number().min(6).max(16),
  }),
  lineHeight: z.number().min(1).max(2.5),
  fontWeight: z.object({
    normal: z.number().min(100).max(900),
    bold: z.number().min(100).max(900),
  }),
});

export const templateLayoutSchema = z.object({
  type: z.enum(['single-column', 'two-column', 'three-column', 'mixed']),
  spacing: z.object({
    section: z.number().min(0).max(100),
    element: z.number().min(0).max(50),
    margin: z.number().min(0).max(100),
    padding: z.number().min(0).max(50),
  }),
  borders: z.object({
    enabled: z.boolean(),
    style: z.enum(['solid', 'dashed', 'dotted', 'none']),
    width: z.number().min(0).max(10),
    radius: z.number().min(0).max(20),
  }),
  alignment: z.object({
    text: z.enum(['left', 'center', 'right', 'justify']),
    sections: z.enum(['left', 'center', 'right']),
  }),
});

export const templateSectionConfigSchema = z.object({
  enabled: z.boolean(),
  order: z.number(),
  title: z.string().optional(),
  style: z.enum(['default', 'highlighted', 'minimal', 'bordered']),
  columns: z.number().min(1).max(3).optional(),
  customStyles: z.record(z.string()).optional(),
});

export const templateConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['professional', 'creative', 'academic', 'technical', 'executive']),
  isPremium: z.boolean(),
  version: z.number(),
  colors: templateColorSchema,
  typography: templateTypographySchema,
  layout: templateLayoutSchema,
  sections: z.object({
    header: templateSectionConfigSchema,
    summary: templateSectionConfigSchema,
    experience: templateSectionConfigSchema,
    education: templateSectionConfigSchema,
    skills: templateSectionConfigSchema,
    projects: templateSectionConfigSchema,
    certifications: templateSectionConfigSchema,
    languages: templateSectionConfigSchema,
    awards: templateSectionConfigSchema,
    publications: templateSectionConfigSchema,
    volunteer: templateSectionConfigSchema,
    custom: templateSectionConfigSchema,
  }),
  metadata: z.object({
    author: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    tags: z.array(z.string()),
    industries: z.array(z.string()),
    roles: z.array(z.string()),
  }),
});

// Type definitions
export type TemplateColor = z.infer<typeof templateColorSchema>;
export type TemplateTypography = z.infer<typeof templateTypographySchema>;
export type TemplateLayout = z.infer<typeof templateLayoutSchema>;
export type TemplateSectionConfig = z.infer<typeof templateSectionConfigSchema>;
export type TemplateConfig = z.infer<typeof templateConfigSchema>;

// Template category types
export type TemplateCategory = 'professional' | 'creative' | 'academic' | 'technical' | 'executive';

// Template rendering props
export interface TemplateRenderProps {
  config: TemplateConfig;
  data: any; // CV data
  mode: 'preview' | 'print' | 'export';
  scale?: number;
  className?: string;
}

// Template registry interface
export interface TemplateRegistryEntry {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  isPremium: boolean;
  component: React.ComponentType<TemplateRenderProps>;
  config: TemplateConfig;
  thumbnail?: string;
  preview?: string;
}

// Template validation result
export interface TemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Template customization options
export interface TemplateCustomization {
  colors?: Partial<TemplateColor>;
  typography?: Partial<TemplateTypography>;
  layout?: Partial<TemplateLayout>;
  sections?: Partial<Record<string, Partial<TemplateSectionConfig>>>;
}

// Template export options
export interface TemplateExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'json';
  quality: 'draft' | 'standard' | 'high';
  includeMetadata: boolean;
  customStyles?: string;
}

// Default template configurations
export const DEFAULT_COLORS: TemplateColor = {
  primary: '#2563eb',
  secondary: '#64748b',
  accent: '#0ea5e9',
  text: '#1f2937',
  background: '#ffffff',
  border: '#e5e7eb',
};

export const DEFAULT_TYPOGRAPHY: TemplateTypography = {
  fontFamily: 'sans-serif',
  fontSize: {
    base: 14,
    heading: 24,
    small: 12,
  },
  lineHeight: 1.5,
  fontWeight: {
    normal: 400,
    bold: 600,
  },
};

export const DEFAULT_LAYOUT: TemplateLayout = {
  type: 'single-column',
  spacing: {
    section: 24,
    element: 12,
    margin: 32,
    padding: 16,
  },
  borders: {
    enabled: false,
    style: 'solid',
    width: 1,
    radius: 4,
  },
  alignment: {
    text: 'left',
    sections: 'left',
  },
};

export const DEFAULT_SECTION_CONFIG: TemplateSectionConfig = {
  enabled: true,
  order: 0,
  style: 'default',
  columns: 1,
};