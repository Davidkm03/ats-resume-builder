"use client";

import { useCVBuilderStore } from '@/stores/cv-builder';
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

interface StepNavigationProps {
  className?: string;
}

export default function StepNavigation({ className }: StepNavigationProps) {
  const { currentStep, steps, setCurrentStep } = useCVBuilderStore();

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const completedSteps = steps.filter(step => step.isCompleted).length;
  const totalRequiredSteps = steps.filter(step => !step.isOptional).length;
  const progressPercentage = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className={cn("bg-white border-r border-gray-200", className)}>
      {/* Progress Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">CV Builder</h2>
          <span className="text-sm text-gray-500">
            {completedSteps}/{steps.length} completed
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {progressPercentage}% complete
        </p>
      </div>

      {/* Steps List */}
      <nav className="p-4 space-y-1">
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStep;
          const isCompleted = step.isCompleted;
          const isPrevious = index < currentStepIndex;
          const isAccessible = isPrevious || isCurrent || index === currentStepIndex + 1;

          return (
            <button
              key={step.id}
              onClick={() => isAccessible && setCurrentStep(step.id)}
              disabled={!isAccessible}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all duration-200 group",
                "flex items-start space-x-3",
                {
                  // Current step
                  "bg-blue-50 border-2 border-blue-200 text-blue-900": isCurrent,
                  // Completed step
                  "bg-green-50 border border-green-200 text-green-900 hover:bg-green-100": 
                    isCompleted && !isCurrent,
                  // Accessible but not current/completed
                  "border border-gray-200 text-gray-700 hover:bg-gray-50": 
                    isAccessible && !isCurrent && !isCompleted,
                  // Not accessible
                  "border border-gray-100 text-gray-400 cursor-not-allowed": 
                    !isAccessible,
                }
              )}
            >
              {/* Step Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                ) : isCurrent ? (
                  <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                ) : (
                  <div className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs font-medium",
                    {
                      "border-gray-300 text-gray-500": !isAccessible,
                      "border-gray-400 text-gray-600": isAccessible,
                    }
                  )}>
                    {index + 1}
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    {
                      "text-blue-900": isCurrent,
                      "text-green-900": isCompleted && !isCurrent,
                      "text-gray-900": isAccessible && !isCurrent && !isCompleted,
                      "text-gray-400": !isAccessible,
                    }
                  )}>
                    {step.title}
                    {step.isOptional && (
                      <span className="ml-1 text-xs text-gray-400 font-normal">
                        (optional)
                      </span>
                    )}
                  </p>
                  {isCurrent && (
                    <ChevronRightIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  )}
                </div>
                <p className={cn(
                  "text-xs mt-1 line-clamp-2",
                  {
                    "text-blue-700": isCurrent,
                    "text-green-700": isCompleted && !isCurrent,
                    "text-gray-600": isAccessible && !isCurrent && !isCompleted,
                    "text-gray-400": !isAccessible,
                  }
                )}>
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>Required sections:</span>
            <span className="font-medium">
              {steps.filter(s => !s.isOptional && s.isCompleted).length}/{totalRequiredSteps}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Optional sections:</span>
            <span className="font-medium">
              {steps.filter(s => s.isOptional && s.isCompleted).length}/{steps.filter(s => s.isOptional).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}