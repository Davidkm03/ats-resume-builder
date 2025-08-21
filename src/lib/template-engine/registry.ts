import { TemplateEngine } from './index';
import { TemplateRegistryEntry, TemplateConfig } from '@/types/template';
import { DEFAULT_COLORS, DEFAULT_TYPOGRAPHY, DEFAULT_LAYOUT, DEFAULT_SECTION_CONFIG } from '@/types/template';

// Import template components
import ModernTemplateV2 from '@/components/templates/modern-template-v2';
import ClassicTemplate from '@/components/templates/classic-template';
import MinimalTemplate from '@/components/templates/minimal-template';

// Import additional templates from cv-preview
import CreativeTemplate from '@/components/cv-builder/cv-preview/templates/creative-template';
import TechnicalTemplate from '@/components/cv-builder/cv-preview/templates/technical-template';
import AcademicTemplate from '@/components/cv-builder/cv-preview/templates/academic-template';
import SalesTemplate from '@/components/cv-builder/cv-preview/templates/sales-template';
import ExecutiveTemplate from '@/components/cv-builder/cv-preview/templates/executive-template';

// Template configurations
const createSectionConfig = (overrides: Partial<typeof DEFAULT_SECTION_CONFIG> = {}) => ({
  ...DEFAULT_SECTION_CONFIG,
  ...overrides,
});

const createSectionsConfig = () => ({
  header: createSectionConfig({ order: 1 }),
  summary: createSectionConfig({ order: 2 }),
  experience: createSectionConfig({ order: 3 }),
  education: createSectionConfig({ order: 4 }),
  skills: createSectionConfig({ order: 5 }),
  projects: createSectionConfig({ order: 6 }),
  certifications: createSectionConfig({ order: 7, enabled: false }),
  languages: createSectionConfig({ order: 8, enabled: false }),
  awards: createSectionConfig({ order: 9, enabled: false }),
  publications: createSectionConfig({ order: 10, enabled: false }),
  volunteer: createSectionConfig({ order: 11, enabled: false }),
  custom: createSectionConfig({ order: 12, enabled: false }),
});

// Modern Template Configuration
const modernTemplateConfig: TemplateConfig = {
  id: 'modern',
  name: 'Modern Professional',
  description: 'A contemporary template with gradient header, timeline experience layout, and modern design elements',
  category: 'professional',
  isPremium: false,
  version: 2,
  colors: {
    ...DEFAULT_COLORS,
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#0ea5e9',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontFamily: 'sans-serif',
    fontSize: {
      base: 14,
      heading: 28,
      small: 12,
    },
    lineHeight: 1.6,
  },
  layout: {
    ...DEFAULT_LAYOUT,
    type: 'two-column',
    spacing: {
      section: 32,
      element: 16,
      margin: 24,
      padding: 20,
    },
  },
  sections: createSectionsConfig(),
  metadata: {
    author: 'ATS Web Team',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['modern', 'professional', 'gradient', 'timeline', 'two-column'],
    industries: ['technology', 'business', 'consulting', 'finance', 'marketing'],
    roles: ['software-engineer', 'product-manager', 'analyst', 'consultant', 'designer'],
  },
};

// Classic Template Configuration
const classicTemplateConfig: TemplateConfig = {
  id: 'classic',
  name: 'Classic Traditional',
  description: 'A timeless template with centered header, traditional formatting, and professional appearance',
  category: 'professional',
  isPremium: false,
  version: 1,
  colors: {
    ...DEFAULT_COLORS,
    primary: '#1f2937',
    secondary: '#6b7280',
    accent: '#374151',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontFamily: 'serif',
    fontSize: {
      base: 14,
      heading: 24,
      small: 12,
    },
    lineHeight: 1.5,
  },
  layout: {
    ...DEFAULT_LAYOUT,
    type: 'single-column',
    spacing: {
      section: 24,
      element: 12,
      margin: 20,
      padding: 16,
    },
  },
  sections: createSectionsConfig(),
  metadata: {
    author: 'ATS Web Team',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['classic', 'traditional', 'serif', 'centered', 'formal'],
    industries: ['law', 'finance', 'academia', 'government', 'healthcare'],
    roles: ['lawyer', 'accountant', 'professor', 'doctor', 'analyst'],
  },
};

// Minimal Template Configuration
const minimalTemplateConfig: TemplateConfig = {
  id: 'minimal',
  name: 'Clean Minimal',
  description: 'A clean, minimalist template with subtle styling and maximum content focus',
  category: 'professional',
  isPremium: false,
  version: 1,
  colors: {
    ...DEFAULT_COLORS,
    primary: '#000000',
    secondary: '#6b7280',
    accent: '#374151',
    text: '#1f2937',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontFamily: 'sans-serif',
    fontSize: {
      base: 14,
      heading: 20,
      small: 12,
    },
    lineHeight: 1.4,
  },
  layout: {
    ...DEFAULT_LAYOUT,
    type: 'single-column',
    spacing: {
      section: 20,
      element: 10,
      margin: 16,
      padding: 12,
    },
    borders: {
      enabled: true,
      style: 'solid',
      width: 1,
      radius: 0,
    },
  },
  sections: createSectionsConfig(),
  metadata: {
    author: 'ATS Web Team',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['minimal', 'clean', 'simple', 'modern', 'content-focused'],
    industries: ['technology', 'design', 'startup', 'creative', 'consulting'],
    roles: ['developer', 'designer', 'startup-founder', 'freelancer', 'consultant'],
  },
};

