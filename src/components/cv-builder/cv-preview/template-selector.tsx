"use client";

import { useState } from 'react';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { TemplateType } from '@/types/cv';
import { Button } from '@/components/ui';
import { 
  SwatchIcon, 
  CheckIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import ModernTemplate from './templates/modern-template';
import ClassicTemplate from './templates/classic-template';
import MinimalTemplate from './templates/minimal-template';
import ExecutiveTemplate from './templates/executive-template';
import CreativeTemplate from './templates/creative-template';
import TechnicalTemplate from './templates/technical-template';
import AcademicTemplate from './templates/academic-template';
import SalesTemplate from './templates/sales-template';

const TEMPLATES: Array<{
  id: TemplateType;
  name: string;
  description: string;
  features: string[];
  preview: React.ComponentType<any>;
}> = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, professional design with color accents',
    features: ['Color header', 'Two-column layout', 'Skills tags', 'Timeline design'],
    preview: ModernTemplate,
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional, formal resume layout',
    features: ['Traditional serif fonts', 'Simple borders', 'Academic style', 'Conservative design'],
    preview: ClassicTemplate,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, modern design with lots of white space',
    features: ['Sans-serif typography', 'Minimal styling', 'Focus on content', 'Spacious layout'],
    preview: MinimalTemplate,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior leadership roles',
    features: ['Executive styling', 'Formal layout', 'Achievement focus', 'Leadership emphasis'],
    preview: ExecutiveTemplate,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant design for creative professionals',
    features: ['Gradient colors', 'Visual elements', 'Portfolio focus', 'Design-oriented'],
    preview: CreativeTemplate,
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Code-inspired design for developers and engineers',
    features: ['Terminal styling', 'Code blocks', 'Tech focus', 'Developer-friendly'],
    preview: TechnicalTemplate,
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Scholarly design for researchers and academics',
    features: ['Research focus', 'Publication emphasis', 'Academic formatting', 'Traditional style'],
    preview: AcademicTemplate,
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Results-driven design for sales professionals',
    features: ['Achievement metrics', 'Performance focus', 'Dynamic layout', 'Results emphasis'],
    preview: SalesTemplate,
  },
];

interface TemplateSelectorProps {
  className?: string;
  onTemplateChange?: (template: TemplateType) => void;
}

export default function TemplateSelector({ className, onTemplateChange }: TemplateSelectorProps) {
  const { cvData, updateCVData, getCVData } = useCVBuilderStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateType | null>(null);

  const currentTemplate = cvData.template || 'modern';
  const completeCVData = getCVData();

  const handleTemplateSelect = (templateId: TemplateType) => {
    // Data is preserved automatically since we're only changing the template property
    updateCVData({ template: templateId });
    onTemplateChange?.(templateId);
    setPreviewTemplate(null);
    setIsExpanded(false);
  };

  const handlePreview = (templateId: TemplateType) => {
    setPreviewTemplate(templateId);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  const selectedTemplate = TEMPLATES.find(t => t.id === currentTemplate);

  return (
    <>
      <div className={cn("bg-white border border-gray-200 rounded-lg", className)}>
        {/* Header */}
        <div 
          className="p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SwatchIcon className="h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">Template</h3>
                <p className="text-sm text-gray-600">
                  {selectedTemplate?.name || 'Unknown'} - {selectedTemplate?.description || ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {TEMPLATES.length} available
              </span>
              {isExpanded ? (
                <ChevronUpIcon className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Template Grid */}
        {isExpanded && (
          <div className="border-t border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    template.id === currentTemplate
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  )}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  {/* Template Preview Thumbnail */}
                  <div className="h-32 bg-gray-100 rounded mb-3 relative overflow-hidden">
                    <div className="absolute inset-2 bg-white rounded shadow-sm">
                      {/* Mini preview content */}
                      <div className="p-2 space-y-1">
                        <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-1 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-1 bg-gray-200 rounded w-full"></div>
                        <div className="h-1 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                    
                    {/* Preview Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(template.id);
                      }}
                      className="absolute top-2 right-2 bg-white shadow-sm border border-gray-200 rounded p-1 hover:bg-gray-50 transition-colors"
                    >
                      <EyeIcon className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>

                  {/* Template Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      {template.id === currentTemplate && (
                        <CheckIcon className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600">{template.description}</p>
                    
                    {/* Features */}
                    <div className="space-y-1">
                      {template.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-500">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <div className="mt-4 text-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                Close Template Selector
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Full Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {TEMPLATES.find(t => t.id === previewTemplate)?.name} Template Preview
                  </h3>
                  <p className="text-sm text-gray-600">
                    Preview how your CV will look with this template
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handleTemplateSelect(previewTemplate)}
                    disabled={previewTemplate === currentTemplate}
                  >
                    {previewTemplate === currentTemplate ? 'Current Template' : 'Use This Template'}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={closePreview}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>

            {/* Template Preview */}
            <div className="p-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="bg-white rounded shadow-lg max-h-96 overflow-auto">
                  {(() => {
                    const PreviewComponent = TEMPLATES.find(t => t.id === previewTemplate)?.preview;
                    return PreviewComponent ? (
                      <PreviewComponent
                        data={completeCVData}
                        isPreview={true}
                        className="transform scale-75 origin-top"
                      />
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}