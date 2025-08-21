"use client";

import { useEffect, Suspense, lazy } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRequireAuth } from '@/hooks/use-auth';
import { useCVBuilderStore } from '@/stores/cv-builder';
import CVBuilderLayout from '@/components/cv-builder/cv-builder-layout';

// Lazy load step components for better performance
const ContactStep = lazy(() => import('@/components/cv-builder/steps/contact-step'));
const SummaryStep = lazy(() => import('@/components/cv-builder/steps/summary-step'));
const ExperienceStep = lazy(() => import('@/components/cv-builder/steps/experience-step'));
const EducationStep = lazy(() => import('@/components/cv-builder/steps/education-step'));
const SkillsStep = lazy(() => import('@/components/cv-builder/steps/skills-step'));
const ProjectsStep = lazy(() => import('@/components/cv-builder/steps/projects-step'));
const CertificationsStep = lazy(() => import('@/components/cv-builder/steps/certifications-step'));
const LanguagesStep = lazy(() => import('@/components/cv-builder/steps/languages-step'));
const AwardsStep = lazy(() => import('@/components/cv-builder/steps/awards-step'));
const PublicationsStep = lazy(() => import('@/components/cv-builder/steps/publications-step'));
const VolunteerStep = lazy(() => import('@/components/cv-builder/steps/volunteer-step'));
const CustomSectionsStep = lazy(() => import('@/components/cv-builder/steps/custom-sections-step'));

function CVBuilderContent() {
  const searchParams = useSearchParams();
  const cvId = searchParams.get('id');
  const templateId = searchParams.get('template');
  
  const { currentStep, initializeCVData, resetBuilder, setTemplate } = useCVBuilderStore();

  useEffect(() => {
    const fetchCVData = async (id: string) => {
      try {
        const response = await fetch(`/api/cvs/${id}`);
        if (response.ok) {
          const data = await response.json();
          initializeCVData(data.cv.data, id);
        } else {
          console.error('Failed to fetch CV data');
          // Could redirect to CV list or show error
        }
      } catch (error) {
        console.error('Error fetching CV data:', error);
      }
    };

    if (cvId) {
      // Fetch existing CV data
      fetchCVData(cvId);
    } else {
      // Reset builder for new CV
      resetBuilder();
      // Set template if provided
      if (templateId) {
        setTemplate(templateId);
      }
    }
  }, [cvId, templateId, resetBuilder, initializeCVData, setTemplate]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'contact':
        return <ContactStep />;
      case 'summary':
        return <SummaryStep />;
      case 'experience':
        return <ExperienceStep />;
      case 'education':
        return <EducationStep />;
      case 'skills':
        return <SkillsStep />;
      case 'projects':
        return <ProjectsStep />;
      case 'certifications':
        return <CertificationsStep />;
      case 'languages':
        return <LanguagesStep />;
      case 'awards':
        return <AwardsStep />;
      case 'publications':
        return <PublicationsStep />;
      case 'volunteer':
        return <VolunteerStep />;
      case 'custom':
        return <CustomSectionsStep />;
      default:
        return <ContactStep />;
    }
  };

  return (
    <CVBuilderLayout cvId={cvId || undefined}>
      <Suspense fallback={<div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>}>
        {renderCurrentStep()}
      </Suspense>
    </CVBuilderLayout>
  );
}

export default function CVBuilderPage() {
  const { user, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <CVBuilderContent />
    </Suspense>
  );
}