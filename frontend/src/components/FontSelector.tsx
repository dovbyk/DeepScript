
import React, { useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface FontSelectorProps {
  selectedFont: string | null;
  onSelect: (fontPath: string) => void;
  disabled?: boolean;
}

export const FontSelector: React.FC<FontSelectorProps> = ({ 
  selectedFont, 
  onSelect,
  disabled = false
}) => {
  // Available fonts directly mapped from the public/fonts directory
  const availableFonts = [
    { name: 'Handwriting_1', path: '/fonts/hand1.ttf' },
    { name: 'Handwriting_2', path: '/fonts/hand2.ttf' },
    { name: 'Montserrat', path: '/fonts/montserrat.ttf' },
    { name: 'Playfair', path: '/fonts/playfair.ttf' }
  ];

  const handleFontChange = (value: string) => {
    onSelect(value);
  };

  // Load fonts for preview when component mounts
  useEffect(() => {
    availableFonts.forEach(font => {
      const fontFace = new FontFace(
        `FontPreview_${font.name}`, 
        `url(${font.path})`
      );
      
      fontFace.load().then(loadedFace => {
        document.fonts.add(loadedFace);
      }).catch(err => {
        console.error(`Failed to load font: ${font.name}`, err);
      });
    });
  }, []);

  // Get font name for preview
  const getSelectedFontName = () => {
    if (!selectedFont) return '';
    const selected = availableFonts.find(font => font.path === selectedFont);
    return selected ? selected.name : '';
  };

  const getFontPreviewStyle = () => {
    const fontName = getSelectedFontName();
    return {
      fontFamily: fontName ? `FontPreview_${fontName}` : 'inherit'
    };
  };

  return (
    <div className="space-y-4">
      <label className="input-label">Select from available fonts</label>
      
      <Select 
        value={selectedFont || undefined} 
        onValueChange={handleFontChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-secondary/50 border-white/10">
          <SelectValue placeholder="Choose a font" />
        </SelectTrigger>
        <SelectContent className="bg-secondary border-white/10">
          {availableFonts.map(font => (
            <SelectItem key={font.path} value={font.path} className="hover:bg-muted">
              {font.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedFont && (
        <div className="mt-4 p-4 bg-black/40 border border-white/10 rounded-md animate-fade-in">
          <h3 className="text-sm text-white/70 mb-2">Preview:</h3>
          <p 
            className="text-xl text-white p-2" 
            style={getFontPreviewStyle()}
          >
            This is how your text will look
          </p>
        </div>
      )}
    </div>
  );
};
