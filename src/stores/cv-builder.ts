import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CVData, ContactInfo, Experience, Education, Project, Certification, Language, Award, Publication, VolunteerWork, CustomSection } from '@/types/cv';

export interface CVBuilderStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isOptional: boolean;
}

export const CV_BUILDER_STEPS: CVBuilderStep[] = [
  {
    id: 'contact',
    title: 'Contact Information',
    description: 'Your basic contact details',
    isCompleted: false,
    isOptional: false,
  },
  {
    id: 'summary',
    title: 'Professional Summary',
    description: 'A brief overview of your professional background',
    isCompleted: false,
    isOptional: true,
  },
  {
    id: 'experience',
    title: 'Work Experience',
    description: 'Your professional work history',
    isCompleted: false,
    isOptional: false,
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Your educational background',
    isCompleted: false,
    isOptional: false,
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Your technical and soft skills',
    isCompleted: false,
    isOptional: false,
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Notable projects you\'ve worked on',
    isCompleted: false,
    isOptional: true,
  },
  {
    id: 'certifications',
    title: 'Certifications',
    description: 'Professional certifications and licenses',
    isCompleted: false,
    isOptional: true,
  },
  {
    id: 'languages',
    title: 'Languages',
    description: 'Languages you speak',
    isCompleted: false,
    isOptional: true,
  },
  {
    id: 'awards',
    title: 'Awards & Honors',
    description: 'Recognition and achievements',
    isCompleted: false,
    isOptional: true,
  },
  {
    id: 'publications',
    title: 'Publications',
    description: 'Articles, papers, and publications',
    isCompleted: false,
    isOptional: true,
  },
  {
    id: 'volunteer',
    title: 'Volunteer Work',
    description: 'Community service and volunteer experience',
    isCompleted: false,
    isOptional: true,
  },
  {
    id: 'custom',
    title: 'Additional Sections',
    description: 'Custom sections for unique content',
    isCompleted: false,
    isOptional: true,
  },
];

interface CVBuilderState {
  // Current state
  currentStep: string;
  steps: CVBuilderStep[];
  cvData: Partial<CVData>;
  cvId?: string;
  isAutoSaving: boolean;
  lastSaved?: Date;
  hasUnsavedChanges: boolean;
  sectionOrder?: string[];
  sectionVisibility?: Record<string, boolean>;

