"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { CVData } from '@/types/cv';

interface UseAutoSaveOptions {
  delay?: number; // Delay in milliseconds before auto-saving
  enabled?: boolean; // Whether auto-save is enabled
}

export function useAutoSave(options: UseAutoSaveOptions = {}) {
  const { delay = 2000, enabled = true } = options;
  
  const {
    cvData,
    cvId,
    hasUnsavedChanges,
    isAutoSaving,
    setAutoSaving,
    setLastSaved,
    setHasUnsavedChanges,
    getCVData,
  } = useCVBuilderStore();

  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<string>('');

  const saveCVData = useCallback(async (data: CVData, id?: string) => {
    try {
      setAutoSaving(true);

      // Check if there's meaningful content to save
      const hasContact = data.contact?.name || data.contact?.email;
      const hasExperience = data.experience && data.experience.length > 0;
      const hasEducation = data.education && data.education.length > 0;
      const hasSkills = data.skills && data.skills.length > 0;
      const hasSummary = data.summary && data.summary.trim().length > 0;

      // Only auto-save if there's substantial content
      if (!hasContact && !hasExperience && !hasEducation && !hasSkills && !hasSummary) {
        console.log('Skipping auto-save: insufficient content');
        setAutoSaving(false);
        return;
      }

      // Prepare data with defaults for required fields
      const sanitizedData = {
        name: data.name || 'Untitled CV',
        template: data.template || 'modern',
        data: {
          ...data,
          contact: {
            name: data.contact?.name || '',
            email: data.contact?.email || (data.contact?.name ? 'temp@example.com' : ''),
            phone: data.contact?.phone || '',
            location: data.contact?.location || '',
            linkedin: data.contact?.linkedin || '',
            website: data.contact?.website || '',
            github: data.contact?.github || '',
            portfolio: data.contact?.portfolio || ''
          },
          // Only include valid experience entries
          experience: (data.experience || [])
            .filter(exp => exp.title && exp.company) // Only save complete entries
            .map(exp => ({
              ...exp,
              id: exp.id || `exp-${Date.now()}-${Math.random()}`,
              location: exp.location || 'Remote',
              startDate: exp.startDate || new Date().toISOString().split('T')[0],
              isPresent: exp.isPresent || false,
              bullets: exp.bullets || [],
              skills: exp.skills || []
            })),
          // Only include valid education entries
          education: (data.education || [])
            .filter(edu => edu.degree && edu.institution) // Only save complete entries
            .map(edu => ({
              ...edu,
              id: edu.id || `edu-${Date.now()}-${Math.random()}`,
              startDate: edu.startDate || new Date().toISOString().split('T')[0]
            })),
          skills: data.skills || [],
          projects: data.projects || [],
          certifications: data.certifications || [],
          languages: data.languages || [],
          awards: data.awards || [],
          publications: data.publications || [],
          volunteerWork: data.volunteerWork || [],
          customSections: data.customSections || [],
          summary: data.summary || ''
        }
      };

      const url = id ? `/api/cvs/${id}` : '/api/cvs';
      const method = id ? 'PUT' : 'POST';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Auto-save API error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          requestData: sanitizedData
        });
        throw new Error(`Failed to save CV: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      
      // Update the store with the saved data
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      // If this was a new CV, update the cvId in the store
      if (!id && result.cv?.id) {
        useCVBuilderStore.setState({ cvId: result.cv.id });
      }

      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Auto-save timed out');
      } else {
        console.error('Auto-save failed:', error);
        // Don't show error for validation issues during auto-save
        // Users can still manually save if needed
      }
      // Don't throw error for auto-save - just log it
      return null;
    } finally {
      setAutoSaving(false);
    }
  }, [setAutoSaving, setLastSaved, setHasUnsavedChanges]);

  const triggerAutoSave = useCallback(() => {
    if (!enabled || isAutoSaving) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        const currentData = getCVData();
        const currentDataString = JSON.stringify(currentData);

        // Only save if data has actually changed
        if (currentDataString !== lastSavedDataRef.current) {
          await saveCVData(currentData, cvId);
          lastSavedDataRef.current = currentDataString;
        }
      } catch (error) {
        console.error('Auto-save error:', error);
        // Could show a toast notification here
      }
    }, delay);
  }, [enabled, isAutoSaving, delay, saveCVData, cvId]);

  // Trigger auto-save when data changes
  useEffect(() => {
    if (hasUnsavedChanges && enabled && !isAutoSaving) {
      triggerAutoSave();
    }
  }, [hasUnsavedChanges, enabled, isAutoSaving, triggerAutoSave]);

  // Manual save function with different error handling
  const manualSave = useCallback(async () => {
    try {
      const currentData = getCVData();
      
      // For manual save, be less strict about validation
      const result = await saveCVData(currentData, cvId);
      if (result) {
        lastSavedDataRef.current = JSON.stringify(currentData);
        return result;
      } else {
        throw new Error('Save failed - please check your data and try again');
      }
    } catch (error) {
      console.error('Manual save failed:', error);
      throw error;
    }
  }, [saveCVData, cvId, getCVData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Initialize lastSavedDataRef with current data
  useEffect(() => {
    if (!lastSavedDataRef.current) {
      lastSavedDataRef.current = JSON.stringify(getCVData());
    }
  }, []); // Remove getCVData dependency to prevent infinite loop

  return {
    isAutoSaving,
    manualSave,
    triggerAutoSave,
  };
}