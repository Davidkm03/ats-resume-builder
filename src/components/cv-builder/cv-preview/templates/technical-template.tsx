"use client";

import { CVData } from '@/types/cv';
import { cn } from '@/lib/utils';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

interface TechnicalTemplateProps {
  data: CVData;
  className?: string;
  isPreview?: boolean;
}

export default function TechnicalTemplate({ data, className, isPreview = false }: TechnicalTemplateProps) {
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
      "bg-gray-50 text-gray-900 font-mono",
      isPreview ? "min-h-full" : "min-h-screen",
      className
    )}>
      {/* Terminal-style Header */}
      <div className="bg-gray-900 text-green-400 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-400 text-sm">~/developer/profile</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">$</span>
              <span className="text-white">whoami</span>
            </div>
            <h1 className="text-2xl font-bold text-green-400 ml-4">
              {data.contact?.name || 'developer'}
            </h1>
            
            {data.summary && (
              <>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-blue-400">$</span>
                  <span className="text-white">cat profile.txt</span>
                </div>
                <p className="text-gray-300 ml-4 leading-relaxed">
                  {data.summary}
                </p>
              </>
            )}

            <div className="flex items-center gap-2 mt-4">
              <span className="text-blue-400">$</span>
              <span className="text-white">contact --info</span>
            </div>
            <div className="ml-4 space-y-1">
              {data.contact?.email && (
                <div className="flex items-center gap-2 text-gray-300">
                  <EnvelopeIcon className="w-4 h-4 text-green-400" />
                  <span>{data.contact.email}</span>
                </div>
              )}
              {data.contact?.phone && (
                <div className="flex items-center gap-2 text-gray-300">
                  <PhoneIcon className="w-4 h-4 text-green-400" />
                  <span>{data.contact.phone}</span>
                </div>
              )}
              {data.contact?.location && (
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPinIcon className="w-4 h-4 text-green-400" />
                  <span>{data.contact.location}</span>
                </div>
              )}
              {data.contact?.website && (
                <div className="flex items-center gap-2 text-gray-300">
                  <GlobeAltIcon className="w-4 h-4 text-green-400" />
                  <span>{data.contact.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Skills - Code Block Style */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-8">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                <CodeBracketIcon className="w-4 h-4 text-gray-600" />
                <span className="font-semibold text-gray-700">skills.json</span>
              </div>
              <div className="p-4 bg-gray-900 text-green-400 font-mono text-sm">
                <div className="text-gray-500">1</div>
                <div className="text-gray-500">2</div>
                <div className="text-white">3</div>
                <div className="ml-4">
                  <span className="text-blue-400">"technologies"</span>: [
                </div>
                {data.skills.map((skill, index) => (
                  <div key={index} className="ml-8">
                    <span className="text-green-400">"{skill}"</span>
                    {index < data.skills!.length - 1 && <span className="text-white">,</span>}
                  </div>
                ))}
                <div className="ml-4 text-white">]</div>
                <div className="text-white">{'}'}</div>
              </div>
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-blue-600">//</span>
              <span>Professional Experience</span>
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 font-mono">{exp.title}</h3>
                      <p className="text-blue-600 font-semibold">{exp.company}</p>
                      {exp.location && <p className="text-gray-500 text-sm">{exp.location}</p>}
                    </div>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded font-mono text-sm">
                      {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                    </span>
                  </div>
                  
                  {exp.description && (
                    <div className="mb-4">
                      <span className="text-green-600 font-mono text-sm">/* Description */</span>
                      <p className="text-gray-700 leading-relaxed mt-1">{exp.description}</p>
                    </div>
                  )}
                  
                  {exp.bullets && exp.bullets.length > 0 && (
                    <div>
                      <span className="text-green-600 font-mono text-sm">/* Key Achievements */</span>
                      <ul className="mt-2 space-y-2">
                        {exp.bullets.map((bullet: string, bulletIndex: number) => (
                          <li key={bulletIndex} className="flex items-start gap-3">
                            <span className="text-blue-600 font-mono">{'>'}</span>
                            <span className="text-gray-700 leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-blue-600">//</span>
              <span>Projects</span>
            </h2>
            <div className="grid gap-6">
              {data.projects.map((project, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 font-mono">{project.name}</h3>
                    <span className="text-gray-500 font-mono text-sm">
                      {formatDateRange(project.startDate, project.endDate)}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-gray-700 leading-relaxed mb-4">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div>
                      <span className="text-green-600 font-mono text-sm">/* Tech Stack */</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono text-sm">
                            {tech}
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

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-blue-600">//</span>
              <span>Education</span>
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 font-mono">{edu.degree}</h3>
                      <p className="text-blue-600 font-semibold">{edu.institution}</p>
                      {edu.location && <p className="text-gray-500 text-sm">{edu.location}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 font-mono text-sm">{formatDateRange(edu.startDate, edu.endDate)}</p>
                      {edu.gpa && <p className="text-xs text-gray-400 font-mono">GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-blue-600">//</span>
              <span>Certifications</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.certifications.map((cert, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-bold text-gray-800 font-mono">{cert.name}</h3>
                  <p className="text-blue-600">{cert.issuer}</p>
                  {cert.issueDate && <p className="text-gray-500 text-sm font-mono">{formatDate(cert.issueDate)}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
