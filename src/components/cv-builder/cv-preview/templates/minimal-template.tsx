"use client";

import { CVData } from '@/types/cv';
import { cn } from '@/lib/utils';

interface MinimalTemplateProps {
  data: CVData;
  className?: string;
  isPreview?: boolean;
}

export default function MinimalTemplate({ data, className, isPreview = false }: MinimalTemplateProps) {
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
    if (isPresent) return `${start} – Present`;
    const end = formatDate(endDate);
    return end ? `${start} – ${end}` : start;
  };

  return (
    <div className={cn(
      "bg-white text-gray-900 font-sans",
      isPreview ? "min-h-full" : "min-h-screen",
      className
    )}>
      <div className="max-w-3xl mx-auto p-12 leading-relaxed">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-light mb-4 tracking-tight">
            {data.contact?.name || 'Your Name'}
          </h1>
          
          {/* Contact Information */}
          <div className="text-gray-600 space-y-1 text-sm">
            <div className="flex flex-wrap gap-4">
              {data.contact?.email && <span>{data.contact.email}</span>}
              {data.contact?.phone && <span>{data.contact.phone}</span>}
              {data.contact?.location && <span>{data.contact.location}</span>}
            </div>
            
            {(data.contact?.linkedin || data.contact?.website || data.contact?.github) && (
              <div className="flex flex-wrap gap-4">
                {data.contact.linkedin && (
                  <a href={data.contact.linkedin} className="hover:text-gray-900 transition-colors">
                    {data.contact.linkedin.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {data.contact.website && (
                  <a href={data.contact.website} className="hover:text-gray-900 transition-colors">
                    {data.contact.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {data.contact.github && (
                  <a href={data.contact.github} className="hover:text-gray-900 transition-colors">
                    {data.contact.github.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        {data.summary && (
          <section className="mb-12">
            <p className="text-gray-700 text-lg leading-relaxed">
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-medium mb-8 tracking-wide">Experience</h2>
            <div className="space-y-8">
              {data.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-light">{exp.title}</h3>
                    <span className="text-gray-500 text-sm">
                      {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{exp.company} · {exp.location}</p>
                  
                  {exp.description && (
                    <p className="text-gray-700 mb-4">{exp.description}</p>
                  )}
                  
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-2 text-gray-700">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-start">
                          <span className="mr-3 mt-2 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-medium mb-8 tracking-wide">Projects</h2>
            <div className="space-y-8">
              {data.projects.map((project, index) => (
                <div key={project.id || index}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-light">{project.name}</h3>
                    {project.startDate && (
                      <span className="text-gray-500 text-sm">
                        {formatDateRange(project.startDate, project.endDate)}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-gray-600 text-sm mb-3 space-x-4">
                    {project.url && (
                      <a href={project.url} className="hover:text-gray-900 transition-colors">
                        {project.url.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} className="hover:text-gray-900 transition-colors">
                        Source
                      </a>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-4">{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-gray-500 text-sm mb-4">
                      {project.technologies.join(' · ')}
                    </p>
                  )}
                  
                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="space-y-2 text-gray-700">
                      {project.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="flex items-start">
                          <span className="mr-3 mt-2 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
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

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-medium mb-8 tracking-wide">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={edu.id || index}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-light">{edu.degree}</h3>
                    <span className="text-gray-500 text-sm">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">
                    {edu.institution}{edu.location && ` · ${edu.location}`}
                  </p>
                  
                  <div className="text-gray-600 text-sm space-y-1">
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    {edu.honors && <p>{edu.honors}</p>}
                    {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                      <p>Relevant Coursework: {edu.relevantCourses.join(', ')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-medium mb-8 tracking-wide">Skills</h2>
            <p className="text-gray-700">
              {data.skills.join(' · ')}
            </p>
          </section>
        )}

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h2 className="text-lg font-medium mb-6 tracking-wide">Certifications</h2>
              <div className="space-y-4">
                {data.certifications.map((cert, index) => (
                  <div key={cert.id || index}>
                    <h4 className="font-light">{cert.name}</h4>
                    <p className="text-gray-600 text-sm">{cert.issuer}</p>
                    <p className="text-gray-500 text-sm">{formatDate(cert.issueDate)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section>
              <h2 className="text-lg font-medium mb-6 tracking-wide">Languages</h2>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={lang.id || index} className="flex justify-between">
                    <span className="font-light">{lang.name}</span>
                    <span className="text-gray-500 text-sm capitalize">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Awards */}
          {data.awards && data.awards.length > 0 && (
            <section>
              <h2 className="text-lg font-medium mb-6 tracking-wide">Awards</h2>
              <div className="space-y-3">
                {data.awards.map((award, index) => (
                  <div key={award.id || index}>
                    <h4 className="font-light">{award.title}</h4>
                    <p className="text-gray-600 text-sm">{award.issuer}</p>
                    <p className="text-gray-500 text-sm">{formatDate(award.date)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Publications */}
          {data.publications && data.publications.length > 0 && (
            <section>
              <h2 className="text-lg font-medium mb-6 tracking-wide">Publications</h2>
              <div className="space-y-3">
                {data.publications.map((pub, index) => (
                  <div key={pub.id || index}>
                    <h4 className="font-light">{pub.title}</h4>
                    <p className="text-gray-600 text-sm">{pub.publisher}</p>
                    <p className="text-gray-500 text-sm">{formatDate(pub.date)}</p>
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