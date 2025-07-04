import React, { useState } from 'react';
import { Canvas } from '../components/Canvas';
import { FontSelector } from '../components/FontSelector';
import { PdfPreview } from '../components/PdfPreview';
import FontUploader from '../components/FontUploader';
import { toast } from "sonner";
import { renderText } from '../api/textRenderer';
import Contributors from '../components/Contributors';
import About from '../components/About';

const Index = () => {
  const [canvasText, setCanvasText] = useState('Type Something...');
  const [selectedFontPath, setSelectedFontPath] = useState<string | null>(null);
  const [customFont, setCustomFont] = useState<File | null>(null);
  const [selectedFont, setSelectedFont] = useState<File | null>(null);
  const [generatedPdf, setGeneratedPdf] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [fontSelectionMethod, setFontSelectionMethod] = useState<'select' | 'upload'>('select');

  const generatePdf = async () => {
    if (!canvasText || (!selectedFont && !selectedFontPath)) {
      toast.error("Please provide text and select a font");
      return;
    }

    setIsGenerating(true);

    try {
      let fontFile: File;
      if (customFont) {
        fontFile = customFont;
      } else if (selectedFont) {
        fontFile = selectedFont;
      } else if (selectedFontPath) {
        const response = await fetch(selectedFontPath);
        if (!response.ok) throw new Error("Failed to fetch the selected font file");

        const blob = await response.blob();
        const fontName = selectedFontPath.split('/').pop() || 'font.ttf';
        fontFile = new File([blob], fontName, { type: 'font/ttf' });
        setSelectedFont(fontFile);
      } else {
        toast.error("No font file available");
        setIsGenerating(false);
        return;
      }

      const pdfData = await renderText({ text: canvasText, fontFile });
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
    setSelectedFont(null);
    const fontName = fontPath.split('/').pop() || 'Selected Font';
    toast.info(`Selected font: ${fontName}`);
  };

  const handleCustomFontUpload = (file: File) => {
    setCustomFont(file);
    setSelectedFontPath(null);
    setSelectedFont(file);
    toast.info(`Uploaded custom font: ${file.name}`);
  };

  const handleGeneratedFont = (fontFile: File) => {
    setSelectedFont(fontFile);
    setCustomFont(null);
    setSelectedFontPath(null);
    toast.info(`Generated font selected: ${fontFile.name}`);
  };

  const handleCanvasTextChange = (text: string) => {
    setCanvasText(text);
  };

  const handleNext = () => {
    if (!canvasText.trim()) {
      toast.error("Please enter some text.");
      return;
    }

    if (!selectedFont && !selectedFontPath) {
      toast.error("Please select or upload a font.");
      return;
    }

    generatePdf();
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const toggleFontSelectionMethod = (method: 'select' | 'upload') => {
    setFontSelectionMethod(method);
    if (method === 'select') {
      setCustomFont(null);
      setSelectedFont(null);
    } else {
      setSelectedFontPath(null);
      setSelectedFont(null);
    }
  };

  return (
    <div className="min-h-screen watermark-background pt-12 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center animate-slide-down">
           
            <a 
              href="https://github.com/dovbyk/DeepScript/blob/main/README.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute top-0 left-0 p-4 text-base md:text-base text-white hover:underline"
            >
              Read Instructions
            </a>
          <a 
              href="https://github.com/dovbyk/DeepScript" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute top-0 right-0 p-4"
            >
              <img 
                src="/github.jpg" 
                alt="GitHub" 
                className="w-10 h-10 hover:opacity-80 transition-opacity"
              />
          </a>
          
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png"
              alt="DeepScript Logo"
              className="max-w-[min(100%,800px)] w-auto h-[clamp(80px,20vmin,200px)] md:h-[clamp(100px,25vmin,300px)]"
            />
          </div>
          <h2 className="font-agency font-bold text-3xl md:text-5xl text-center mb-6">
            TRANSFORM ANY TEXT INTO A REALISTIC HANDWRITING
          </h2>
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
            <Canvas 
              text={canvasText}
              onTextChange={handleCanvasTextChange}
              readOnly={false}
            />
          </div>

          {/* Step 2: Font Selection (Always visible now) */}
          <div className="glass-panel p-6 animate-zoom-in delay-100">
            <div className="flex items-center mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${activeStep >= 2 ? 'bg-accent text-black' : 'bg-secondary text-white'}`}>
                2
              </div>
              <h2 className="font-agency text-2xl">SELECT FONT</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex gap-4 mb-6">
                <button 
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${fontSelectionMethod === 'select' ? 'bg-accent text-black' : 'bg-secondary/50 hover:bg-secondary/70'}`}
                  onClick={() => toggleFontSelectionMethod('select')}
                  disabled={!canvasText.trim()}
                >
                  Select Font
                </button>
                <button 
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${fontSelectionMethod === 'upload' ? 'bg-accent text-black' : 'bg-secondary/50 hover:bg-secondary/70'}`}
                  onClick={() => toggleFontSelectionMethod('upload')}
                  disabled={!canvasText.trim()}
                >
                  Upload Your Writing Sample (Check the instructions above)
                </button>
              </div>

              {fontSelectionMethod === 'select' && (
                <FontSelector 
                  selectedFont={selectedFontPath}
                  onSelect={handleFontSelect}
                  disabled={!canvasText.trim()}
                />
              )}
              {fontSelectionMethod === 'upload' && (
                <FontUploader 
                  onUpload={handleCustomFontUpload}
                  onGeneratedFont={handleGeneratedFont}
                  customFont={customFont}
                  disabled={!canvasText.trim()}
                />
              )}
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
              <button className="glass-button flex items-center" onClick={handleBack}>
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
          <p>© 2025 DeepScript. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
