"use client";

import { CVData } from '@/types/cv';
import { cn } from '@/lib/utils';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface ModernTemplateProps {
  data: CVData;
  className?: string;
  isPreview?: boolean;
}

export default function ModernTemplate({ data, className, isPreview = false }: ModernTemplateProps) {
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
      "bg-white text-gray-900 font-sans",
      isPreview ? "min-h-full" : "min-h-screen",
      className
    )}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            {data.contact?.name || 'Your Name'}
          </h1>
          
          {data.summary && (
            <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
              {data.summary}
            </p>
          )}
          
          {/* Contact Information */}
          <div className="mt-6 flex flex-wrap gap-6 text-blue-100">
            {data.contact?.email && (
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4" />
                <span>{data.contact.email}</span>
              </div>
            )}
            
            {data.contact?.phone && (
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4" />
                <span>{data.contact.phone}</span>
              </div>
            )}
            
            {data.contact?.location && (
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-4 w-4" />
                <span>{data.contact.location}</span>
              </div>
            )}
            
            {data.contact?.website && (
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="h-4 w-4" />
                <a href={data.contact.website} className="hover:text-white transition-colors">
                  {data.contact.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
          
          {/* Professional Links */}
          {(data.contact?.linkedin || data.contact?.github || data.contact?.portfolio) && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {data.contact.linkedin && (
                <a href={data.contact.linkedin} className="text-blue-200 hover:text-white transition-colors">
                  LinkedIn
                </a>
              )}
              {data.contact.github && (
                <a href={data.contact.github} className="text-blue-200 hover:text-white transition-colors">
                  GitHub
                </a>
              )}
              {data.contact.portfolio && (
                <a href={data.contact.portfolio} className="text-blue-200 hover:text-white transition-colors">
                  Portfolio
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience Section */}
            {data.experience && data.experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
                  Professional Experience
                </h2>
                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={exp.id || index} className="relative pl-6 border-l-2 border-blue-200">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                      
                      <div className="mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                          <span className="font-medium text-blue-600">{exp.company}</span>
                          <span>{exp.location}</span>
                          <span className="text-sm">
                            {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                          </span>
                        </div>
                      </div>
                      
                      {exp.description && (
                        <p className="text-gray-700 mb-3">{exp.description}</p>
                      )}
                      
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="space-y-1">
                          {exp.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex} className="text-gray-700 flex items-start">
                              <span className="text-blue-600 mr-2 mt-2">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {exp.skills && exp.skills.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {exp.skills.map((skill, skillIndex) => (
                              <span 
                                key={skillIndex}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {data.projects && data.projects.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
                  Projects
                </h2>
                <div className="space-y-6">
                  {data.projects.map((project, index) => (
                    <div key={project.id || index} className="bg-gray-50 p-6 rounded-lg">
                      <div className="mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-1">
                          {project.startDate && (
                            <span>{formatDateRange(project.startDate, project.endDate)}</span>
                          )}
                          {project.url && (
                            <a href={project.url} className="text-blue-600 hover:text-blue-800">
                              Live Demo
                            </a>
                          )}
                          {project.github && (
                            <a href={project.github} className="text-blue-600 hover:text-blue-800">
                              Source Code
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{project.description}</p>
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span 
                                key={techIndex}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {project.highlights && project.highlights.length > 0 && (
                        <ul className="space-y-1">
                          {project.highlights.map((highlight, highlightIndex) => (
                            <li key={highlightIndex} className="text-gray-700 flex items-start">
                              <span className="text-blue-600 mr-2 mt-2">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Skills Section */}
            {data.skills && data.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Education Section */}
            {data.education && data.education.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  Education
                </h2>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={edu.id || index}>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-blue-600 font-medium">{edu.institution}</p>
                      {edu.location && (
                        <p className="text-gray-600 text-sm">{edu.location}</p>
                      )}
                      <p className="text-gray-600 text-sm">
                        {formatDateRange(edu.startDate, edu.endDate)}
                      </p>
                      {edu.gpa && (
                        <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>
                      )}
                      {edu.honors && (
                        <p className="text-gray-700 text-sm font-medium">{edu.honors}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  Certifications
                </h2>
                <div className="space-y-3">
                  {data.certifications.map((cert, index) => (
                    <div key={cert.id || index}>
                      <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                      <p className="text-blue-600 text-sm">{cert.issuer}</p>
                      <p className="text-gray-600 text-sm">{formatDate(cert.issueDate)}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  Languages
                </h2>
                <div className="space-y-2">
                  {data.languages.map((lang, index) => (
                    <div key={lang.id || index} className="flex justify-between">
                      <span className="font-medium text-gray-900">{lang.name}</span>
                      <span className="text-gray-600 capitalize text-sm">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}