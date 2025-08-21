"use client";

import { useState } from 'react';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { Award } from '@/types/cv';
import { Plus, X, Trophy, Calendar, Building } from 'lucide-react';

export default function AwardsStep() {
  const { cvData, updateAwards } = useCVBuilderStore();
  const [awards, setAwards] = useState<Award[]>(
    cvData.awards || []
  );

  const addAward = () => {
    const newAward: Award = {
      id: Date.now().toString(),
      title: '',
      issuer: '',
      date: '',
      description: '',
    };
    const updated = [...awards, newAward];
    setAwards(updated);
    updateAwards(updated);
  };

  const updateAward = (id: string, field: keyof Award, value: string) => {
    const updated = awards.map(award =>
      award.id === id ? { ...award, [field]: value } : award
    );
    setAwards(updated);
    updateAwards(updated);
  };

  const removeAward = (id: string) => {
    const updated = awards.filter(award => award.id !== id);
    setAwards(updated);
    updateAwards(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Awards & Honors</h2>
        <p className="text-gray-600">
          Highlight any awards, honors, or recognition you've received.
        </p>
      </div>

      <div className="space-y-4">
        {awards.map((award, index) => (
          <div key={award.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Award {index + 1}
                </h3>
              </div>
              <button
                onClick={() => removeAward(award.id || '')}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Award Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Award Title *
                </label>
                <input
                  type="text"
                  value={award.title || ''}
                  onChange={(e) => updateAward(award.id || '', 'title', e.target.value)}
                  placeholder="e.g., Employee of the Year, Dean's List"
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
                    value={award.issuer || ''}
                    onChange={(e) => updateAward(award.id || '', 'issuer', e.target.value)}
                    placeholder="e.g., ABC Company, University Name"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Received *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="month"
                    value={award.date || ''}
                    onChange={(e) => updateAward(award.id || '', 'date', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={award.description || ''}
                onChange={(e) => updateAward(award.id || '', 'description', e.target.value)}
                placeholder="Brief description of the award and why you received it..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        ))}

        {/* Add Award Button */}
        <button
          onClick={addAward}
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-colors group"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-gray-100 group-hover:bg-yellow-100 rounded-full transition-colors">
              <Plus className="h-6 w-6 text-gray-600 group-hover:text-yellow-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 group-hover:text-yellow-900">
                Add Award
              </p>
              <p className="text-xs text-gray-500 group-hover:text-yellow-700">
                Add awards, honors, or recognition you've received
              </p>
            </div>
          </div>
        </button>

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">🏆 Tips for Awards & Honors</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Include academic honors (Dean's List, Magna Cum Laude, etc.)</li>
            <li>• Add professional recognition and industry awards</li>
            <li>• Include company awards (Employee of the Month/Year)</li>
            <li>• Add competition wins and achievements</li>
            <li>• List scholarships and grants received</li>
            <li>• Focus on awards relevant to your target role</li>
          </ul>
        </div>
      </div>
    </div>
  );
}