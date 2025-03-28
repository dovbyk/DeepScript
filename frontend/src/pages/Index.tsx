import React, { useState } from 'react';
import { Canvas } from '../components/Canvas';
import { FontSelector } from '../components/FontSelector';
import { PdfPreview } from '../components/PdfPreview';
import FontUploader from '../components/FontUploader';
import { toast } from "sonner";
import { renderText } from '../api/textRenderer';
import  Contributors from '../components/Contributors';
import  About from '../components/About';

const Index = () => {
  const [canvasText, setCanvasText] = useState('Type something...');
  const [selectedFontPath, setSelectedFontPath] = useState<string | null>(null);
  const [customFont, setCustomFont] = useState<File | null>(null);
  const [selectedFont, setSelectedFont] = useState<File | null>(null); // holds the final chosen font
  const [generatedPdf, setGeneratedPdf] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [fontSelectionMethod, setFontSelectionMethod] = useState<'select' | 'upload'>('select');

  // When generating PDF, use selectedFont if available. 
  // If not, and if a font is selected via dropdown, fetch it.
  const generatePdf = async () => {
    if (!canvasText || (!selectedFont && !selectedFontPath)) {
      toast.error("Please provide text and select a font");
      return;
    }
    setIsGenerating(true);
    
    try {
      let fontFile: File;
      if (customFont) {
        // Use uploaded custom font
        fontFile = customFont;
        console.log("Using custom font file:", customFont.name);
      } else if (selectedFont) {
        // Already have selected font (e.g. generated font)
        fontFile = selectedFont;
        console.log("Using selected font file from generated/uploaded:", fontFile.name);
      } else if (selectedFontPath) {
        // Fetch the font file from the provided URL
        const response = await fetch(selectedFontPath);
        if (!response.ok) {
          throw new Error("Failed to fetch the selected font file");
        }
        const blob = await response.blob();
        const fontName = selectedFontPath.split('/').pop() || 'font.ttf';
        fontFile = new File([blob], fontName, { type: 'font/ttf' });
        console.log("Fetched selected font file:", fontName);
        // Optionally, update state so subsequent PDF generation uses this file
        setSelectedFont(fontFile);
      } else {
        toast.error("No font file available");
        setIsGenerating(false);
        return;
      }
      
      // Call the renderText function from our API with the actual font file
      const pdfData = await renderText({
        text: canvasText,
        fontFile: fontFile
      });
      
      setGeneratedPdf(pdfData);
      toast.success("PDF generated successfully!");
      setActiveStep(3);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFontSelect = (fontPath: string) => {
    setSelectedFontPath(fontPath);
    setCustomFont(null);
    // Reset any previously generated font
    setSelectedFont(null);
    const fontName = fontPath.split('/').pop() || 'Selected Font';
    toast.info(`Selected font: ${fontName}`);
    // Optionally, you can fetch the font here and update selectedFont if desired.
  };

  const handleCustomFontUpload = (file: File) => {
    setCustomFont(file);
    setSelectedFontPath(null);
    // When a custom font is uploaded, set it as the selected font
    setSelectedFont(file);
    toast.info(`Uploaded custom font: ${file.name}`);
  };

  // Callback for when FontUploader generates a new font.
  const handleGeneratedFont = (fontFile: File) => {
    // When a generated font is produced, store it as the selected font.
    setSelectedFont(fontFile);
    // Also, reset any other font selections
    setCustomFont(null);
    setSelectedFontPath(null);
    toast.info(`Generated font selected: ${fontFile.name}`);
  };

  const handleCanvasTextChange = (text: string) => {
    setCanvasText(text);
  };

  const handleNext = () => {
    if (activeStep === 1 && canvasText.trim()) {
      setActiveStep(2);
    } else if (activeStep === 2) {
      generatePdf();
    }
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const toggleFontSelectionMethod = (method: 'select' | 'upload') => {
    setFontSelectionMethod(method);
    if (method === 'select') {
      setCustomFont(null);
      // When switching back to select, clear any generated font
      setSelectedFont(null);
    } else {
      setSelectedFontPath(null);
      // When using upload, clear any previously selected font from FontSelector
      setSelectedFont(null);
    }
  };

  return (
    <div className="min-h-screen watermark-background pt-12 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center animate-slide-down">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gradient leading-tight max-w-4xl mx-auto font-agency">
            DEEPSCRIPT
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground animate-fade-in">
            Transform your text with custom font styling
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12">
          {/* Step 1: Enter Text */}
          <div className="glass-panel p-6 animate-zoom-in">
            <div className="flex items-center mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${activeStep >= 1 ? 'bg-accent text-black' : 'bg-secondary text-white'}`}>
                1
              </div>
              <h2 className="font-agency text-2xl">ENTER YOUR TEXT</h2>
            </div>
            <div className={`transition-opacity duration-500 ${activeStep === 1 ? 'opacity-100' : 'opacity-50'}`}>
              <Canvas 
                text={canvasText}
                onTextChange={handleCanvasTextChange}
                readOnly={activeStep !== 1}
              />
            </div>
          </div>

          {/* Step 2: Select/Upload/Generate Font */}
          <div className="glass-panel p-6 animate-zoom-in delay-100">
            <div className="flex items-center mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${activeStep >= 2 ? 'bg-accent text-black' : 'bg-secondary text-white'}`}>
                2
              </div>
              <h2 className="font-agency text-2xl">SELECT FONT</h2>
            </div>
            <div className={`transition-opacity duration-500 ${activeStep === 2 ? 'opacity-100' : 'opacity-50'}`}>
              <div className="flex gap-4 mb-6">
                <button 
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${fontSelectionMethod === 'select' ? 'bg-accent text-black' : 'bg-secondary/50 hover:bg-secondary/70'}`}
                  onClick={() => toggleFontSelectionMethod('select')}
                  disabled={activeStep !== 2}
                >
                  Select Font
                </button>
                <button 
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${fontSelectionMethod === 'upload' ? 'bg-accent text-black' : 'bg-secondary/50 hover:bg-secondary/70'}`}
                  onClick={() => toggleFontSelectionMethod('upload')}
                  disabled={activeStep !== 2}
                >
                  Upload/Generate Font
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {fontSelectionMethod === 'select' && (
                  <FontSelector 
                    selectedFont={selectedFontPath}
                    onSelect={handleFontSelect}
                    disabled={activeStep !== 2}
                  />
                )}
                {fontSelectionMethod === 'upload' && (
                  <FontUploader 
                    onUpload={handleCustomFontUpload}
                    onGeneratedFont={handleGeneratedFont}
                    customFont={customFont}
                    disabled={activeStep !== 2}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Preview & Download */}
          {activeStep === 3 && (
            <div className="glass-panel p-6 animate-zoom-in delay-200">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-accent text-black">
                  3
                </div>
                <h2 className="font-agency text-2xl">PREVIEW & DOWNLOAD</h2>
              </div>
              <PdfPreview 
                pdfData={generatedPdf} 
                text={canvasText} 
                fontName={
                  selectedFontPath 
                    ? selectedFontPath.split('/').pop() || 'Selected Font'
                    : selectedFont?.name || customFont?.name || 'Default'
                } 
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            {activeStep > 1 && (
              <button 
                className="glass-button flex items-center"
                onClick={handleBack}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back
              </button>
            )}
            {activeStep < 3 && (
              <button 
                className="glass-button flex items-center ml-auto"
                onClick={handleNext}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
            

        <div className="mt-60">
          <About />
        </div>   


        <div className="mt-60">
          <Contributors />
        </div>

        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <p>© 2023 Fontify. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
