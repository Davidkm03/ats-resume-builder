"use client";

import { CVData } from '@/types/cv';
import { cn } from '@/lib/utils';

interface ClassicTemplateProps {
  data: CVData;
  className?: string;
  isPreview?: boolean;
}

export default function ClassicTemplate({ data, className, isPreview = false }: ClassicTemplateProps) {
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
      "bg-white text-gray-900 font-serif leading-relaxed",
      isPreview ? "min-h-full" : "min-h-screen",
      className
    )}>
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <header className="text-center border-b-2 border-gray-800 pb-6 mb-8">
          <h1 className="text-4xl font-bold mb-4 tracking-wide">
            {data.contact?.name || 'Your Name'}
          </h1>
          
          {/* Contact Information */}
          <div className="text-gray-700 space-y-1">
            {data.contact?.email && data.contact?.phone && data.contact?.location && (
              <p>
                {data.contact.email} • {data.contact.phone} • {data.contact.location}
              </p>
            )}
            
            {(data.contact?.linkedin || data.contact?.website || data.contact?.github) && (
              <p className="text-sm">
                {[
                  data.contact.linkedin && data.contact.linkedin.replace(/^https?:\/\//, ''),
                  data.contact.website && data.contact.website.replace(/^https?:\/\//, ''),
                  data.contact.github && data.contact.github.replace(/^https?:\/\//, '')
                ].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        {data.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-center uppercase tracking-wide border-b border-gray-400 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 text-justify leading-relaxed">
              {data.summary}
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-center uppercase tracking-wide border-b border-gray-400 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.title}</h3>
                      <p className="font-medium text-gray-700">{exp.company}, {exp.location}</p>
                    </div>
                    <div className="text-right text-gray-600">
                      <p className="font-medium">
                        {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                      </p>
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-700 mb-3 italic">{exp.description}</p>
                  )}
                  
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-1 ml-4">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="text-gray-700 list-disc">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {exp.skills && exp.skills.length > 0 && (
                    <p className="text-gray-600 text-sm mt-2">
                      <span className="font-medium">Technologies:</span> {exp.skills.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-center uppercase tracking-wide border-b border-gray-400 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={edu.id || index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.institution}{edu.location && `, ${edu.location}`}</p>
                      {edu.honors && (
                        <p className="text-gray-600 italic">{edu.honors}</p>
                      )}
                      {edu.gpa && (
                        <p className="text-gray-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <div className="text-right text-gray-600">
                      <p>{formatDateRange(edu.startDate, edu.endDate)}</p>
                    </div>
                  </div>
                  
                  {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                    <p className="text-gray-600 text-sm mt-1">
                      <span className="font-medium">Relevant Coursework:</span> {edu.relevantCourses.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-center uppercase tracking-wide border-b border-gray-400 pb-1">
              Technical Skills
            </h2>
            <div className="text-center">
              <p className="text-gray-700">
                {data.skills.join(' • ')}
              </p>
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-center uppercase tracking-wide border-b border-gray-400 pb-1">
              Notable Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={project.id || index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <div className="text-sm text-gray-600">
                        {project.url && (
                          <span className="mr-4">
                            <span className="font-medium">Live:</span> {project.url.replace(/^https?:\/\//, '')}
                          </span>
                        )}
                        {project.github && (
                          <span>
                            <span className="font-medium">Code:</span> {project.github.replace(/^https?:\/\//, '')}
                          </span>
                        )}
                      </div>
                    </div>
                    {project.startDate && (
                      <div className="text-right text-gray-600">
                        <p>{formatDateRange(project.startDate, project.endDate)}</p>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                    </p>
                  )}
                  
                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="space-y-1 ml-4">
                      {project.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="text-gray-700 list-disc text-sm">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
                Certifications
              </h2>
              <div className="space-y-2">
                {data.certifications.map((cert, index) => (
                  <div key={cert.id || index}>
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-gray-600 text-sm">{cert.issuer}, {formatDate(cert.issueDate)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
                Languages
              </h2>
              <div className="space-y-1">
                {data.languages.map((lang, index) => (
                  <div key={lang.id || index} className="flex justify-between">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-gray-600 capitalize text-sm">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Awards */}
          {data.awards && data.awards.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
                Awards & Honors
              </h2>
              <div className="space-y-2">
                {data.awards.map((award, index) => (
                  <div key={award.id || index}>
                    <h4 className="font-medium">{award.title}</h4>
                    <p className="text-gray-600 text-sm">{award.issuer}, {formatDate(award.date)}</p>
                    {award.description && (
                      <p className="text-gray-700 text-sm">{award.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Publications */}
          {data.publications && data.publications.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
                Publications
              </h2>
              <div className="space-y-2">
                {data.publications.map((pub, index) => (
                  <div key={pub.id || index}>
                    <h4 className="font-medium">{pub.title}</h4>
                    <p className="text-gray-600 text-sm">{pub.publisher}, {formatDate(pub.date)}</p>
                    {pub.description && (
                      <p className="text-gray-700 text-sm">{pub.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}