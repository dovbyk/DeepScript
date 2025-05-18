
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";

interface PdfPreviewProps {
  pdfData: string | null;
  text: string;
  fontName: string | undefined;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ 
  pdfData, 
  text,
  fontName
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!pdfData) return;
    
    setIsDownloading(true);
    
    try {
      // Create a download link for the PDF
      const element = document.createElement('a');
      element.setAttribute('href', pdfData);
      element.setAttribute('download', `fontify-${Date.now()}.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // When component unmounts, revoke the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (pdfData && pdfData.startsWith('blob:')) {
        URL.revokeObjectURL(pdfData);
      }
    };
  }, [pdfData]);

  if (!pdfData) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-black/60 border border-white/10 rounded-xl p-8 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium">PDF Preview</h3>
            <p className="text-sm text-muted-foreground">
              {fontName ? `Using font: ${fontName}` : 'Custom font applied'}
            </p>
          </div>
          
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="glass-button flex items-center"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
        
        <div className="h-[400px] flex items-center justify-center bg-white rounded-lg overflow-hidden">
          {/* PDF Viewer - we're using an iframe to display the PDF */}
          <iframe 
            src={pdfData} 
            className="w-full h-full border-0"
            title="PDF Preview"
          />
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p className="mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Your PDF has been generated and is ready to download.
        </p>
        <p>The PDF contains your text rendered in the selected font.</p>
      </div>
    </div>
  );
};