// Creative Template Configuration
const creativeTemplateConfig: TemplateConfig = {
  id: 'creative',
  name: 'Creative Professional',
  description: 'A vibrant template with gradient backgrounds and modern visual elements',
  category: 'creative',
  isPremium: false,
  version: 1,
  colors: {
    ...DEFAULT_COLORS,
    primary: '#8b5cf6',
    secondary: '#ec4899',
    accent: '#f97316',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontFamily: 'sans-serif',
    fontSize: {
      base: 14,
      heading: 26,
      small: 12,
    },
    lineHeight: 1.6,
  },
  layout: {
    ...DEFAULT_LAYOUT,
    type: 'single-column',
    spacing: {
      section: 28,
      element: 14,
      margin: 20,
      padding: 24,
    },
  },
  sections: createSectionsConfig(),
  metadata: {
    author: 'ATS Web Team',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['creative', 'colorful', 'gradient', 'modern', 'artistic'],
    industries: ['design', 'marketing', 'creative', 'media', 'advertising'],
    roles: ['designer', 'artist', 'marketer', 'creative-director', 'photographer'],
  },
};

// Technical Template Configuration
const technicalTemplateConfig: TemplateConfig = {
  id: 'technical',
  name: 'Technical Professional',
  description: 'A structured template optimized for technical roles and engineering positions',
  category: 'professional',
  isPremium: false,
  version: 1,
  colors: {
    ...DEFAULT_COLORS,
    primary: '#059669',
    secondary: '#6b7280',
    accent: '#0d9488',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontFamily: 'monospace',
    fontSize: {
      base: 13,
      heading: 22,
      small: 11,
    },
    lineHeight: 1.5,
  },
  layout: {
    ...DEFAULT_LAYOUT,
    type: 'two-column',
    spacing: {
      section: 20,
      element: 12,
      margin: 16,
      padding: 16,
    },
  },
  sections: createSectionsConfig(),
  metadata: {
    author: 'ATS Web Team',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['technical', 'engineering', 'structured', 'mono', 'code'],
    industries: ['technology', 'software', 'engineering', 'data', 'cybersecurity'],
    roles: ['software-engineer', 'data-scientist', 'devops', 'architect', 'developer'],
  },
};

// Executive Template Configuration
const executiveTemplateConfig: TemplateConfig = {
  id: 'executive',
  name: 'Executive Professional',
  description: 'An elegant template designed for senior leadership and executive positions',
  category: 'executive',
  isPremium: true,
  version: 1,
  colors: {
    ...DEFAULT_COLORS,
    primary: '#1e40af',
    secondary: '#64748b',
    accent: '#3b82f6',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontFamily: 'serif',
    fontSize: {
      base: 15,
      heading: 30,
      small: 13,
    },
    lineHeight: 1.7,
  },
  layout: {
    ...DEFAULT_LAYOUT,
    type: 'single-column',
    spacing: {
      section: 36,
      element: 18,
      margin: 28,
      padding: 24,
    },
  },
  sections: createSectionsConfig(),
  metadata: {
    author: 'ATS Web Team',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['executive', 'leadership', 'elegant', 'premium', 'serif'],
    industries: ['finance', 'consulting', 'executive', 'leadership', 'strategy'],
    roles: ['ceo', 'cto', 'director', 'vp', 'executive'],
  },
};

// Academic Template Configuration
const academicTemplateConfig: TemplateConfig = {
  id: 'academic',
  name: 'Academic Professional',
  description: 'A scholarly template designed for academic and research positions',
  category: 'academic',
  isPremium: false,
  version: 1,
  colors: {
    ...DEFAULT_COLORS,
    primary: '#7c2d12',
    secondary: '#6b7280',
    accent: '#a16207',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontFamily: 'serif',
    fontSize: {
      base: 14,
      heading: 24,
      small: 12,
    },
    lineHeight: 1.6,
  },
  layout: {
    ...DEFAULT_LAYOUT,
    type: 'single-column',
    spacing: {
      section: 24,
      element: 14,
      margin: 20,
      padding: 18,
    },
  },
  sections: createSectionsConfig(),
  metadata: {
    author: 'ATS Web Team',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['academic', 'research', 'scholarly', 'publications', 'formal'],
    industries: ['education', 'research', 'academia', 'science', 'government'],
    roles: ['professor', 'researcher', 'scientist', 'academic', 'postdoc'],
  },
};