  // Actions
  setCurrentStep: (stepId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateStepCompletion: (stepId: string, isCompleted: boolean) => void;
  
  // CV Data actions
  updateCVData: (data: Partial<CVData>) => void;
  updateContact: (contact: Partial<ContactInfo>) => void;
  updateSummary: (summary: string) => void;
  updateExperience: (experience: Experience[]) => void;
  updateEducation: (education: Education[]) => void;
  updateSkills: (skills: string[]) => void;
  updateProjects: (projects: Project[]) => void;
  updateCertifications: (certifications: Certification[]) => void;
  updateLanguages: (languages: Language[]) => void;
  updateAwards: (awards: Award[]) => void;
  updatePublications: (publications: Publication[]) => void;
  updateVolunteerWork: (volunteerWork: VolunteerWork[]) => void;
  updateCustomSections: (customSections: CustomSection[]) => void;
  
  // Section order and visibility
  updateSectionOrder: (sectionOrder: string[]) => void;
  updateSectionVisibility: (sectionVisibility: Record<string, boolean>) => void;
  
  // Auto-save actions
  setAutoSaving: (isAutoSaving: boolean) => void;
  setLastSaved: (date: Date) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  
  // Utility actions
  initializeCVData: (cvData: CVData, cvId?: string) => void;
  resetBuilder: () => void;
  getCVData: () => CVData;
  setTemplate: (templateId: string) => void;
}

const getInitialCVData = (): Partial<CVData> => ({
  name: '',
  template: 'modern',
  contact: {
    name: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  publications: [],
  volunteerWork: [],
  customSections: [],
});

export const useCVBuilderStore = create<CVBuilderState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 'contact',
      steps: CV_BUILDER_STEPS,
      cvData: getInitialCVData(),
      cvId: undefined,
      isAutoSaving: false,
      lastSaved: undefined,
      hasUnsavedChanges: false,

      // Step navigation actions
      setCurrentStep: (stepId: string) => {
        set({ currentStep: stepId });
      },

      nextStep: () => {
        const { currentStep, steps } = get();
        const currentIndex = steps.findIndex(step => step.id === currentStep);
        if (currentIndex < steps.length - 1) {
          set({ currentStep: steps[currentIndex + 1].id });
        }
      },

      previousStep: () => {
        const { currentStep, steps } = get();
        const currentIndex = steps.findIndex(step => step.id === currentStep);
        if (currentIndex > 0) {
          set({ currentStep: steps[currentIndex - 1].id });
        }
      },

      updateStepCompletion: (stepId: string, isCompleted: boolean) => {
        set(state => ({
          steps: state.steps.map(step =>
            step.id === stepId ? { ...step, isCompleted } : step
          )
        }));
      },

      // CV Data update actions
      updateCVData: (data: Partial<CVData>) => {
        set(state => ({
          cvData: { ...state.cvData, ...data },
          hasUnsavedChanges: true,
        }));
      },

      updateContact: (contact: Partial<ContactInfo>) => {
        set(state => {
          const updatedContact = { ...state.cvData.contact, ...contact } as ContactInfo;
          const isCompleted = !!(updatedContact.name && updatedContact.email);
          
          return {
            cvData: {
              ...state.cvData,
              contact: updatedContact,
            },
            steps: state.steps.map(step =>
              step.id === 'contact' ? { ...step, isCompleted } : step
            ),
            hasUnsavedChanges: true,
          };
        });
      },

      updateSummary: (summary: string) => {
        set(state => {
          const isCompleted = !!summary.trim();
          
          return {
            cvData: { ...state.cvData, summary },
            steps: state.steps.map(step =>
              step.id === 'summary' ? { ...step, isCompleted } : step
            ),
            hasUnsavedChanges: true,
          };
        });
      },

      updateExperience: (experience: Experience[]) => {
        set(state => {
          const isCompleted = experience.length > 0;
          
          return {
            cvData: { ...state.cvData, experience },
            steps: state.steps.map(step =>
              step.id === 'experience' ? { ...step, isCompleted } : step
            ),
            hasUnsavedChanges: true,
          };
        });
      },

      updateEducation: (education: Education[]) => {
        set(state => {
          const isCompleted = education.length > 0;
          
          return {
            cvData: { ...state.cvData, education },
            steps: state.steps.map(step =>
              step.id === 'education' ? { ...step, isCompleted } : step
            ),
            hasUnsavedChanges: true,
          };
        });
      },

      updateSkills: (skills: string[]) => {
        set(state => {
          const isCompleted = skills.length > 0;
          
          return {
            cvData: { ...state.cvData, skills },
            steps: state.steps.map(step =>
              step.id === 'skills' ? { ...step, isCompleted } : step
            ),
            hasUnsavedChanges: true,
          };
        });
      },

      updateProjects: (projects: Project[]) => {
        set(state => {
          const isCompleted = projects.length > 0;
          
          return {
            cvData: { ...state.cvData, projects },
            steps: state.steps.map(step =>
              step.id === 'projects' ? { ...step, isCompleted } : step
            ),
            hasUnsavedChanges: true,
          };
        });
      },

      updateCertifications: (certifications: Certification[]) => {
        set(state => {
          const isCompleted = certifications.length > 0;
          
          return {
            cvData: { ...state.cvData, certifications },
            steps: state.steps.map(step =>
              step.id === 'certifications' ? { ...step, isCompleted } : step
            ),
            hasUnsavedChanges: true,
          };
        });
      },

      updateLanguages: (languages: Language[]) => {
        set(state => {
          const isCompleted = languages.length > 0;
          
          return {
            cvData: { ...state.cvData, languages },
            steps: state.steps.map(step =>
              step.id === 'languages' ? { ...step, isCompleted } : step
            ),
            hasUnsavedChanges: true,
          };
        });
      },

      updateAwards: (awards: Award[]) => {
        set(state => {
          const isCompleted = awards.length > 0;
          
          return {
            cvData: { ...state.cvData, awards },
            steps: state.steps.map(step =>
              step.id === 'awards' ? { ...step, isCompleted } : step
            ),
            hasUnsavedChanges: true,
          };
        });
      },

      updatePublications: (publications: Publication[]) => {
        set(state => {
          const isCompleted = publications.length > 0;
          
          return {
            cvData: { ...state.cvData, publications },
            steps: state.steps.map(step =>
              step.id === 'publications' ? { ...step, isCompleted } : step
            ),
            hasUnsavedChanges: true,
          };
        });
      },

      updateVolunteerWork: (volunteerWork: VolunteerWork[]) => {
        set(state => {
          const isCompleted = volunteerWork.length > 0;
          
          return {
            cvData: { ...state.cvData, volunteerWork },
            steps: state.steps.map(step =>
              step.id === 'volunteer' ? { ...step, isCompleted } : step
            ),
            hasUnsavedChanges: true,
          };
        });
      },

      updateCustomSections: (customSections: CustomSection[]) => {
        set(state => {
          const isCompleted = customSections.length > 0;
          
          return {
            cvData: { ...state.cvData, customSections },
            steps: state.steps.map(step =>
              step.id === 'custom' ? { ...step, isCompleted } : step
            ),
            hasUnsavedChanges: true,
          };
        });
      },

      // Section order and visibility
      updateSectionOrder: (sectionOrder: string[]) => {
        set(state => ({
          sectionOrder,
          hasUnsavedChanges: true,
        }));
      },

      updateSectionVisibility: (sectionVisibility: Record<string, boolean>) => {
        set(state => ({
          sectionVisibility,
          hasUnsavedChanges: true,
        }));
      },

      // Auto-save actions
      setAutoSaving: (isAutoSaving: boolean) => {
        set({ isAutoSaving });
      },

      setLastSaved: (date: Date) => {
        set({ lastSaved: date, hasUnsavedChanges: false });
      },

      setHasUnsavedChanges: (hasChanges: boolean) => {
        set({ hasUnsavedChanges: hasChanges });
      },

      // Utility actions
      initializeCVData: (cvData: CVData, cvId?: string) => {
        // Update step completion based on data
        const updatedSteps = CV_BUILDER_STEPS.map(step => {
          let isCompleted = false;
          
          switch (step.id) {
            case 'contact':
              isCompleted = !!(cvData.contact?.name && cvData.contact?.email);
              break;
            case 'summary':
              isCompleted = !!cvData.summary;
              break;
            case 'experience':
              isCompleted = cvData.experience && cvData.experience.length > 0;
              break;
            case 'education':
              isCompleted = cvData.education && cvData.education.length > 0;
              break;
            case 'skills':
              isCompleted = cvData.skills && cvData.skills.length > 0;
              break;
            case 'projects':
              isCompleted = cvData.projects && cvData.projects.length > 0;
              break;
            case 'certifications':
              isCompleted = cvData.certifications && cvData.certifications.length > 0;
              break;
            case 'languages':
              isCompleted = cvData.languages && cvData.languages.length > 0;
              break;
            case 'awards':
              isCompleted = cvData.awards && cvData.awards.length > 0;
              break;
            case 'publications':
              isCompleted = cvData.publications && cvData.publications.length > 0;
              break;
            case 'volunteer':
              isCompleted = cvData.volunteerWork && cvData.volunteerWork.length > 0;
              break;
            case 'custom':
              isCompleted = cvData.customSections && cvData.customSections.length > 0;
              break;
          }
          
          return { ...step, isCompleted };
        });

        set({
          cvData,
          cvId,
          steps: updatedSteps,
          hasUnsavedChanges: false,
          lastSaved: new Date(),
        });
      },

      resetBuilder: () => {
        set({
          currentStep: 'contact',
          steps: CV_BUILDER_STEPS,
          cvData: getInitialCVData(),
          cvId: undefined,
          isAutoSaving: false,
          lastSaved: undefined,
          hasUnsavedChanges: false,
        });
      },

      getCVData: (): CVData => {
        const { cvData } = get();
        return {
          id: cvData.id,
          name: cvData.name || 'Untitled CV',
          template: cvData.template || 'modern',
          contact: cvData.contact || {
            name: '',
            email: '',
            phone: '',
            location: '',
          },
          summary: cvData.summary || '',
          experience: cvData.experience || [],
          education: cvData.education || [],
          skills: cvData.skills || [],
          projects: cvData.projects || [],
          certifications: cvData.certifications || [],
          languages: cvData.languages || [],
          awards: cvData.awards || [],
          publications: cvData.publications || [],
          volunteerWork: cvData.volunteerWork || [],
          customSections: cvData.customSections || [],
        };
      },

      setTemplate: (templateId: string) => {
        set(state => ({
          cvData: { ...state.cvData, template: templateId as any },
          hasUnsavedChanges: true,
        }));
      },
    }),
    {
      name: 'cv-builder-storage',
      partialize: (state) => ({
        cvData: state.cvData,
        cvId: state.cvId,
        currentStep: state.currentStep,
        steps: state.steps,
      }),
    }
  )
);