import React, { useRef, useState } from 'react';

interface ProcessedImage {
  path: string;
  name: string;
}

interface FontUploaderProps {
  onUpload: (file: File, processedImages: ProcessedImage[]) => void;
  customFont: File | null;
  disabled?: boolean;
  // Callback to notify parent that the generated font file is selected.
  onGeneratedFont: (fontFile: File) => void;
}

const FontUploader: React.FC<FontUploaderProps> = ({
  onUpload,
  customFont,
  disabled = false,
  onGeneratedFont,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [generatedFont, setGeneratedFont] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const isValidJPEG = (fileName: string) => {
    const lower = fileName.toLowerCase();
    return lower.endsWith('.jpg') || lower.endsWith('.jpeg');
  };

  // Sends the JPEG file to the /process-image endpoint.
  const sendImageToEndpoint = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/process-image', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to process image');
      }
      const data = await response.json();
      // Map the received image paths into objects with a default name
      const images: ProcessedImage[] = data.processed_images.map((path: string) => {
        const parts = path.split('/');
        const defaultName = parts[parts.length - 1];
        return { path, name: defaultName };
      });
      setProcessedImages(images);
      onUpload(file, images);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidJPEG(file.name)) {
        sendImageToEndpoint(file);
      } else {
        alert('Please upload a valid JPEG file (.jpg or .jpeg)');
      }
    }
  };

  const handleBrowseClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidJPEG(file.name)) {
        sendImageToEndpoint(file);
      } else {
        alert('Please upload a valid JPEG file (.jpg or .jpeg)');
      }
    }
  };

  const handleRename = (index: number, newName: string) => {
    setProcessedImages(prev =>
      prev.map((img, idx) =>
        idx === index ? { ...img, name: newName } : img
      )
    );
  };

  // Generate font from the processed images without auto-downloading
  const generateFont = async () => {
    if (!processedImages.length) {
      alert("No images to process");
      return;
    }

    setIsGenerating(true);

    // Prepare the payload with updated names
    const pngFileMappings = processedImages.map(img => ({
      original_path: img.path,
      new_name: img.name,
    }));

    try {
      const response = await fetch("http://localhost:5000/generate-font", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ png_files: pngFileMappings }),
      });

      if (!response.ok) {
        throw new Error("Error generating font");
      }

      // Convert response to a File object
      const blob = await response.blob();
      const ttfFile = new File([blob], "CustomFont.ttf", { type: "font/ttf" });
      setGeneratedFont(ttfFile);
      alert("Font generated! Please review the generated font below.");
    } catch (error) {
      console.error("Font generation error:", error);
      alert("Failed to generate font");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 
          ${dragActive ? 'border-accent/70 bg-accent/5' : 'border-white/10'} 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleBrowseClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden"
          accept=".jpg,.jpeg" 
          onChange={handleFileChange}
          disabled={disabled}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div className="text-sm text-muted-foreground">
            {customFont ? (
              <span className="text-white">{customFont.name}</span>
            ) : (
              <>
                <span className="font-medium">Click to upload</span> or drag and drop
                <p className="text-xs mt-1">JPEG file (.jpg or .jpeg, max. 5MB)</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Display Processed Images with Renaming */}
      {processedImages.length > 0 && (
        <div className="flex gap-4 overflow-auto mt-4">
          {processedImages.map((img, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <img 
                src={`http://localhost:5000/get-image?path=${encodeURIComponent(img.path)}`} 
                alt={`Processed image ${idx}`} 
                className="h-40"
              />
              <input
                type="text"
                value={img.name}
                onChange={(e) => handleRename(idx, e.target.value)}
                className="mt-2 text-center bg-transparent border-b border-gray-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
      )}

      {/* Generate Font Button */}
      <button 
        className="glass-button flex items-center mt-4"
        onClick={generateFont}
        disabled={isGenerating}
      >
        {isGenerating ? "Generating Font..." : "Generate Font"}
      </button>

      {/* Display Generated Font Section */}
      {generatedFont && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-800">
          <p className="text-white mb-2">Generated Font: {generatedFont.name}</p>
          <p className="text-sm text-gray-300">Click the button below to select this font for rendering your text.</p>
          <button 
            className="mt-2 p-2 bg-accent text-black rounded"
            onClick={() => onGeneratedFont(generatedFont)}
          >
            Select this Font
          </button>
        </div>
      )}
    </div>
  );
};

export default FontUploader;
