"use client";

import { useState } from 'react';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { CustomSection } from '@/types/cv';
import { Plus, X, Settings, List, Type, FileText } from 'lucide-react';

const sectionTypes = [
  { value: 'text', label: 'Text Block', icon: Type, description: 'Free-form text content' },
  { value: 'list', label: 'Simple List', icon: List, description: 'Bulleted list of items' },
  { value: 'bullets', label: 'Bullet Points', icon: FileText, description: 'Formatted bullet points' },
] as const;

export default function CustomSectionsStep() {
  const { cvData, updateCustomSections } = useCVBuilderStore();
  const [customSections, setCustomSections] = useState<CustomSection[]>(
    cvData.customSections || []
  );

  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: '',
      type: 'text',
      content: '',
      items: [],
    };
    const updated = [...customSections, newSection];
    setCustomSections(updated);
    updateCustomSections(updated);
  };

  const updateSection = (id: string, field: keyof CustomSection, value: any) => {
    const updated = customSections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    );
    setCustomSections(updated);
    updateCustomSections(updated);
  };

  const removeSection = (id: string) => {
    const updated = customSections.filter(section => section.id !== id);
    setCustomSections(updated);
    updateCustomSections(updated);
  };

  const addItem = (sectionId: string) => {
    const section = customSections.find(s => s.id === sectionId);
    if (section) {
      const newItems = [...(section.items || []), ''];
      updateSection(sectionId, 'items', newItems);
    }
  };

  const updateItem = (sectionId: string, itemIndex: number, value: string) => {
    const section = customSections.find(s => s.id === sectionId);
    if (section && section.items) {
      const newItems = [...section.items];
      newItems[itemIndex] = value;
      updateSection(sectionId, 'items', newItems);
    }
  };

  const removeItem = (sectionId: string, itemIndex: number) => {
    const section = customSections.find(s => s.id === sectionId);
    if (section && section.items) {
      const newItems = section.items.filter((_, index) => index !== itemIndex);
      updateSection(sectionId, 'items', newItems);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Sections</h2>
        <p className="text-gray-600">
          Add custom sections for any additional information you'd like to include.
        </p>
      </div>

      <div className="space-y-4">
        {customSections.map((section, index) => (
          <div key={section.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Custom Section {index + 1}
                </h3>
              </div>
              <button
                onClick={() => removeSection(section.id || '')}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Section Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Title *
                </label>
                <input
                  type="text"
                  value={section.title || ''}
                  onChange={(e) => updateSection(section.id || '', 'title', e.target.value)}
                  placeholder="e.g., Hobbies, References, Additional Information"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Section Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {sectionTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <label
                        key={type.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          section.type === type.value
                            ? 'border-purple-500 bg-purple-50 text-purple-900'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`type-${section.id}`}
                          value={type.value}
                          checked={section.type === type.value}
                          onChange={(e) => updateSection(section.id || '', 'type', e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5" />
                          <div>
                            <div className="font-medium text-sm">{type.label}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Content based on type */}
              {section.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={section.content || ''}
                    onChange={(e) => updateSection(section.id || '', 'content', e.target.value)}
                    placeholder="Enter your custom content here..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              )}

              {(section.type === 'list' || section.type === 'bullets') && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Items
                    </label>
                    <button
                      onClick={() => addItem(section.id || '')}
                      className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(section.items || []).map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateItem(section.id || '', itemIndex, e.target.value)}
                          placeholder={`Item ${itemIndex + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => removeItem(section.id || '', itemIndex)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {(!section.items || section.items.length === 0) && (
                      <p className="text-sm text-gray-500 italic">No items added yet. Click "Add Item" to get started.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Custom Section Button */}
        <button
          onClick={addCustomSection}
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-gray-100 group-hover:bg-purple-100 rounded-full transition-colors">
              <Plus className="h-6 w-6 text-gray-600 group-hover:text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 group-hover:text-purple-900">
                Add Custom Section
              </p>
              <p className="text-xs text-gray-500 group-hover:text-purple-700">
                Create a custom section for additional information
              </p>
            </div>
          </div>
        </button>

        {/* Tips */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-purple-900 mb-2">⚙️ Tips for Custom Sections</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• <strong>Text Block:</strong> Use for paragraphs, references, or detailed information</li>
            <li>• <strong>Simple List:</strong> Use for hobbies, interests, or simple enumerations</li>
            <li>• <strong>Bullet Points:</strong> Use for achievements, key points, or formatted lists</li>
            <li>• Common sections: Hobbies, References, Additional Skills, Personal Projects</li>
            <li>• Keep custom sections relevant to your target role</li>
            <li>• Use clear, descriptive section titles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}