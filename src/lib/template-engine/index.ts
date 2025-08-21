import { TemplateConfig, TemplateRegistryEntry, TemplateValidationResult, TemplateCustomization } from '@/types/template';
import { templateConfigSchema } from '@/types/template';

export class TemplateEngine {
  private static instance: TemplateEngine;
  private registry: Map<string, TemplateRegistryEntry> = new Map();

  private constructor() {}

  static getInstance(): TemplateEngine {
    if (!TemplateEngine.instance) {
      TemplateEngine.instance = new TemplateEngine();
    }
    return TemplateEngine.instance;
  }

  /**
   * Register a template in the system
   */
  registerTemplate(entry: TemplateRegistryEntry): void {
    const validation = this.validateTemplate(entry.config);
    if (!validation.isValid) {
      throw new Error(`Invalid template configuration: ${validation.errors.join(', ')}`);
    }
    
    this.registry.set(entry.id, entry);
  }

  /**
   * Get a template by ID
   */
  getTemplate(id: string): TemplateRegistryEntry | undefined {
    return this.registry.get(id);
  }

  /**
   * Get all templates, optionally filtered by category
   */
  getTemplates(filters?: {
    category?: string;
    isPremium?: boolean;
    tags?: string[];
  }): TemplateRegistryEntry[] {
    let templates = Array.from(this.registry.values());

    if (filters) {
      if (filters.category) {
        templates = templates.filter(t => t.category === filters.category);
      }
      if (filters.isPremium !== undefined) {
        templates = templates.filter(t => t.isPremium === filters.isPremium);
      }
      if (filters.tags && filters.tags.length > 0) {
        templates = templates.filter(t => 
          filters.tags!.some(tag => t.config.metadata.tags.includes(tag))
        );
      }
    }

    return templates.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Validate a template configuration
   */
  validateTemplate(config: TemplateConfig): TemplateValidationResult {
    try {
      templateConfigSchema.parse(config);
      
      const warnings: string[] = [];
      
      // Additional validation rules
      if (config.colors.primary === config.colors.background) {
        warnings.push('Primary color is the same as background color, which may cause readability issues');
      }
      
      if (config.typography.fontSize.base < 10) {
        warnings.push('Base font size is very small and may be hard to read');
      }

      return {
        isValid: true,
        errors: [],
        warnings,
      };
    } catch (error: any) {
      return {
        isValid: false,
        errors: error.errors?.map((e: any) => e.message) || ['Invalid template configuration'],
        warnings: [],
      };
    }
  }

  /**
   * Customize a template with user preferences
   */
  customizeTemplate(templateId: string, customization: TemplateCustomization): TemplateConfig | null {
    const template = this.getTemplate(templateId);
    if (!template) {
      return null;
    }

    const customizedConfig: TemplateConfig = {
      ...template.config,
      id: `${template.config.id}-custom-${Date.now()}`,
      name: `${template.config.name} (Custom)`,
    };

    // Apply customizations
    if (customization.colors) {
      customizedConfig.colors = { ...customizedConfig.colors, ...customization.colors };
    }

    if (customization.typography) {
      customizedConfig.typography = { 
        ...customizedConfig.typography, 
        ...customization.typography,
        fontSize: {
          ...customizedConfig.typography.fontSize,
          ...customization.typography.fontSize,
        },
        fontWeight: {
          ...customizedConfig.typography.fontWeight,
          ...customization.typography.fontWeight,
        },
      };
    }

    if (customization.layout) {
      customizedConfig.layout = {
        ...customizedConfig.layout,
        ...customization.layout,
        spacing: {
          ...customizedConfig.layout.spacing,
          ...customization.layout.spacing,
        },
        borders: {
          ...customizedConfig.layout.borders,
          ...customization.layout.borders,
        },
        alignment: {
          ...customizedConfig.layout.alignment,
          ...customization.layout.alignment,
        },
      };
    }

    if (customization.sections) {
      Object.entries(customization.sections).forEach(([sectionKey, sectionCustomization]) => {
        if (customizedConfig.sections[sectionKey as keyof typeof customizedConfig.sections]) {
          (customizedConfig.sections as any)[sectionKey] = {
            ...customizedConfig.sections[sectionKey as keyof typeof customizedConfig.sections],
            ...sectionCustomization,
          };
        }
      });
    }

    // Update metadata
    customizedConfig.metadata.updatedAt = new Date().toISOString();

    const validation = this.validateTemplate(customizedConfig);
    if (!validation.isValid) {
      throw new Error(`Customization resulted in invalid template: ${validation.errors.join(', ')}`);
    }

    return customizedConfig;
  }

  /**
   * Generate CSS variables from template configuration
   */
  generateCSSVariables(config: TemplateConfig): Record<string, string> {
    return {
      // Colors
      '--template-color-primary': config.colors.primary,
      '--template-color-secondary': config.colors.secondary || config.colors.primary,
      '--template-color-accent': config.colors.accent || config.colors.primary,
      '--template-color-text': config.colors.text,
      '--template-color-background': config.colors.background,
      '--template-color-border': config.colors.border || '#e5e7eb',

      // Typography
      '--template-font-family': this.getFontFamily(config.typography.fontFamily, config.typography.customFont),
      '--template-font-size-base': `${config.typography.fontSize.base}px`,
      '--template-font-size-heading': `${config.typography.fontSize.heading}px`,
      '--template-font-size-small': `${config.typography.fontSize.small}px`,
      '--template-line-height': config.typography.lineHeight.toString(),
      '--template-font-weight-normal': config.typography.fontWeight.normal.toString(),
      '--template-font-weight-bold': config.typography.fontWeight.bold.toString(),

      // Layout
      '--template-spacing-section': `${config.layout.spacing.section}px`,
      '--template-spacing-element': `${config.layout.spacing.element}px`,
      '--template-spacing-margin': `${config.layout.spacing.margin}px`,
      '--template-spacing-padding': `${config.layout.spacing.padding}px`,
      '--template-border-width': `${config.layout.borders.width}px`,
      '--template-border-radius': `${config.layout.borders.radius}px`,
      '--template-border-style': config.layout.borders.style,
    };
  }

  /**
   * Get CSS font family string
   */
  private getFontFamily(family: string, customFont?: string): string {
    switch (family) {
      case 'serif':
        return 'Georgia, "Times New Roman", Times, serif';
      case 'sans-serif':
        return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      case 'monospace':
        return 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace';
      case 'custom':
        return customFont || 'system-ui, sans-serif';
      default:
        return 'system-ui, sans-serif';
    }
  }

  /**
   * Get template categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.registry.forEach(template => {
      categories.add(template.category);
    });
    return Array.from(categories).sort();
  }

  /**
   * Search templates by text
   */
  searchTemplates(query: string): TemplateRegistryEntry[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.registry.values()).filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.config.metadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      template.config.metadata.industries.some(industry => industry.toLowerCase().includes(lowercaseQuery)) ||
      template.config.metadata.roles.some(role => role.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Get recommended templates based on user profile
   */
  getRecommendedTemplates(userProfile: {
    industry?: string;
    role?: string;
    experience?: 'entry' | 'mid' | 'senior' | 'executive';
    preferences?: string[];
  }): TemplateRegistryEntry[] {
    let templates = Array.from(this.registry.values());

    // Filter by industry
    if (userProfile.industry) {
      templates = templates.filter(t => 
        t.config.metadata.industries.includes(userProfile.industry!)
      );
    }

    // Filter by role
    if (userProfile.role) {
      templates = templates.filter(t => 
        t.config.metadata.roles.includes(userProfile.role!)
      );
    }

    // Filter by experience level
    if (userProfile.experience) {
      const experienceTags = {
        entry: ['entry-level', 'graduate', 'junior'],
        mid: ['mid-level', 'experienced', 'professional'],
        senior: ['senior', 'lead', 'principal'],
        executive: ['executive', 'director', 'c-level'],
      };

      templates = templates.filter(t => 
        experienceTags[userProfile.experience!].some(tag => 
          t.config.metadata.tags.includes(tag)
        )
      );
    }

    // Sort by relevance (number of matching tags/industries/roles)
    return templates.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      if (userProfile.industry) {
        if (a.config.metadata.industries.includes(userProfile.industry)) scoreA += 2;
        if (b.config.metadata.industries.includes(userProfile.industry)) scoreB += 2;
      }

      if (userProfile.role) {
        if (a.config.metadata.roles.includes(userProfile.role)) scoreA += 2;
        if (b.config.metadata.roles.includes(userProfile.role)) scoreB += 2;
      }

      if (userProfile.preferences) {
        scoreA += userProfile.preferences.filter(pref => a.config.metadata.tags.includes(pref)).length;
        scoreB += userProfile.preferences.filter(pref => b.config.metadata.tags.includes(pref)).length;
      }

      return scoreB - scoreA;
    });
  }

  /**
   * Clone a template configuration
   */
  cloneTemplate(templateId: string, newName?: string): TemplateConfig | null {
    const template = this.getTemplate(templateId);
    if (!template) {
      return null;
    }

    const clonedConfig: TemplateConfig = {
      ...template.config,
      id: `${template.config.id}-clone-${Date.now()}`,
      name: newName || `${template.config.name} (Copy)`,
      metadata: {
        ...template.config.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    return clonedConfig;
  }
}

// Export singleton instance
export const templateEngine = TemplateEngine.getInstance();

// Re-export types for convenience
export type { TemplateConfig, TemplateRegistryEntry, TemplateRenderProps } from '@/types/template';