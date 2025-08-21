"use client";

import { CVData } from '@/types/cv';
import { cn } from '@/lib/utils';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface AcademicTemplateProps {
  data: CVData;
  className?: string;
  isPreview?: boolean;
}

export default function AcademicTemplate({ data, className, isPreview = false }: AcademicTemplateProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
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
      {/* Academic Header */}
      <div className="border-b-2 border-blue-900 pb-6 mb-8">
        <div className="max-w-4xl mx-auto px-8 pt-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              {data.contact?.name || 'Academic Name'}
            </h1>
            
            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-4 text-gray-600 text-sm mb-4">
              {data.contact?.email && (
                <div className="flex items-center gap-1">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>{data.contact.email}</span>
                </div>
              )}
              {data.contact?.phone && (
                <div className="flex items-center gap-1">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{data.contact.phone}</span>
                </div>
              )}
              {data.contact?.location && (
                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{data.contact.location}</span>
                </div>
              )}
              {data.contact?.website && (
                <div className="flex items-center gap-1">
                  <GlobeAltIcon className="w-4 h-4" />
                  <span>{data.contact.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pb-8">
        {/* Research Interests / Summary */}
        {data.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-wide">
              Research Interests
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              {data.summary}
            </p>
          </section>
        )}

        {/* Education - Priority for Academic */}
        {data.education && data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-wide">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                      <p className="text-blue-700 font-semibold italic">{edu.institution}</p>
                      {edu.location && <p className="text-gray-600">{edu.location}</p>}
                      {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-gray-500 font-medium">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Academic Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-wide">
              Academic & Professional Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{exp.title}</h3>
                      <p className="text-blue-700 font-semibold italic">{exp.company}</p>
                      {exp.location && <p className="text-gray-600">{exp.location}</p>}
                    </div>
                    <span className="text-gray-500 font-medium">
                      {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                    </span>
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-700 mb-3 leading-relaxed text-justify">{exp.description}</p>
                  )}
                  
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-1 ml-4">
                      {exp.bullets.map((bullet: string, bulletIndex: number) => (
                        <li key={bulletIndex} className="text-gray-700 leading-relaxed list-disc">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Research Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-wide">
              Research Projects
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
                    <p className="text-gray-700 leading-relaxed text-justify mb-2">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Methods/Tools:</span> {project.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills - Academic Context */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-wide">
              Technical Skills & Competencies
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-center">
                  <span className="text-gray-700 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publications/Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-wide">
              Publications & Certifications
            </h2>
            <div className="space-y-3">
              {data.certifications.map((cert, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-800">{cert.name}</h3>
                  <p className="text-blue-700 italic">{cert.issuer}</p>
                  {cert.issueDate && <p className="text-gray-600 text-sm">{formatDate(cert.issueDate)}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
