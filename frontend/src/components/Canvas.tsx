
import React, { useRef, useEffect, useState } from 'react';

interface CanvasProps {
  text: string;
  onTextChange: (text: string) => void;
  readOnly?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({ text, onTextChange, readOnly = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editorValue, setEditorValue] = useState(text);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.fillStyle = '#fff';
    ctx.font = '24px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Wrap text if needed
    const maxWidth = canvas.width - 40;
    const lineHeight = 30;
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine);

    // Draw each line
    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2 + i * lineHeight);
    });

    // Create a subtle glow effect
    ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw a subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  }, [text]);

  const handleCanvasClick = () => {
    if (readOnly) return;
    setIsEditing(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorValue(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onTextChange(editorValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      setIsEditing(false);
      onTextChange(editorValue);
    }
  };

  return (
    <div className="canvas-container group">
      {isEditing ? (
        <textarea
          value={editorValue}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full h-[300px] bg-black/90 text-white p-4 border border-white/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Enter your text here..."
        />
      ) : (
        <>
          <canvas 
            ref={canvasRef} 
            onClick={handleCanvasClick}
            className={`w-full h-[300px] ${!readOnly && 'cursor-text hover:opacity-90'} transition-opacity duration-300`}
          />
          
          {!readOnly && (
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={handleCanvasClick}
                className="bg-secondary/80 hover:bg-secondary backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs shadow-lg"
              >
                Edit Text
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
