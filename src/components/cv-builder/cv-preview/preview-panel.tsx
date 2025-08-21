"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { CVData, TemplateType } from '@/types/cv';
import { useResponsivePreview, BreakpointSize } from '@/hooks/use-responsive-preview';
import { Button } from '@/components/ui';
import { 
  Eye,
  EyeOff,
  Download,
  Share2,
  Smartphone,
  Monitor,
  Tablet,
  Maximize,
  Minimize,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { templateEngine } from '@/lib/template-engine';
import { getTemplateComponent } from '@/lib/template-engine/registry';
import { TemplateRenderProps } from '@/types/template';
import { PDFExportService } from '@/lib/pdf-export';

interface PreviewPanelProps {
  className?: string;
  onExport?: (format: 'pdf' | 'docx') => void;
  onShare?: () => void;
}

const PREVIEW_SIZE_ICONS = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
  xl: Monitor,
};

export default function PreviewPanel({ 
  className, 
  onExport, 
  onShare 
}: PreviewPanelProps) {
  const { cvData, getCVData } = useCVBuilderStore();
  const [isVisible, setIsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use responsive preview hook
  const {
    currentSize,
    getScaleFactor,
    getViewportDimensions,
    setPreviewSize,
    isSize,
  } = useResponsivePreview({ defaultSize: 'desktop', autoDetect: false });

  // Get complete CV data - only depend on cvData changes
  const completeCVData = useMemo(() => getCVData(), [cvData]);

  // Calculate scale for current container
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || isSize('xl')) {
        setScale(1);
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const newScale = getScaleFactor(containerRect.width, containerRect.height);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [currentSize, getScaleFactor, isSize]);

  // Handle export functionality
  const handleExport = async (format: 'pdf' | 'docx' = 'pdf') => {
    if (isExporting) return;

    setIsExporting(true);
    try {
      const cvData = getCVData();
      const filename = `${cvData.contact?.name?.replace(/\s+/g, '_') || 'resume'}.${format}`;

      if (format === 'pdf') {
        await PDFExportService.exportAsPDF('cv-preview-content', {
          filename,
          quality: 1,
          scale: 2,
          includeMargins: true
        });
      } else {
        // For DOCX, we could implement a separate service or show a message
        console.log('DOCX export not yet implemented');
      }

      if (onExport) {
        onExport(format);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const renderTemplate = (templateType: TemplateType, data: CVData) => {
    // Map old template types to new template IDs
    const templateMapping: Record<TemplateType, string> = {
      'modern': 'modern',
      'classic': 'classic',
      'minimal': 'minimal',
      'professional': 'modern',
      'creative': 'creative',
      'academic': 'academic',
      'technical': 'technical',
      'executive': 'executive',
      'designer': 'modern',
      'startup': 'minimal',
      'sales': 'sales',
    };

    const templateId = templateMapping[templateType] || 'modern';
    const templateConfig = templateEngine.getTemplate(templateId);
    const TemplateComponent = getTemplateComponent(templateId);

    if (!TemplateComponent || !templateConfig) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Template not found: {templateType}</p>
        </div>
      );
    }

    const templateProps: TemplateRenderProps = {
      config: templateConfig.config,
      data,
      mode: 'preview',
      scale: scale,
      className: "w-full h-full",
    };

    return <TemplateComponent {...templateProps} />;
  };

  if (!isVisible) {
    return (
      <div className={cn("bg-white border-l border-gray-200 flex items-center justify-center", className)}>
        <Button
          variant="secondary"
          onClick={() => setIsVisible(true)}
          className="flex items-center space-x-2"
        >
          <Eye className="h-4 w-4" />
          <span>Show Preview</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white border-l border-gray-200 flex flex-col",
      isFullscreen ? "fixed inset-0 z-50" : "",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Preview</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Size Controls */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {Object.entries(PREVIEW_SIZE_ICONS).map(([size, IconComponent]) => {
              return (
                <button
                  key={size}
                  onClick={() => setPreviewSize(size as BreakpointSize)}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    currentSize === size
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                  title={size.charAt(0).toUpperCase() + size.slice(1)}
                >
                  <IconComponent className="h-4 w-4" />
                </button>
              );
            })}
            <button
              onClick={() => setPreviewSize('xl')}
              className={cn(
                "p-2 rounded-md transition-colors",
                isSize('xl')
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
              title="Full Size"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {onShare && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            )}
            
            <div className="relative group">
              <Button
                variant="secondary"
                size="sm"
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-1" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
              
              {/* Export Dropdown */}
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport('docx')}
                  disabled={isExporting}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Export as DOCX
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-100 p-4" 
        id="preview-container"
      >
        <div 
          className={cn(
            "mx-auto bg-white shadow-lg transition-all duration-300",
            isSize('xl') ? "w-full h-full" : "border rounded-lg"
          )}
          style={{
            width: isSize('xl') ? '100%' : `${getViewportDimensions().width}px`,
            height: isSize('xl') ? '100%' : `${getViewportDimensions().height}px`,
            transform: isSize('xl') ? 'none' : `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Template Selector */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Template:</span>
              <select
                value={completeCVData.template}
                onChange={(e) => {
                  const template = e.target.value as TemplateType;
                  useCVBuilderStore.getState().updateCVData({ template });
                }}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="modern">Modern Professional</option>
                <option value="classic">Classic Traditional</option>
                <option value="minimal">Clean Minimal</option>
                <option value="professional">Professional</option>
                <option value="creative">Creative</option>
              </select>
            </div>
          </div>

          {/* CV Content */}
          <div id="cv-preview-content" className="h-full overflow-auto">
            {renderTemplate(completeCVData.template, completeCVData)}
          </div>
        </div>

        {/* Scale Indicator */}
        {!isSize('xl') && scale < 1 && (
          <div className="text-center mt-2">
            <span className="text-xs text-gray-500">
              Scaled to {Math.round(scale * 100)}% • {currentSize.toUpperCase()} ({getViewportDimensions().width}×{getViewportDimensions().height})
            </span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {completeCVData.contact?.name || 'Untitled CV'} • {completeCVData.template}
          </span>
          <span>
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}