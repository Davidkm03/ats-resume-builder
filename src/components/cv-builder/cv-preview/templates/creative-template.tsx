"use client";

import { CVData } from '@/types/cv';
import { cn } from '@/lib/utils';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface CreativeTemplateProps {
  data: CVData;
  className?: string;
  isPreview?: boolean;
}

export default function CreativeTemplate({ data, className, isPreview = false }: CreativeTemplateProps) {
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
      "bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900 font-sans",
      isPreview ? "min-h-full" : "min-h-screen",
      className
    )}>
      {/* Creative Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 opacity-90"></div>
        <div className="relative z-10 text-white p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <SparklesIcon className="w-8 h-8 text-yellow-300" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                {data.contact?.name || 'Creative Professional'}
              </h1>
            </div>
            
            {data.summary && (
              <p className="text-purple-100 text-lg leading-relaxed max-w-3xl mb-6">
                {data.summary}
              </p>
            )}

            {/* Contact Info - Creative Layout */}
            <div className="flex flex-wrap gap-4">
              {data.contact?.email && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span className="text-sm">{data.contact.email}</span>
                </div>
              )}
              {data.contact?.phone && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4" />
                  <span className="text-sm">{data.contact.phone}</span>
                </div>
              )}
              {data.contact?.location && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="text-sm">{data.contact.location}</span>
                </div>
              )}
              {data.contact?.website && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                  <GlobeAltIcon className="w-4 h-4" />
                  <span className="text-sm">{data.contact.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">💼</span>
              </div>
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-gradient-to-b from-purple-500 to-pink-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{exp.title}</h3>
                      <p className="text-purple-600 font-semibold">{exp.company}</p>
                      {exp.location && <p className="text-gray-500">{exp.location}</p>}
                    </div>
                    <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
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
                          <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 flex-shrink-0"></span>
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

        {/* Skills - Creative Grid */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🎨</span>
              </div>
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                  <span className="font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🚀</span>
              </div>
              Projects
            </h2>
            <div className="grid gap-6">
              {data.projects.map((project, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
                    <span className="text-gray-500 font-medium">
                      {formatDateRange(project.startDate, project.endDate)}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-gray-700 leading-relaxed mb-3">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {tech}
                        </span>
                      ))}
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🎓</span>
              </div>
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                      <p className="text-purple-600 font-semibold">{edu.institution}</p>
                      {edu.location && <p className="text-gray-500">{edu.location}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 font-medium">{formatDateRange(edu.startDate, edu.endDate)}</p>
                      {edu.gpa && <p className="text-sm text-gray-400">GPA: {edu.gpa}</p>}
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🏆</span>
              </div>
              Certifications
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.certifications.map((cert, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-md">
                  <h3 className="font-bold text-gray-800">{cert.name}</h3>
                  <p className="text-purple-600">{cert.issuer}</p>
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
