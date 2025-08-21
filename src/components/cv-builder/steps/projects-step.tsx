"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { Project } from '@/types/cv';
import { FormInput, Button } from '@/components/ui';
import { 
  PlusIcon, 
  TrashIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  RocketLaunchIcon,
  LinkIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import AIProjectGenerator from '../ai-project-generator';

const projectSchema = z.object({
  projects: z.array(z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().min(1, 'Project description is required'),
    technologies: z.array(z.string()).default([]),
    url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    github: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    highlights: z.array(z.string()).default([]),
  })),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectsStep() {
  const { cvData, updateProjects, updateStepCompletion } = useCVBuilderStore();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const {
    register,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projects: cvData.projects?.length ? cvData.projects : [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  });

  const watchedProjects = watch('projects');

  // Update store when form values change
  useEffect(() => {
    const projects: Project[] = watchedProjects.map((proj, index) => ({
      id: `proj-${index}`,
      name: proj.name,
      description: proj.description,
      technologies: proj.technologies.filter(tech => tech.trim() !== ''),
      url: proj.url || undefined,
      github: proj.github || undefined,
      startDate: proj.startDate || undefined,
      endDate: proj.endDate || undefined,
      highlights: proj.highlights.filter(highlight => highlight.trim() !== ''),
    }));

    updateProjects(projects);
    updateStepCompletion('projects', true); // Projects are optional, so always mark as completed
  }, [watchedProjects]);

  const addProject = () => {
    append({
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: '',
      startDate: '',
      endDate: '',
      highlights: [''],
    });
    setExpandedItems(prev => new Set(Array.from(prev).concat([fields.length])));
  };

  const removeProject = (index: number) => {
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

  const addTechnology = (projIndex: number) => {
    const currentTech = watchedProjects[projIndex].technologies;
    setValue(`projects.${projIndex}.technologies`, [...currentTech, '']);
  };

  const removeTechnology = (projIndex: number, techIndex: number) => {
    const currentTech = watchedProjects[projIndex].technologies;
    setValue(`projects.${projIndex}.technologies`, currentTech.filter((_, i) => i !== techIndex));
  };

  const addHighlight = (projIndex: number) => {
    const currentHighlights = watchedProjects[projIndex].highlights;
    setValue(`projects.${projIndex}.highlights`, [...currentHighlights, '']);
  };

  const removeHighlight = (projIndex: number, highlightIndex: number) => {
    const currentHighlights = watchedProjects[projIndex].highlights;
    setValue(`projects.${projIndex}.highlights`, currentHighlights.filter((_, i) => i !== highlightIndex));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Projects</h2>
        <p className="text-gray-600">
          Showcase notable projects you&apos;ve worked on, including personal and professional projects.
        </p>
      </div>

      {fields.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <RocketLaunchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">
            Add projects to showcase your work and technical abilities.
          </p>
          <Button onClick={addProject}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Your First Project
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => {
            const isExpanded = expandedItems.has(index);
            const project = watchedProjects[index];
            
            return (
              <div key={field.id} className="bg-white rounded-lg shadow">
                {/* Header */}
                <div 
                  className="p-4 border-b border-gray-200 cursor-pointer"
                  onClick={() => toggleExpanded(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <RocketLaunchIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {project.name || 'New Project'}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {project.description || 'Project description'}
                          {project.technologies.length > 0 && (
                            <span> • {project.technologies.filter(t => t.trim()).join(', ')}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeProject(index);
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
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
                        label="Project Name"
                        {...register(`projects.${index}.name`)}
                        error={errors.projects?.[index]?.name?.message}
                        placeholder="My Awesome Project"
                        required
                      />

                      <div className="space-y-4">
                        <FormInput
                          label="Start Date"
                          type="month"
                          {...register(`projects.${index}.startDate`)}
                          error={errors.projects?.[index]?.startDate?.message}
                        />

                        <FormInput
                          label="End Date"
                          type="month"
                          {...register(`projects.${index}.endDate`)}
                          error={errors.projects?.[index]?.endDate?.message}
                          placeholder="Leave empty if ongoing"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Description *
                      </label>
                      <textarea
                        {...register(`projects.${index}.description`)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe what the project does, your role, and the impact it had..."
                      />
                      {errors.projects?.[index]?.description && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.projects[index]?.description?.message}
                        </p>
                      )}
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Project URL"
                        {...register(`projects.${index}.url`)}
                        error={errors.projects?.[index]?.url?.message}
                        placeholder="https://myproject.com"
                      />

                      <FormInput
                        label="GitHub Repository"
                        {...register(`projects.${index}.github`)}
                        error={errors.projects?.[index]?.github?.message}
                        placeholder="https://github.com/username/project"
                      />
                    </div>

                    {/* Technologies */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Technologies Used
                        </label>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => addTechnology(index)}
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Technology
                        </Button>
                      </div>
                      
                      {project.technologies.length > 0 && (
                        <div className="space-y-3">
                          {project.technologies.map((tech, techIndex) => (
                            <div key={techIndex} className="flex items-center space-x-3">
                              <div className="flex-1">
                                <FormInput
                                  label=""
                                  {...register(`projects.${index}.technologies.${techIndex}`)}
                                  placeholder="React, Node.js, MongoDB..."
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeTechnology(index, techIndex)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Key Highlights */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Key Highlights & Achievements
                        </label>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => addHighlight(index)}
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Highlight
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {project.highlights.map((highlight, highlightIndex) => (
                          <div key={highlightIndex} className="flex items-start space-x-3">
                            <div className="flex-1">
                              <textarea
                                {...register(`projects.${index}.highlights.${highlightIndex}`)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="• Achieved 50% performance improvement through optimization..."
                              />
                            </div>
                            {project.highlights.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeHighlight(index, highlightIndex)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Project Generator */}
                    <AIProjectGenerator
                      project={project}
                      onUpdate={(updatedProject) => {
                        const newProjects = [...watchedProjects];
                        newProjects[index] = {
                          ...updatedProject,
                          technologies: updatedProject.technologies || [],
                          highlights: updatedProject.highlights || []
                        };
                        setValue('projects', newProjects);
                      }}
                      className="mt-6"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Project Button */}
          <button
            type="button"
            onClick={addProject}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mx-auto mb-2" />
            Add Another Project
          </button>
        </div>
      )}

      {/* Status */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-600">
            {fields.length} project{fields.length !== 1 ? 's' : ''} added (optional section)
          </span>
        </div>
      </div>
    </div>
  );
}