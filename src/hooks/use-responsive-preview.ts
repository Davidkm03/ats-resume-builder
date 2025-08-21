import { useState, useEffect } from 'react';

export type BreakpointSize = 'mobile' | 'tablet' | 'desktop' | 'xl';

interface UseResponsivePreviewOptions {
  defaultSize?: BreakpointSize;
  autoDetect?: boolean;
}

// Breakpoint definitions (matching Tailwind CSS defaults)
const BREAKPOINTS = {
  mobile: { min: 0, max: 767, width: 375, height: 667 },
  tablet: { min: 768, max: 1023, width: 768, height: 1024 },
  desktop: { min: 1024, max: 1279, width: 1024, height: 768 },
  xl: { min: 1280, max: Infinity, width: 1280, height: 720 },
};

export function useResponsivePreview({ 
  defaultSize = 'desktop', 
  autoDetect = true 
}: UseResponsivePreviewOptions = {}) {
  const [currentSize, setCurrentSize] = useState<BreakpointSize>(defaultSize);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Auto-detect screen size
  useEffect(() => {
    if (!autoDetect) return;

    const updateSize = () => {
      const width = window.innerWidth;
      
      if (width < BREAKPOINTS.tablet.min) {
        setCurrentSize('mobile');
      } else if (width < BREAKPOINTS.desktop.min) {
        setCurrentSize('tablet');
      } else if (width < BREAKPOINTS.xl.min) {
        setCurrentSize('desktop');
      } else {
        setCurrentSize('xl');
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [autoDetect]);

  // Update container size based on current preview size
  useEffect(() => {
    const size = BREAKPOINTS[currentSize];
    setContainerSize({ width: size.width, height: size.height });
  }, [currentSize]);

  // Calculate scale factor for fitting preview in container
  const getScaleFactor = (containerWidth: number, containerHeight: number) => {
    const targetWidth = BREAKPOINTS[currentSize].width;
    const targetHeight = BREAKPOINTS[currentSize].height;
    
    const scaleX = (containerWidth - 40) / targetWidth; // 40px padding
    const scaleY = (containerHeight - 40) / targetHeight;
    
    return Math.min(1, Math.min(scaleX, scaleY));
  };

  // Get CSS classes for responsive behavior
  const getResponsiveClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-in-out';
    
    switch (currentSize) {
      case 'mobile':
        return `${baseClasses} w-full max-w-sm mx-auto`;
      case 'tablet':
        return `${baseClasses} w-full max-w-3xl mx-auto`;
      case 'desktop':
        return `${baseClasses} w-full max-w-5xl mx-auto`;
      case 'xl':
        return `${baseClasses} w-full max-w-7xl mx-auto`;
      default:
        return baseClasses;
    }
  };

  // Get viewport dimensions for current size
  const getViewportDimensions = () => BREAKPOINTS[currentSize];

  // Check if current size matches a specific breakpoint
  const isSize = (size: BreakpointSize) => currentSize === size;

  // Check if current size is at least a certain breakpoint
  const isAtLeast = (size: BreakpointSize) => {
    const sizes: BreakpointSize[] = ['mobile', 'tablet', 'desktop', 'xl'];
    const currentIndex = sizes.indexOf(currentSize);
    const targetIndex = sizes.indexOf(size);
    return currentIndex >= targetIndex;
  };

  // Set preview size manually
  const setPreviewSize = (size: BreakpointSize) => {
    setCurrentSize(size);
  };

  return {
    currentSize,
    containerSize,
    breakpoints: BREAKPOINTS,
    getScaleFactor,
    getResponsiveClasses,
    getViewportDimensions,
    isSize,
    isAtLeast,
    setPreviewSize,
  };
}

// Helper hook for getting current screen size
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<BreakpointSize>('desktop');

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else if (width < 1280) {
        setScreenSize('desktop');
      } else {
        setScreenSize('xl');
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return screenSize;
}

// Utility function to get optimal preview size for container
export function getOptimalPreviewSize(
  containerWidth: number, 
  containerHeight: number
): BreakpointSize {
  if (containerWidth < 400) return 'mobile';
  if (containerWidth < 800) return 'tablet';
  if (containerWidth < 1200) return 'desktop';
  return 'xl';
}