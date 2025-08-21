"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { Education } from '@/types/cv';
import { FormInput, Button } from '@/components/ui';
import { 
  PlusIcon, 
  TrashIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline';
import AIEducationGenerator from '../ai-education-generator';

const educationSchema = z.object({
  education: z.array(z.object({
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    location: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    gpa: z.string().optional(),
    honors: z.string().optional(),
    relevantCourses: z.array(z.string()).default([]),
    description: z.string().optional(),
  })),
});

type EducationFormData = z.infer<typeof educationSchema>;

export default function EducationStep() {
  const { cvData, updateEducation, updateStepCompletion } = useCVBuilderStore();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));

  const {
    register,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: cvData.education?.length ? cvData.education : [{
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        honors: '',
        relevantCourses: [],
      }],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const watchedEducation = watch('education');

  // Update store when form values change
  useEffect(() => {
    const education: Education[] = watchedEducation.map((edu, index) => ({
      id: `edu-${index}`,
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.gpa,
      honors: edu.honors,
      relevantCourses: edu.relevantCourses.filter(course => course.trim() !== ''),
    }));

    updateEducation(education);
    updateStepCompletion('education', education.length > 0 && education.some(edu => edu.degree && edu.institution));
  }, [watchedEducation]);

  const addEducation = () => {
    append({
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: '',
      relevantCourses: [],
    });
    setExpandedItems(prev => new Set(Array.from(prev).concat([fields.length])));
  };

  const removeEducation = (index: number) => {
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

  const addCourse = (eduIndex: number) => {
    const currentCourses = watchedEducation[eduIndex].relevantCourses;
    setValue(`education.${eduIndex}.relevantCourses`, [...currentCourses, '']);
  };

  const removeCourse = (eduIndex: number, courseIndex: number) => {
    const currentCourses = watchedEducation[eduIndex].relevantCourses;
    setValue(`education.${eduIndex}.relevantCourses`, currentCourses.filter((_, i) => i !== courseIndex));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Education</h2>
        <p className="text-gray-600">
          Add your educational background, including degrees, certifications, and relevant coursework.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const isExpanded = expandedItems.has(index);
          const education = watchedEducation[index];
          
          return (
            <div key={field.id} className="bg-white rounded-lg shadow">
              {/* Header */}
              <div 
                className="p-4 border-b border-gray-200 cursor-pointer"
                onClick={() => toggleExpanded(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {education.degree || 'New Degree'}
                        {education.institution && (
                          <span className="text-gray-500"> from {education.institution}</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Education {index + 1}
                        {education.startDate && (
                          <span> • {education.startDate} - {education.endDate || 'Present'}</span>
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
                          removeEducation(index);
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
                      label="Degree"
                      {...register(`education.${index}.degree`)}
                      error={errors.education?.[index]?.degree?.message}
                      placeholder="Bachelor of Science in Computer Science"
                      required
                    />

                    <FormInput
                      label="Institution"
                      {...register(`education.${index}.institution`)}
                      error={errors.education?.[index]?.institution?.message}
                      placeholder="University of California, Berkeley"
                      required
                    />

                    <FormInput
                      label="Location"
                      {...register(`education.${index}.location`)}
                      error={errors.education?.[index]?.location?.message}
                      placeholder="Berkeley, CA"
                    />

                    <div className="space-y-4">
                      <FormInput
                        label="Start Date"
                        type="month"
                        {...register(`education.${index}.startDate`)}
                        error={errors.education?.[index]?.startDate?.message}
                        required
                      />

                      <FormInput
                        label="End Date"
                        type="month"
                        {...register(`education.${index}.endDate`)}
                        error={errors.education?.[index]?.endDate?.message}
                        placeholder="Leave empty if ongoing"
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="GPA (Optional)"
                      {...register(`education.${index}.gpa`)}
                      error={errors.education?.[index]?.gpa?.message}
                      placeholder="3.8/4.0"
                    />

                    <FormInput
                      label="Honors/Awards (Optional)"
                      {...register(`education.${index}.honors`)}
                      error={errors.education?.[index]?.honors?.message}
                      placeholder="Magna Cum Laude, Dean's List"
                    />
                  </div>

                  {/* Relevant Courses */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Relevant Courses (Optional)
                      </label>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => addCourse(index)}
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Course
                      </Button>
                    </div>
                    
                    {education.relevantCourses.length > 0 && (
                      <div className="space-y-3">
                        {education.relevantCourses.map((course, courseIndex) => (
                          <div key={courseIndex} className="flex items-center space-x-3">
                            <div className="flex-1">
                              <FormInput
                                label=""
                                {...register(`education.${index}.relevantCourses.${courseIndex}`)}
                                placeholder="Data Structures and Algorithms"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCourse(index, courseIndex)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AI Education Generator */}
                  <AIEducationGenerator
                    education={education}
                    onUpdate={(updatedEducation) => {
                      const newEducation = [...watchedEducation];
                      newEducation[index] = {
                        ...updatedEducation,
                        relevantCourses: updatedEducation.relevantCourses || []
                      };
                      setValue('education', newEducation);
                    }}
                    className="mt-6"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Add Education Button */}
        <button
          type="button"
          onClick={addEducation}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mx-auto mb-2" />
          Add Another Degree
        </button>
      </div>

      {/* Validation Status */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-2">
          {watchedEducation.some(edu => edu.degree && edu.institution) ? (
            <>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">
                {watchedEducation.filter(edu => edu.degree && edu.institution).length} degree(s) added
              </span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-amber-600">Please add at least one educational background</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}