import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CVData } from '@/types/cv';

export interface ExportOptions {
  format?: 'pdf' | 'png' | 'jpeg';
  quality?: number;
  scale?: number;
  filename?: string;
  includeMargins?: boolean;
}

export class PDFExportService {
  /**
   * Export CV as PDF
   */
  static async exportAsPDF(
    elementId: string = 'cv-preview', 
    options: ExportOptions = {}
  ): Promise<void> {
    const {
      quality = 1,
      scale = 2,
      filename = 'resume.pdf',
      includeMargins = true
    } = options;

    try {
      // Find the element to export
      const element = document.getElementById(elementId) || 
                    document.querySelector('.template-content') as HTMLElement;
      
      if (!element) {
        throw new Error('Element not found for export');
      }

      // Show loading state
      const loadingToast = this.showLoadingToast();

      // Configure html2canvas options
      const canvasOptions = {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        onclone: (clonedDoc: Document) => {
          // Ensure all fonts are loaded in the cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            * {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      };

      // Generate canvas from HTML element
      const canvas = await html2canvas(element, canvasOptions);
      
      // Calculate PDF dimensions (A4 size)
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF document
      const pdf = new jsPDF({
        orientation: imgHeight > pageHeight ? 'portrait' : 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: true
      });

      // Add margins if requested
      const margins = includeMargins ? { top: 10, right: 10, bottom: 10, left: 10 } : { top: 0, right: 0, bottom: 0, left: 0 };
      const contentWidth = imgWidth - margins.left - margins.right;
      const contentHeight = (imgHeight * contentWidth) / imgWidth;

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/jpeg', quality);

      // Handle multi-page PDFs if content is too tall
      if (contentHeight <= pageHeight - margins.top - margins.bottom) {
        // Single page
        pdf.addImage(
          imgData, 
          'JPEG', 
          margins.left, 
          margins.top, 
          contentWidth, 
          contentHeight
        );
      } else {
        // Multi-page
        let yPosition = 0;
        const pageContentHeight = pageHeight - margins.top - margins.bottom;
        
        while (yPosition < imgHeight) {
          const remainingHeight = imgHeight - yPosition;
          const currentPageHeight = Math.min(pageContentHeight, remainingHeight * contentWidth / imgWidth);
          
          // Create a temporary canvas for the current page
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d')!;
          
          pageCanvas.width = canvas.width;
          pageCanvas.height = (currentPageHeight * imgWidth) / contentWidth;
          
          pageCtx.drawImage(
            canvas,
            0, yPosition * canvas.width / imgWidth,
            canvas.width, (currentPageHeight * imgWidth) / contentWidth,
            0, 0,
            canvas.width, (currentPageHeight * imgWidth) / contentWidth
          );
          
          const pageImgData = pageCanvas.toDataURL('image/jpeg', quality);
          
          if (yPosition > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(
            pageImgData,
            'JPEG',
            margins.left,
            margins.top,
            contentWidth,
            currentPageHeight
          );
          
          yPosition += (currentPageHeight * imgWidth) / contentWidth;
        }
      }

      // Add metadata
      pdf.setProperties({
        title: filename.replace('.pdf', ''),
        subject: 'Resume/CV',
        author: 'ATS Resume Builder',
        creator: 'ATS Resume Builder'
      });

      // Save the PDF
      pdf.save(filename);

      // Hide loading toast
      this.hideLoadingToast(loadingToast);
      
      // Show success message
      this.showSuccessToast(`PDF exported successfully as ${filename}`);

    } catch (error) {
      console.error('PDF export failed:', error);
      this.showErrorToast('Failed to export PDF. Please try again.');
      throw error;
    }
  }

  /**
   * Export CV as image
   */
  static async exportAsImage(
    elementId: string = 'cv-preview',
    options: ExportOptions = {}
  ): Promise<string> {
    const {
      format = 'png',
      quality = 1,
      scale = 2,
      filename = 'resume.png'
    } = options;

    try {
      const element = document.getElementById(elementId) || 
                    document.querySelector('.template-content') as HTMLElement;
      
      if (!element) {
        throw new Error('Element not found for export');
      }

      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Convert to desired format
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const dataUrl = canvas.toDataURL(mimeType, quality);

      // Download the image
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      return dataUrl;
    } catch (error) {
      console.error('Image export failed:', error);
      throw error;
    }
  }

  /**
   * Get CV data for export
   */
  static prepareExportData(cvData: CVData): CVData {
    // Clean up data for export
    return {
      ...cvData,
      // Remove any internal IDs or temporary data
      id: undefined,
    } as CVData;
  }

  /**
   * Check if export is supported
   */
  static isExportSupported(): boolean {
    return typeof window !== 'undefined' && 
           typeof document !== 'undefined' &&
           !!document.createElement('canvas').getContext;
  }

  // Toast notification helpers
  private static showLoadingToast(): HTMLElement {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center';
    toast.innerHTML = `
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      Exporting PDF...
    `;
    document.body.appendChild(toast);
    return toast;
  }

  private static hideLoadingToast(toast: HTMLElement): void {
    if (toast && toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }

  private static showSuccessToast(message: string): void {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  private static showErrorToast(message: string): void {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  }
}

// Utility functions for quick exports
export const exportToPDF = (elementId?: string, filename?: string) => {
  return PDFExportService.exportAsPDF(elementId, { filename });
};

export const exportToImage = (elementId?: string, filename?: string, format: 'png' | 'jpeg' = 'png') => {
  return PDFExportService.exportAsImage(elementId, { format, filename });
};