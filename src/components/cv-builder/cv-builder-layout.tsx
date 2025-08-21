"use client";

import { useEffect, useState } from 'react';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { useAutoSave } from '@/hooks/use-auto-save';
import StepNavigation from './step-navigation';
import PreviewPanel from './cv-preview/preview-panel';
import TemplateSelector from './cv-preview/template-selector';
import DragDropSectionReorder from './drag-drop-section-reorder';
import ExportManager from './export-manager';
import { Button } from '@/components/ui';
import { 
  ChevronLeft, 
  ChevronRight, 
  CloudUpload,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CVBuilderLayoutProps {
  children: React.ReactNode;
  cvId?: string;
  className?: string;
  showPreview?: boolean;
}

export default function CVBuilderLayout({ 
  children, 
  cvId, 
  className,
  showPreview = true 
}: CVBuilderLayoutProps) {
  const {
    currentStep,
    steps,
    nextStep,
    previousStep,
    hasUnsavedChanges,
    lastSaved,
    isAutoSaving,
  } = useCVBuilderStore();

  const { manualSave } = useAutoSave({ enabled: true });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(showPreview);
  const [previewSize, setPreviewSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const currentStepData = steps[currentStepIndex];
  const canGoNext = currentStepIndex < steps.length - 1;
  const canGoPrevious = currentStepIndex > 0;

  // Initialize CV data if cvId is provided
  useEffect(() => {
    if (cvId) {
      // This would typically fetch the CV data from the API
      // For now, we'll just set the cvId in the store
      useCVBuilderStore.setState({ cvId });
    }
  }, [cvId]);

  const handleManualSave = async () => {
    try {
      await manualSave();
    } catch (error) {
      console.error('Failed to save CV:', error);
      // Could show error toast here
    }
  };

  const formatLastSaved = (date?: Date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className={cn("min-h-screen bg-gray-50 flex", className)}>
      {/* Sidebar */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-80" : "w-0"
      )}>
        <div className={cn(
          "h-full overflow-hidden",
          isSidebarOpen ? "opacity-100" : "opacity-0"
        )}>
          <StepNavigation />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Form Content */}
        <div className={cn(
          "flex flex-col transition-all duration-300",
          isPreviewOpen ? "lg:w-1/2" : "w-full"
        )}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Sidebar Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Current Step Info */}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentStepData?.title}
                </h1>
                <p className="text-sm text-gray-600">
                  Step {currentStepIndex + 1} of {steps.length}
                  {currentStepData?.isOptional && (
                    <span className="ml-1 text-gray-400">(optional)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Save Status & Actions */}
            <div className="flex items-center space-x-4">
              {/* Preview Toggle */}
              {showPreview && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                  className="lg:hidden"
                >
                  {isPreviewOpen ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Show Preview
                    </>
                  )}
                </Button>
              )}

              {/* Save Status */}
              <div className="flex items-center space-x-2 text-sm">
                {isAutoSaving ? (
                  <>
                    <CloudUpload className="h-4 w-4 text-blue-500 animate-pulse" />
                    <span className="text-blue-600">Saving...</span>
                  </>
                ) : hasUnsavedChanges ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-600">Unsaved changes</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">
                      Saved {formatLastSaved(lastSaved)}
                    </span>
                  </>
                )}
              </div>

              {/* Manual Save Button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleManualSave}
                disabled={isAutoSaving || !hasUnsavedChanges}
              >
                Save Now
              </Button>
            </div>
          </div>
        </header>

          {/* Template Selector */}
          <div className="p-6 pb-0">
            <TemplateSelector className="mb-6" />
          </div>

          {/* Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {children}
              
              {/* Drag & Drop Section Reorder */}
              <DragDropSectionReorder />
              
              {/* Export Manager */}
              <ExportManager />
            </div>
          </main>

          {/* Footer Navigation */}
          <footer className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={previousStep}
                disabled={!canGoPrevious}
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {/* Step Indicators */}
                <div className="flex space-x-1">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={cn(
                        "h-2 w-2 rounded-full transition-colors",
                        {
                          "bg-blue-600": index === currentStepIndex,
                          "bg-green-500": step.isCompleted,
                          "bg-gray-300": index !== currentStepIndex && !step.isCompleted,
                        }
                      )}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={nextStep}
                disabled={!canGoNext}
                className="flex items-center"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </footer>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className={cn(
            "transition-all duration-300 lg:block",
            isPreviewOpen ? "block lg:w-1/2" : "hidden"
          )}>
            <PreviewPanel 
              className="h-screen lg:h-auto lg:min-h-screen"
              onExport={(format) => {
                console.log('Export as:', format);
                // Implement export functionality
              }}
              onShare={() => {
                console.log('Share CV');
                // Implement share functionality
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}