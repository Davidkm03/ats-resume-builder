"use client";

import { useState } from 'react';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { Language } from '@/types/cv';
import { Plus, X, Globe, Star } from 'lucide-react';

const proficiencyLevels = [
  { value: 'beginner', label: 'Beginner', description: 'Basic understanding' },
  { value: 'intermediate', label: 'Intermediate', description: 'Conversational level' },
  { value: 'advanced', label: 'Advanced', description: 'Fluent communication' },
  { value: 'native', label: 'Native', description: 'Native speaker' },
] as const;

const getProficiencyColor = (level: string) => {
  switch (level) {
    case 'beginner': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'intermediate': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'advanced': return 'text-green-600 bg-green-50 border-green-200';
    case 'native': return 'text-purple-600 bg-purple-50 border-purple-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getProficiencyStars = (level: string) => {
  switch (level) {
    case 'beginner': return 1;
    case 'intermediate': return 2;
    case 'advanced': return 3;
    case 'native': return 4;
    default: return 0;
  }
};

export default function LanguagesStep() {
  const { cvData, updateLanguages } = useCVBuilderStore();
  const [languages, setLanguages] = useState<Language[]>(
    cvData.languages || []
  );

  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'beginner',
    };
    const updated = [...languages, newLanguage];
    setLanguages(updated);
    updateLanguages(updated);
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    const updated = languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    );
    setLanguages(updated);
    updateLanguages(updated);
  };

  const removeLanguage = (id: string) => {
    const updated = languages.filter(lang => lang.id !== id);
    setLanguages(updated);
    updateLanguages(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Languages</h2>
        <p className="text-gray-600">
          List the languages you speak and your proficiency level in each.
        </p>
      </div>

      <div className="space-y-4">
        {languages.map((language, index) => (
          <div key={language.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Language {index + 1}
                </h3>
              </div>
              <button
                onClick={() => removeLanguage(language.id || '')}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Language Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language *
                </label>
                <input
                  type="text"
                  value={language.name || ''}
                  onChange={(e) => updateLanguage(language.id || '', 'name', e.target.value)}
                  placeholder="e.g., Spanish, French, Mandarin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Proficiency Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proficiency Level *
                </label>
                <div className="space-y-2">
                  {proficiencyLevels.map((level) => (
                    <label
                      key={level.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        language.proficiency === level.value
                          ? getProficiencyColor(level.value)
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`proficiency-${language.id}`}
                        value={level.value}
                        checked={language.proficiency === level.value}
                        onChange={(e) => updateLanguage(language.id || '', 'proficiency', e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            {[...Array(4)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < getProficiencyStars(level.value)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{level.label}</div>
                            <div className="text-xs text-gray-500">{level.description}</div>
                          </div>
                        </div>
                        {language.proficiency === level.value && (
                          <div className="w-4 h-4 bg-current rounded-full"></div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Selection Display */}
            {language.proficiency && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Current level:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getProficiencyColor(language.proficiency)}`}>
                    {proficiencyLevels.find(l => l.value === language.proficiency)?.label}
                  </span>
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < getProficiencyStars(language.proficiency)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Language Button */}
        <button
          onClick={addLanguage}
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-gray-100 group-hover:bg-blue-100 rounded-full transition-colors">
              <Plus className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                Add Language
              </p>
              <p className="text-xs text-gray-500 group-hover:text-blue-700">
                Add a language and your proficiency level
              </p>
            </div>
          </div>
        </button>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Languages</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Beginner:</strong> Basic vocabulary and simple phrases</li>
            <li>• <strong>Intermediate:</strong> Can hold conversations and understand most content</li>
            <li>• <strong>Advanced:</strong> Fluent in professional and complex discussions</li>
            <li>• <strong>Native:</strong> Mother tongue or equivalent fluency</li>
            <li>• Only include languages relevant to your target role</li>
            <li>• Be honest about your proficiency level</li>
          </ul>
        </div>
      </div>
    </div>
  );
}