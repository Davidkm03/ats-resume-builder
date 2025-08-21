import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NextAuthSessionProvider from '@/components/providers/session-provider';
import { ThemeProvider } from '@/contexts/theme-context';
import { ToastProvider } from '@/components/ui';
import { TemplateProvider } from '@/components/providers/template-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ATS Resume Builder - Creador de Hoja de Vida con IA',
  description: 'Crea hojas de vida optimizadas para sistemas ATS con inteligencia artificial',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <NextAuthSessionProvider>
            <TemplateProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </TemplateProvider>
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}