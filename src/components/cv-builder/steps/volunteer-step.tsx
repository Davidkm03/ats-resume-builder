"use client";

import { useState } from 'react';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { VolunteerWork } from '@/types/cv';
import { Plus, X, Heart, Calendar, MapPin } from 'lucide-react';

export default function VolunteerStep() {
  const { cvData, updateVolunteerWork } = useCVBuilderStore();
  const [volunteerWork, setVolunteerWork] = useState<VolunteerWork[]>(
    cvData.volunteerWork || []
  );

  const addVolunteerWork = () => {
    const newVolunteerWork: VolunteerWork = {
      id: Date.now().toString(),
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      isPresent: false,
      description: '',
    };
    const updated = [...volunteerWork, newVolunteerWork];
    setVolunteerWork(updated);
    updateVolunteerWork(updated);
  };

  const updateVolunteerWorkItem = (id: string, field: keyof VolunteerWork, value: string | boolean) => {
    const updated = volunteerWork.map(work =>
      work.id === id ? { ...work, [field]: value } : work
    );
    setVolunteerWork(updated);
    updateVolunteerWork(updated);
  };

  const removeVolunteerWork = (id: string) => {
    const updated = volunteerWork.filter(work => work.id !== id);
    setVolunteerWork(updated);
    updateVolunteerWork(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Volunteer Work</h2>
        <p className="text-gray-600">
          Add your volunteer experience and community service activities.
        </p>
      </div>

      <div className="space-y-4">
        {volunteerWork.map((work, index) => (
          <div key={work.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-medium text-gray-900">
                  Volunteer Experience {index + 1}
                </h3>
              </div>
              <button
                onClick={() => removeVolunteerWork(work.id || '')}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization *
                </label>
                <input
                  type="text"
                  value={work.organization || ''}
                  onChange={(e) => updateVolunteerWorkItem(work.id || '', 'organization', e.target.value)}
                  placeholder="e.g., Red Cross, Local Food Bank"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role/Position *
                </label>
                <input
                  type="text"
                  value={work.role || ''}
                  onChange={(e) => updateVolunteerWorkItem(work.id || '', 'role', e.target.value)}
                  placeholder="e.g., Volunteer Coordinator, Tutor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>


              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="month"
                    value={work.startDate || ''}
                    onChange={(e) => updateVolunteerWorkItem(work.id || '', 'startDate', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Current Position Toggle */}
            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={work.isPresent || false}
                  onChange={(e) => {
                    updateVolunteerWorkItem(work.id || '', 'isPresent', e.target.checked);
                    if (e.target.checked) {
                      updateVolunteerWorkItem(work.id || '', 'endDate', '');
                    }
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700">I currently volunteer here</span>
              </label>
            </div>

            {/* End Date */}
            {!work.isPresent && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="month"
                    value={work.endDate || ''}
                    onChange={(e) => updateVolunteerWorkItem(work.id || '', 'endDate', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={work.description || ''}
                onChange={(e) => updateVolunteerWorkItem(work.id || '', 'description', e.target.value)}
                placeholder="Describe your volunteer activities, responsibilities, and impact..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        ))}

        {/* Add Volunteer Work Button */}
        <button
          onClick={addVolunteerWork}
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors group"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-gray-100 group-hover:bg-red-100 rounded-full transition-colors">
              <Plus className="h-6 w-6 text-gray-600 group-hover:text-red-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 group-hover:text-red-900">
                Add Volunteer Experience
              </p>
              <p className="text-xs text-gray-500 group-hover:text-red-700">
                Add volunteer work and community service activities
              </p>
            </div>
          </div>
        </button>

        {/* Tips */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-900 mb-2">❤️ Tips for Volunteer Work</h4>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• Include regular volunteer commitments and one-time events</li>
            <li>• Highlight leadership roles and special responsibilities</li>
            <li>• Quantify your impact when possible (hours, people helped, etc.)</li>
            <li>• Include skills gained that are relevant to your career</li>
            <li>• Show consistency and long-term commitment</li>
            <li>• Focus on volunteer work relevant to your target role</li>
          </ul>
        </div>
      </div>
    </div>
  );
}