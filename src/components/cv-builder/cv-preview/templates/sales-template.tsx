"use client";

import { CVData } from '@/types/cv';
import { cn } from '@/lib/utils';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, TrophyIcon } from '@heroicons/react/24/outline';

interface SalesTemplateProps {
  data: CVData;
  className?: string;
  isPreview?: boolean;
}

export default function SalesTemplate({ data, className, isPreview = false }: SalesTemplateProps) {
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
      {/* Dynamic Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {data.contact?.name || 'Sales Professional'}
              </h1>
              <div className="flex items-center gap-2 text-green-100">
                <TrophyIcon className="w-5 h-5" />
                <span className="text-lg font-semibold">Results-Driven Sales Leader</span>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">150%</div>
                <div className="text-sm text-green-100">Avg. Quota Achievement</div>
              </div>
            </div>
          </div>
          
          {data.summary && (
            <p className="text-green-100 text-lg leading-relaxed max-w-3xl mt-4">
              {data.summary}
            </p>
          )}

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 mt-6">
            {data.contact?.email && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <EnvelopeIcon className="w-4 h-4" />
                <span className="text-sm">{data.contact.email}</span>
              </div>
            )}
            {data.contact?.phone && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <PhoneIcon className="w-4 h-4" />
                <span className="text-sm">{data.contact.phone}</span>
              </div>
            )}
            {data.contact?.location && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <MapPinIcon className="w-4 h-4" />
                <span className="text-sm">{data.contact.location}</span>
              </div>
            )}
            {data.contact?.website && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <GlobeAltIcon className="w-4 h-4" />
                <span className="text-sm">{data.contact.website}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Key Achievements Banner */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <TrophyIcon className="w-6 h-6" />
              Key Achievements
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">$2.5M+</div>
                <div className="text-sm text-gray-600">Revenue Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-sm text-gray-600">Client Retention</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">Top 5%</div>
                <div className="text-sm text-gray-600">National Ranking</div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              Sales Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{exp.title}</h3>
                      <p className="text-green-600 font-semibold text-lg">{exp.company}</p>
                      {exp.location && <p className="text-gray-500">{exp.location}</p>}
                    </div>
                    <div className="text-right">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                      </span>
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-700 mb-4 leading-relaxed">{exp.description}</p>
                  )}
                  
                  {exp.bullets && exp.bullets.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Key Results:</h4>
                      <ul className="space-y-2">
                        {exp.bullets.map((bullet: string, bulletIndex: number) => (
                          <li key={bulletIndex} className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
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

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              Core Skills
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-lg text-center shadow-md">
                  <span className="font-semibold">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                      <p className="text-green-600 font-semibold">{edu.institution}</p>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              Certifications & Awards
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.certifications.map((cert, index) => (
                <div key={index} className="bg-white border border-green-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800">{cert.name}</h3>
                  <p className="text-green-600">{cert.issuer}</p>
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
