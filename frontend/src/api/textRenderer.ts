
import { toast } from "sonner";

interface RenderTextOptions {
  text: string;
  fontFile: File;
}

export async function renderText({ text, fontFile }: RenderTextOptions): Promise<string> {
  try {
    // Create form data to send to backend
    const formData = new FormData();
    formData.append('input_text', text);
    formData.append('fontfile', fontFile);
    
    console.log("Sending text to renderer:", text);
    console.log("Sending font file:", fontFile.name);
    
    // Send request to backend
    const response = await fetch('https://betadeep.onrender.com/render', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    // Get blob directly from response
    const blob = await response.blob();
    
    // Convert blob to data URL for preview
    const dataUrl = URL.createObjectURL(blob);
    
    toast.success("PDF generated successfully!");
    return dataUrl;
  } catch (error) {
    console.error("Error rendering text:", error);
    toast.error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}
