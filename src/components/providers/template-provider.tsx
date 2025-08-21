"use client";

import { useEffect } from 'react';
import { registerAllTemplates } from '@/lib/template-engine/registry';

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      registerAllTemplates();
    } catch (error) {
      console.error('✗ Failed to register templates:', error);
    }
  }, []);

  return <>{children}</>;
}