"use client";

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { useCVBuilderStore } from '@/stores/cv-builder';

interface SectionItem {
  id: string;
  title: string;
  isVisible: boolean;
  isRequired: boolean;
  order: number;
}

interface SortableItemProps {
  id: string;
  title: string;
  isVisible: boolean;
  isRequired: boolean;
  onToggleVisibility: (id: string) => void;
}

function SortableItem({ id, title, isVisible, isRequired, onToggleVisibility }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>
        
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {title}
            {isRequired && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                Required
              </span>
            )}
          </h3>
        </div>
      </div>

      <button
        onClick={() => onToggleVisibility(id)}
        disabled={isRequired}
        className={`p-2 rounded-lg transition-colors ${
          isRequired 
            ? 'cursor-not-allowed opacity-50' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title={isRequired ? 'Required sections cannot be hidden' : isVisible ? 'Hide section' : 'Show section'}
      >
        {isVisible ? (
          <Eye className="w-5 h-5 text-green-600" />
        ) : (
          <EyeOff className="w-5 h-5 text-gray-400" />
        )}
      </button>
    </div>
  );
}

interface DragDropSectionReorderProps {
  className?: string;
}

export default function DragDropSectionReorder({ className }: DragDropSectionReorderProps) {
  const { sectionOrder, updateSectionOrder, sectionVisibility, updateSectionVisibility } = useCVBuilderStore();
  
  // Default sections with their properties
  const defaultSections: SectionItem[] = [
    { id: 'contact', title: 'Contact Information', isVisible: true, isRequired: true, order: 1 },
    { id: 'summary', title: 'Professional Summary', isVisible: true, isRequired: false, order: 2 },
    { id: 'experience', title: 'Work Experience', isVisible: true, isRequired: true, order: 3 },
    { id: 'education', title: 'Education', isVisible: true, isRequired: true, order: 4 },
    { id: 'skills', title: 'Skills', isVisible: true, isRequired: false, order: 5 },
    { id: 'projects', title: 'Projects', isVisible: true, isRequired: false, order: 6 },
    { id: 'certifications', title: 'Certifications', isVisible: true, isRequired: false, order: 7 },
    { id: 'languages', title: 'Languages', isVisible: false, isRequired: false, order: 8 },
    { id: 'awards', title: 'Awards & Honors', isVisible: false, isRequired: false, order: 9 },
    { id: 'publications', title: 'Publications', isVisible: false, isRequired: false, order: 10 },
    { id: 'volunteer', title: 'Volunteer Work', isVisible: false, isRequired: false, order: 11 },
    { id: 'custom', title: 'Custom Sections', isVisible: false, isRequired: false, order: 12 },
  ];

  // Merge with store data
  const [sections, setSections] = useState<SectionItem[]>(() => {
    const orderedSections = [...defaultSections];
    
    // Apply custom order if exists
    if (sectionOrder && sectionOrder.length > 0) {
      orderedSections.sort((a, b) => {
        const aIndex = sectionOrder.indexOf(a.id);
        const bIndex = sectionOrder.indexOf(b.id);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }
    
    // Apply visibility settings
    return orderedSections.map(section => ({
      ...section,
      isVisible: sectionVisibility?.[section.id] ?? section.isVisible
    }));
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id);
      const newIndex = sections.findIndex(section => section.id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);
      
      // Update store with new order
      const newOrder = newSections.map(section => section.id);
      updateSectionOrder(newOrder);
    }
  };

  const handleToggleVisibility = (sectionId: string) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId
        ? { ...section, isVisible: !section.isVisible }
        : section
    );
    setSections(updatedSections);
    
    // Update store
    const visibilityMap = updatedSections.reduce((acc, section) => {
      acc[section.id] = section.isVisible;
      return acc;
    }, {} as Record<string, boolean>);
    updateSectionVisibility(visibilityMap);
  };

  const resetToDefault = () => {
    setSections(defaultSections);
    updateSectionOrder([]);
    updateSectionVisibility({});
  };

  const visibleCount = sections.filter(s => s.isVisible).length;
  const totalCount = sections.length;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Section Order & Visibility
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Drag sections to reorder them. Toggle visibility with the eye icon.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {visibleCount} of {totalCount} sections visible
          </p>
        </div>
        
        <button
          onClick={resetToDefault}
          className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Reset to Default
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sections.map((section) => (
              <SortableItem
                key={section.id}
                id={section.id}
                title={section.title}
                isVisible={section.isVisible}
                isRequired={section.isRequired}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
          💡 Tips for Section Organization
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Place most important sections (Experience, Skills) near the top</li>
          <li>• Contact information should always be first</li>
          <li>• Hide sections you don't need to keep your CV focused</li>
          <li>• Required sections cannot be hidden but can be reordered</li>
        </ul>
      </div>
    </div>
  );
}
