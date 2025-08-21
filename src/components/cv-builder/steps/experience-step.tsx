"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { Experience } from '@/types/cv';
import { FormInput, Button } from '@/components/ui';
import { 
  PlusIcon, 
  TrashIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  BriefcaseIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const experienceSchema = z.object({
  experiences: z.array(z.object({
    title: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company name is required'),
    location: z.string().min(1, 'Location is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    isPresent: z.boolean(),
    description: z.string().optional(),
    bullets: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([]),
  })),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

export default function ExperienceStep() {
  const { cvData, updateExperience, updateStepCompletion } = useCVBuilderStore();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));
  const [isGeneratingBullets, setIsGeneratingBullets] = useState<number | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experiences: cvData.experience?.length ? cvData.experience : [{
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isPresent: false,
        description: '',
        bullets: [''],
        skills: [],
      }],
    },
    mode: 'onChange',
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'experiences',
  });

  const watchedExperiences = watch('experiences');

  // Update store when form values change
  useEffect(() => {
    const experiences: Experience[] = watchedExperiences.map((exp, index) => ({
      id: `exp-${index}`,
      title: exp.title,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.isPresent ? undefined : exp.endDate,
      isPresent: exp.isPresent,
      description: exp.description,
      bullets: exp.bullets.filter(bullet => bullet.trim() !== ''),
      skills: exp.skills,
    }));

    updateExperience(experiences);
    updateStepCompletion('experience', experiences.length > 0 && experiences.some(exp => exp.title && exp.company));
  }, [watchedExperiences]);

  const addExperience = () => {
    append({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isPresent: false,
      description: '',
      bullets: [''],
      skills: [],
    });
    setExpandedItems(prev => new Set(Array.from(prev).concat([fields.length])));
  };

  const removeExperience = (index: number) => {
    remove(index);
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const addBullet = (expIndex: number) => {
    const currentBullets = watchedExperiences[expIndex].bullets;
    setValue(`experiences.${expIndex}.bullets`, [...currentBullets, '']);
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const currentBullets = watchedExperiences[expIndex].bullets;
    setValue(`experiences.${expIndex}.bullets`, currentBullets.filter((_, i) => i !== bulletIndex));
  };

  const generateAIBullets = async (expIndex: number) => {
    const experience = watchedExperiences[expIndex];
    
    if (!experience.title || !experience.company) {
      setAiError('Please fill in job title and company first');
      return;
    }

    setIsGeneratingBullets(expIndex);
    setAiError(null);

    try {
      const response = await fetch('/api/ai/generate-bullets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: experience.title,
          company: experience.company,
          industry: 'Technology',
          responsibilities: experience.description ? [experience.description] : ['General responsibilities'],
          achievements: ['Key achievements'],
          skills: experience.skills.length > 0 ? experience.skills : ['Professional skills'],
          context: experience.location,
          planType: 'FREE'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate bullet points');
      }

      if (data.success && data.data?.bullets) {
        setValue(`experiences.${expIndex}.bullets`, data.data.bullets);
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (error) {
      console.error('AI Bullets generation error:', error);
      setAiError(error instanceof Error ? error.message : 'Failed to generate bullet points');
    } finally {
      setIsGeneratingBullets(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Work Experience</h2>
        <p className="text-gray-600">
          Add your professional work history, starting with your most recent position.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const isExpanded = expandedItems.has(index);
          const experience = watchedExperiences[index];
          
          return (
            <div key={field.id} className="bg-white rounded-lg shadow">
              {/* Header */}
              <div 
                className="p-4 border-b border-gray-200 cursor-pointer"
                onClick={() => toggleExpanded(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {experience.title || 'New Position'}
                        {experience.company && (
                          <span className="text-gray-500"> at {experience.company}</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Position {index + 1}
                        {experience.startDate && (
                          <span> • {experience.startDate} - {experience.isPresent ? 'Present' : experience.endDate || 'End Date'}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExperience(index);
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                    {isExpanded ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Job Title"
                      {...register(`experiences.${index}.title`)}
                      error={errors.experiences?.[index]?.title?.message}
                      placeholder="Software Engineer"
                      required
                    />

                    <FormInput
                      label="Company"
                      {...register(`experiences.${index}.company`)}
                      error={errors.experiences?.[index]?.company?.message}
                      placeholder="Tech Company Inc."
                      required
                    />

                    <FormInput
                      label="Location"
                      {...register(`experiences.${index}.location`)}
                      error={errors.experiences?.[index]?.location?.message}
                      placeholder="San Francisco, CA"
                      required
                    />

                    <div className="space-y-4">
                      <FormInput
                        label="Start Date"
                        type="month"
                        {...register(`experiences.${index}.startDate`)}
                        error={errors.experiences?.[index]?.startDate?.message}
                        required
                      />

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          {...register(`experiences.${index}.isPresent`)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="text-sm text-gray-700">
                          I currently work here
                        </label>
                      </div>

                      {!experience.isPresent && (
                        <FormInput
                          label="End Date"
                          type="month"
                          {...register(`experiences.${index}.endDate`)}
                          error={errors.experiences?.[index]?.endDate?.message}
                        />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description (Optional)
                    </label>
                    <textarea
                      {...register(`experiences.${index}.description`)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief overview of your role and responsibilities..."
                    />
                  </div>

                  {/* Bullet Points */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Key Achievements & Responsibilities
                      </label>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => generateAIBullets(index)}
                          disabled={isGeneratingBullets === index || !experience.title || !experience.company}
                        >
                          {isGeneratingBullets === index ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <SparklesIcon className="h-3 w-3 mr-1" />
                              AI Generate
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => addBullet(index)}
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Point
                        </Button>
                      </div>
                    </div>
                    
                    {aiError && (
                      <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700">
                        {aiError}
                      </div>
                    )}
                    
                    {(!experience.title || !experience.company) && (
                      <div className="mb-3 p-2 bg-amber-100 border border-amber-300 rounded text-xs text-amber-700">
                        Fill in job title and company to enable AI generation
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {experience.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex items-start space-x-3">
                          <div className="flex-1">
                            <textarea
                              {...register(`experiences.${index}.bullets.${bulletIndex}`)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="• Describe a key achievement or responsibility..."
                            />
                          </div>
                          {experience.bullets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBullet(index, bulletIndex)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Experience Button */}
        <button
          type="button"
          onClick={addExperience}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mx-auto mb-2" />
          Add Another Position
        </button>
      </div>

      {/* Validation Status */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-2">
          {watchedExperiences.some(exp => exp.title && exp.company) ? (
            <>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">
                {watchedExperiences.filter(exp => exp.title && exp.company).length} position(s) added
              </span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-amber-600">Please add at least one work experience</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}