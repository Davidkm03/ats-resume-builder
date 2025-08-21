"use client";

import React from 'react';
import { CVData } from '@/types/cv';
import { TemplateRenderProps } from '@/types/template';
import BaseTemplate, { TemplateSection } from './base-template';
import { cn } from '@/lib/utils';

export default function MinimalTemplate({ config, data, mode, scale, className }: TemplateRenderProps) {
  const cvData = data as CVData;

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
    <BaseTemplate config={config} data={data} mode={mode} scale={scale} className={cn('minimal-template', className)}>
      <div className="template-container">
        {/* Header Section */}
        <header className="header-section">
          <h1 className="name">{cvData.contact?.name || 'Your Name'}</h1>
          
          <div className="contact-bar">
            {cvData.contact?.email && (
              <span className="contact-item">{cvData.contact.email}</span>
            )}
            {cvData.contact?.phone && (
              <span className="contact-item">{cvData.contact.phone}</span>
            )}
            {cvData.contact?.location && (
              <span className="contact-item">{cvData.contact.location}</span>
            )}
            {cvData.contact?.linkedin && (
              <a href={cvData.contact.linkedin} className="contact-link">LinkedIn</a>
            )}
            {cvData.contact?.website && (
              <a href={cvData.contact.website} className="contact-link">Website</a>
            )}
            {cvData.contact?.github && (
              <a href={cvData.contact.github} className="contact-link">GitHub</a>
            )}
          </div>
        </header>

        {/* Summary */}
        {cvData.summary && (
          <section className="summary-section">
            <p className="summary-text">{cvData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {cvData.experience && cvData.experience.length > 0 && (
          <section className="section">
            <h2 className="section-title">Experience</h2>
            <div className="experience-list">
              {cvData.experience.map((exp, index) => (
                <div key={exp.id || index} className="experience-item">
                  <div className="exp-main">
                    <div className="exp-header">
                      <span className="exp-title">{exp.title}</span>
                      <span className="exp-dates">{formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}</span>
                    </div>
                    <div className="exp-company">{exp.company}, {exp.location}</div>
                  </div>
                  
                  {exp.description && (
                    <p className="exp-description">{exp.description}</p>
                  )}
                  
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="exp-bullets">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {cvData.education && cvData.education.length > 0 && (
          <section className="section">
            <h2 className="section-title">Education</h2>
            <div className="education-list">
              {cvData.education.map((edu, index) => (
                <div key={edu.id || index} className="education-item">
                  <div className="edu-header">
                    <span className="edu-degree">{edu.degree}</span>
                    <span className="edu-dates">{formatDateRange(edu.startDate, edu.endDate)}</span>
                  </div>
                  <div className="edu-details">
                    <span className="edu-institution">{edu.institution}</span>
                    {edu.location && <span className="edu-location">{edu.location}</span>}
                    {edu.gpa && <span className="edu-gpa">GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="two-column">
          {/* Skills */}
          {cvData.skills && cvData.skills.length > 0 && (
            <section className="section">
              <h2 className="section-title">Skills</h2>
              <div className="skills-list">
                {cvData.skills.join(' • ')}
              </div>
            </section>
          )}

          {/* Projects */}
          {cvData.projects && cvData.projects.length > 0 && (
            <section className="section">
              <h2 className="section-title">Projects</h2>
              <div className="projects-list">
                {cvData.projects.map((project, index) => (
                  <div key={project.id || index} className="project-item">
                    <div className="project-header">
                      <span className="project-name">{project.name}</span>
                      {project.url && (
                        <a href={project.url} className="project-link">View</a>
                      )}
                    </div>
                    <p className="project-description">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="project-tech">{project.technologies.join(', ')}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="bottom-sections">
          {/* Certifications */}
          {cvData.certifications && cvData.certifications.length > 0 && (
            <section className="section">
              <h2 className="section-title">Certifications</h2>
              <div className="certifications-list">
                {cvData.certifications.map((cert, index) => (
                  <div key={cert.id || index} className="cert-item">
                    <span className="cert-name">{cert.name}</span>
                    <span className="cert-details">{cert.issuer} ({formatDate(cert.issueDate)})</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {cvData.languages && cvData.languages.length > 0 && (
            <section className="section">
              <h2 className="section-title">Languages</h2>
              <div className="languages-list">
                {cvData.languages.map((lang, index) => (
                  <span key={lang.id || index} className="lang-item">
                    {lang.name} ({lang.proficiency})
                  </span>
                )).reduce((prev, curr, index) => 
                  index === 0 ? [curr] : [...prev, ' • ', curr], 
                  [] as React.ReactNode[]
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      <style jsx>{`
        .minimal-template {
          font-family: var(--template-font-family);
          line-height: var(--template-line-height);
          color: var(--template-color-text);
        }

        .template-container {
          max-width: 100%;
          margin: 0 auto;
          padding: var(--template-spacing-padding);
          background: var(--template-color-background);
        }

        .header-section {
          margin-bottom: calc(var(--template-spacing-section) * 1.5);
          padding-bottom: var(--template-spacing-element);
          border-bottom: 1px solid var(--template-color-text);
        }

        .name {
          font-size: calc(var(--template-font-size-heading) * 1.4);
          font-weight: var(--template-font-weight-bold);
          color: var(--template-color-text);
          margin: 0 0 var(--template-spacing-element) 0;
          letter-spacing: -0.5px;
        }

        .contact-bar {
          display: flex;
          flex-wrap: wrap;
          gap: calc(var(--template-spacing-element) * 0.75);
          font-size: var(--template-font-size-small);
          color: var(--template-color-secondary, var(--template-color-text));
        }

        .contact-item {
          position: relative;
        }

        .contact-item:not(:last-child):after {
          content: '•';
          margin-left: calc(var(--template-spacing-element) * 0.75);
          color: var(--template-color-primary);
        }

        .contact-link {
          color: var(--template-color-primary);
          text-decoration: none;
          position: relative;
        }

        .contact-link:not(:last-child):after {
          content: '•';
          margin-left: calc(var(--template-spacing-element) * 0.75);
          color: var(--template-color-primary);
        }

        .contact-link:hover {
          text-decoration: underline;
        }

        .summary-section {
          margin-bottom: var(--template-spacing-section);
          font-style: italic;
        }

        .summary-text {
          margin: 0;
          line-height: 1.6;
          text-align: justify;
        }

        .section {
          margin-bottom: var(--template-spacing-section);
        }

        .section-title {
          font-size: calc(var(--template-font-size-base) * 1.1);
          font-weight: var(--template-font-weight-bold);
          color: var(--template-color-text);
          margin: 0 0 var(--template-spacing-element) 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid var(--template-color-primary);
          padding-bottom: calc(var(--template-spacing-element) * 0.25);
        }

        .experience-list,
        .education-list,
        .projects-list {
          display: flex;
          flex-direction: column;
          gap: var(--template-spacing-element);
        }

        .experience-item {
          margin-bottom: var(--template-spacing-element);
        }

        .exp-main {
          margin-bottom: calc(var(--template-spacing-element) * 0.5);
        }

        .exp-header,
        .edu-header,
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: calc(var(--template-spacing-element) * 0.25);
        }

        .exp-title,
        .edu-degree,
        .project-name {
          font-weight: var(--template-font-weight-bold);
          color: var(--template-color-text);
        }

        .exp-dates,
        .edu-dates {
          font-size: var(--template-font-size-small);
          color: var(--template-color-secondary, var(--template-color-text));
          font-weight: var(--template-font-weight-normal);
        }

        .exp-company {
          font-size: var(--template-font-size-small);
          color: var(--template-color-secondary, var(--template-color-text));
        }

        .exp-description {
          margin: calc(var(--template-spacing-element) * 0.5) 0;
          font-style: italic;
          font-size: var(--template-font-size-small);
        }

        .exp-bullets {
          margin: 0;
          padding-left: 1.2em;
          list-style-type: '–';
          list-style-position: outside;
        }

        .exp-bullets li {
          margin-bottom: calc(var(--template-spacing-element) * 0.25);
          padding-left: 0.5em;
          font-size: var(--template-font-size-small);
          line-height: 1.4;
        }

        .edu-details {
          display: flex;
          gap: calc(var(--template-spacing-element) * 0.5);
          font-size: var(--template-font-size-small);
          color: var(--template-color-secondary, var(--template-color-text));
        }

        .edu-institution {
          font-weight: var(--template-font-weight-bold);
        }

        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: calc(var(--template-spacing-section) * 1.5);
          margin-bottom: var(--template-spacing-section);
        }

        .skills-list {
          font-size: var(--template-font-size-small);
          line-height: 1.6;
          color: var(--template-color-secondary, var(--template-color-text));
        }

        .project-description {
          margin: calc(var(--template-spacing-element) * 0.25) 0;
          font-size: var(--template-font-size-small);
          line-height: 1.4;
        }

        .project-tech {
          font-size: calc(var(--template-font-size-small) * 0.9);
          color: var(--template-color-secondary, var(--template-color-text));
          font-style: italic;
        }

        .project-link {
          color: var(--template-color-primary);
          text-decoration: none;
          font-size: var(--template-font-size-small);
        }

        .project-link:hover {
          text-decoration: underline;
        }

        .bottom-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: calc(var(--template-spacing-section) * 1.5);
        }

        .certifications-list {
          display: flex;
          flex-direction: column;
          gap: calc(var(--template-spacing-element) * 0.5);
        }

        .cert-item {
          display: flex;
          flex-direction: column;
        }

        .cert-name {
          font-weight: var(--template-font-weight-bold);
          font-size: var(--template-font-size-small);
        }

        .cert-details {
          font-size: calc(var(--template-font-size-small) * 0.9);
          color: var(--template-color-secondary, var(--template-color-text));
        }

        .languages-list {
          font-size: var(--template-font-size-small);
          line-height: 1.6;
        }

        .lang-item {
          color: var(--template-color-secondary, var(--template-color-text));
        }

        @media (max-width: 768px) {
          .exp-header,
          .edu-header,
          .project-header {
            flex-direction: column;
            align-items: flex-start;
            gap: calc(var(--template-spacing-element) * 0.25);
          }

          .contact-bar {
            flex-direction: column;
            gap: calc(var(--template-spacing-element) * 0.25);
          }

          .contact-item:not(:last-child):after,
          .contact-link:not(:last-child):after {
            display: none;
          }

          .two-column,
          .bottom-sections {
            grid-template-columns: 1fr;
            gap: var(--template-spacing-section);
          }

          .edu-details {
            flex-direction: column;
            gap: calc(var(--template-spacing-element) * 0.25);
          }
        }

        @media print {
          .minimal-template {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          .header-section {
            break-inside: avoid;
          }

          .experience-item,
          .education-item,
          .project-item {
            break-inside: avoid;
            margin-bottom: var(--template-spacing-element);
          }

          .section {
            break-inside: avoid;
          }
        }
      `}</style>
    </BaseTemplate>
  );
}