// Sales Template Configuration
const salesTemplateConfig: TemplateConfig = {
  id: 'sales',
  name: 'Sales Professional',
  description: 'A results-focused template optimized for sales and business development roles',
  category: 'professional',
  isPremium: false,
  version: 1,
  colors: {
    ...DEFAULT_COLORS,
    primary: '#dc2626',
    secondary: '#6b7280',
    accent: '#ea580c',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontFamily: 'sans-serif',
    fontSize: {
      base: 14,
      heading: 26,
      small: 12,
    },
    lineHeight: 1.6,
  },
  layout: {
    ...DEFAULT_LAYOUT,
    type: 'two-column',
    spacing: {
      section: 28,
      element: 16,
      margin: 22,
      padding: 20,
    },
  },
  sections: createSectionsConfig(),
  metadata: {
    author: 'ATS Web Team',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['sales', 'business', 'results', 'metrics', 'achievement'],
    industries: ['sales', 'business-development', 'real-estate', 'insurance', 'retail'],
    roles: ['sales-rep', 'account-manager', 'business-developer', 'sales-manager', 'closer'],
  },
};

// Template registry entries
const templateEntries: TemplateRegistryEntry[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'A contemporary template with gradient header and timeline layout',
    category: 'professional',
    isPremium: false,
    component: ModernTemplateV2,
    config: modernTemplateConfig,
    thumbnail: '/templates/modern-thumbnail.jpg',
    preview: '/templates/modern-preview.jpg',
  },
  {
    id: 'classic',
    name: 'Classic Traditional',
    description: 'A timeless template with centered header and traditional formatting',
    category: 'professional',
    isPremium: false,
    component: ClassicTemplate,
    config: classicTemplateConfig,
    thumbnail: '/templates/classic-thumbnail.jpg',
    preview: '/templates/classic-preview.jpg',
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    description: 'A clean, minimalist template with subtle styling',
    category: 'professional',
    isPremium: false,
    component: MinimalTemplate,
    config: minimalTemplateConfig,
    thumbnail: '/templates/minimal-thumbnail.jpg',
    preview: '/templates/minimal-preview.jpg',
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    description: 'A vibrant template with gradient backgrounds and modern visual elements',
    category: 'creative',
    isPremium: false,
    component: CreativeTemplate,
    config: creativeTemplateConfig,
    thumbnail: '/templates/creative-thumbnail.jpg',
    preview: '/templates/creative-preview.jpg',
  },
  {
    id: 'technical',
    name: 'Technical Professional',
    description: 'A structured template optimized for technical roles',
    category: 'professional',
    isPremium: false,
    component: TechnicalTemplate,
    config: technicalTemplateConfig,
    thumbnail: '/templates/technical-thumbnail.jpg',
    preview: '/templates/technical-preview.jpg',
  },
  {
    id: 'executive',
    name: 'Executive Professional',
    description: 'An elegant template designed for senior leadership positions',
    category: 'executive',
    isPremium: true,
    component: ExecutiveTemplate,
    config: executiveTemplateConfig,
    thumbnail: '/templates/executive-thumbnail.jpg',
    preview: '/templates/executive-preview.jpg',
  },
  {
    id: 'academic',
    name: 'Academic Professional',
    description: 'A scholarly template designed for academic positions',
    category: 'academic',
    isPremium: false,
    component: AcademicTemplate,
    config: academicTemplateConfig,
    thumbnail: '/templates/academic-thumbnail.jpg',
    preview: '/templates/academic-preview.jpg',
  },
  {
    id: 'sales',
    name: 'Sales Professional',
    description: 'A results-focused template optimized for sales roles',
    category: 'professional',
    isPremium: false,
    component: SalesTemplate,
    config: salesTemplateConfig,
    thumbnail: '/templates/sales-thumbnail.jpg',
    preview: '/templates/sales-preview.jpg',
  },
];

// Track registration status
let templatesRegistered = false;

// Register all templates (with duplicate protection)
export function registerAllTemplates(): void {
  if (templatesRegistered) {
    return; // Already registered, skip
  }

  templateEntries.forEach(entry => {
    try {
      TemplateEngine.getInstance().registerTemplate(entry);
      console.log(`✓ Registered template: ${entry.name}`);
    } catch (error) {
      console.error(`✗ Failed to register template ${entry.name}:`, error);
    }
  });
  
  templatesRegistered = true;
  console.log('✓ All templates registered successfully');
}

// Get template component by ID
export function getTemplateComponent(templateId: string): React.ComponentType<any> | null {
  const template = TemplateEngine.getInstance().getTemplate(templateId);
  return template?.component || null;
}

// Export template configurations for external use
export const TEMPLATE_CONFIGS = {
  modern: modernTemplateConfig,
  classic: classicTemplateConfig,
  minimal: minimalTemplateConfig,
  creative: creativeTemplateConfig,
  technical: technicalTemplateConfig,
  executive: executiveTemplateConfig,
  academic: academicTemplateConfig,
  sales: salesTemplateConfig,
};

// Initialize templates on module load
if (typeof window !== 'undefined') {
  // Only register in client-side environment
  registerAllTemplates();
}

export { templateEntries };