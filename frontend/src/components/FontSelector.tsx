
import React from 'react';
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
    { name: 'Playfair Display', path: '/fonts/playfair.ttf' }
  ];

  // Preview text
  const previewText = "The quick brown fox jumps over the lazy dog";

  const handleFontChange = (value: string) => {
    onSelect(value);
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
          <h3 className="text-sm text-muted-foreground mb-2">Preview:</h3>
          <div 
            className="text-lg text-white"
            style={{ 
              fontFamily: availableFonts.find(f => f.path === selectedFont)?.name || 'Inter',
            }}
          >
            {previewText}
          </div>
        </div>
      )}
    </div>
  );
};
