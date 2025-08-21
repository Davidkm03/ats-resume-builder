"use client";

import { useState } from 'react';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { Certification } from '@/types/cv';
import { Button } from '@/components/ui';
import { Plus, X, Calendar, Award, Building } from 'lucide-react';

export default function CertificationsStep() {
  const { cvData, updateCertifications } = useCVBuilderStore();
  const [certifications, setCertifications] = useState<Certification[]>(
    cvData.certifications || []
  );

  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      url: '',
    };
    const updated = [...certifications, newCertification];
    setCertifications(updated);
    updateCertifications(updated);
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    const updated = certifications.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    setCertifications(updated);
    updateCertifications(updated);
  };

  const removeCertification = (id: string) => {
    const updated = certifications.filter(cert => cert.id !== id);
    setCertifications(updated);
    updateCertifications(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Certifications</h2>
        <p className="text-gray-600">
          Add your professional certifications, licenses, and credentials.
        </p>
      </div>

      <div className="space-y-4">
        {certifications.map((certification, index) => (
          <div key={certification.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Certification {index + 1}
                </h3>
              </div>
              <button
                onClick={() => removeCertification(certification.id || '')}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Certification Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Name *
                </label>
                <input
                  type="text"
                  value={certification.name || ''}
                  onChange={(e) => updateCertification(certification.id || '', 'name', e.target.value)}
                  placeholder="e.g., AWS Certified Solutions Architect"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Issuing Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Organization *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={certification.issuer || ''}
                    onChange={(e) => updateCertification(certification.id || '', 'issuer', e.target.value)}
                    placeholder="e.g., Amazon Web Services"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="month"
                    value={certification.issueDate || ''}
                    onChange={(e) => updateCertification(certification.id || '', 'issueDate', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="month"
                    value={certification.expiryDate || ''}
                    onChange={(e) => updateCertification(certification.id || '', 'expiryDate', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Credential ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credential ID (Optional)
                </label>
                <input
                  type="text"
                  value={certification.credentialId || ''}
                  onChange={(e) => updateCertification(certification.id || '', 'credentialId', e.target.value)}
                  placeholder="e.g., ABC123456789"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Credential URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credential URL (Optional)
                </label>
                <input
                  type="url"
                  value={certification.url || ''}
                  onChange={(e) => updateCertification(certification.id || '', 'url', e.target.value)}
                  placeholder="https://www.credly.com/badges/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Certification Button */}
        <button
          onClick={addCertification}
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-gray-100 group-hover:bg-blue-100 rounded-full transition-colors">
              <Plus className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                Add Certification
              </p>
              <p className="text-xs text-gray-500 group-hover:text-blue-700">
                Add professional certifications, licenses, or credentials
              </p>
            </div>
          </div>
        </button>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Certifications</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Include relevant industry certifications and licenses</li>
            <li>• Add credential IDs and verification URLs when available</li>
            <li>• List certifications in order of relevance to the target role</li>
            <li>• Include expiry dates for time-sensitive certifications</li>
            <li>• Focus on certifications that demonstrate current skills</li>
          </ul>
        </div>
      </div>
    </div>
  );
}