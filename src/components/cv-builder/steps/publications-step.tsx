"use client";

import { useState } from 'react';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { Publication } from '@/types/cv';
import { Plus, X, BookOpen, Calendar, ExternalLink } from 'lucide-react';

export default function PublicationsStep() {
  const { cvData, updatePublications } = useCVBuilderStore();
  const [publications, setPublications] = useState<Publication[]>(
    cvData.publications || []
  );

  const addPublication = () => {
    const newPublication: Publication = {
      id: Date.now().toString(),
      title: '',
      publisher: '',
      date: '',
      url: '',
      description: '',
    };
    const updated = [...publications, newPublication];
    setPublications(updated);
    updatePublications(updated);
  };

  const updatePublication = (id: string, field: keyof Publication, value: string) => {
    const updated = publications.map(pub =>
      pub.id === id ? { ...pub, [field]: value } : pub
    );
    setPublications(updated);
    updatePublications(updated);
  };

  const removePublication = (id: string) => {
    const updated = publications.filter(pub => pub.id !== id);
    setPublications(updated);
    updatePublications(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Publications</h2>
        <p className="text-gray-600">
          List your published articles, papers, books, or other publications.
        </p>
      </div>

      <div className="space-y-4">
        {publications.map((publication, index) => (
          <div key={publication.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Publication {index + 1}
                </h3>
              </div>
              <button
                onClick={() => removePublication(publication.id || '')}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Publication Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publication Title *
                </label>
                <input
                  type="text"
                  value={publication.title || ''}
                  onChange={(e) => updatePublication(publication.id || '', 'title', e.target.value)}
                  placeholder="e.g., Machine Learning in Healthcare: A Comprehensive Review"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Publisher */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publisher/Journal *
                  </label>
                  <input
                    type="text"
                    value={publication.publisher || ''}
                    onChange={(e) => updatePublication(publication.id || '', 'publisher', e.target.value)}
                    placeholder="e.g., Nature, IEEE, Medium, Personal Blog"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Publication Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publication Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="month"
                      value={publication.date || ''}
                      onChange={(e) => updatePublication(publication.id || '', 'date', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publication URL (Optional)
                </label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="url"
                    value={publication.url || ''}
                    onChange={(e) => updatePublication(publication.id || '', 'url', e.target.value)}
                    placeholder="https://doi.org/10.1000/xyz123 or https://medium.com/@author/article"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={publication.description || ''}
                  onChange={(e) => updatePublication(publication.id || '', 'description', e.target.value)}
                  placeholder="Brief description of the publication, key findings, or impact..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Publication Button */}
        <button
          onClick={addPublication}
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors group"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-gray-100 group-hover:bg-indigo-100 rounded-full transition-colors">
              <Plus className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-900">
                Add Publication
              </p>
              <p className="text-xs text-gray-500 group-hover:text-indigo-700">
                Add articles, papers, books, or other publications
              </p>
            </div>
          </div>
        </button>

        {/* Tips */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-indigo-900 mb-2">📚 Tips for Publications</h4>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• Include peer-reviewed journal articles and conference papers</li>
            <li>• Add books, book chapters, and technical reports</li>
            <li>• Include blog posts and articles if relevant to your field</li>
            <li>• Add DOI links or URLs when available</li>
            <li>• List publications in reverse chronological order</li>
            <li>• Focus on publications relevant to your target role</li>
          </ul>
        </div>
      </div>
    </div>
  );
}