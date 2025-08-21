"use client";

import { CVData } from '@/types/cv';
import { cn } from '@/lib/utils';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface ExecutiveTemplateProps {
  data: CVData;
  className?: string;
  isPreview?: boolean;
}

export default function ExecutiveTemplate({ data, className, isPreview = false }: ExecutiveTemplateProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    } catch {
      return dateString;
    }
  };

  const formatDateRange = (startDate?: string, endDate?: string, isPresent?: boolean) => {
    const start = formatDate(startDate);
    if (isPresent) return `${start} - Present`;
    const end = formatDate(endDate);
    return end ? `${start} - ${end}` : start;
  };

  return (
    <div className={cn(
      "bg-white text-gray-900 font-serif",
      isPreview ? "min-h-full" : "min-h-screen",
      className
    )}>
      {/* Header Section - Executive Style */}
      <div className="border-b-4 border-gray-800 pb-6 mb-8">
        <div className="max-w-4xl mx-auto px-8 pt-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-wide">
              {data.contact?.name || 'EXECUTIVE NAME'}
            </h1>
            <div className="w-24 h-1 bg-gray-800 mx-auto mb-4"></div>
            
            {/* Contact Info - Horizontal Layout */}
            <div className="flex flex-wrap justify-center gap-6 text-gray-600 text-sm">
              {data.contact?.email && (
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>{data.contact.email}</span>
                </div>
              )}
              {data.contact?.phone && (
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{data.contact.phone}</span>
                </div>
              )}
              {data.contact?.location && (
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{data.contact.location}</span>
                </div>
              )}
              {data.contact?.website && (
                <div className="flex items-center gap-2">
                  <GlobeAltIcon className="w-4 h-4" />
                  <span>{data.contact.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pb-8">
        {/* Executive Summary */}
        {data.summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
              EXECUTIVE SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg font-light">
              {data.summary}
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-gray-300 pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{exp.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <BuildingOfficeIcon className="w-4 h-4" />
                        <span className="font-semibold">{exp.company}</span>
                        {exp.location && <span>• {exp.location}</span>}
                      </div>
                    </div>
                    <span className="text-gray-500 font-medium whitespace-nowrap ml-4">
                      {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                    </span>
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-700 mb-3 leading-relaxed">{exp.description}</p>
                  )}
                  
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-2">
                      {exp.bullets.map((bullet: string, bulletIndex: number) => (
                        <li key={bulletIndex} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-gray-700 leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
              EDUCATION
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                    <p className="text-gray-600 font-semibold">{edu.institution}</p>
                    {edu.location && <p className="text-gray-500">{edu.location}</p>}
                  </div>
                  <div className="text-right text-gray-500">
                    <p className="font-medium">{formatDateRange(edu.startDate, edu.endDate)}</p>
                    {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
              CORE COMPETENCIES
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gray-100 p-3 rounded">
                    <span className="text-gray-700 font-medium">{skill}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
              KEY PROJECTS & ACHIEVEMENTS
            </h2>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                    <span className="text-gray-500 font-medium">
                      {formatDateRange(project.startDate, project.endDate)}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-gray-700 leading-relaxed">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500 font-medium">Technologies: </span>
                      <span className="text-sm text-gray-600">{project.technologies.join(', ')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
              CERTIFICATIONS & LICENSES
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.certifications.map((cert, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-800">{cert.name}</h3>
                  <p className="text-gray-600">{cert.issuer}</p>
                  {cert.issueDate && <p className="text-gray-500 text-sm">{formatDate(cert.issueDate)}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
