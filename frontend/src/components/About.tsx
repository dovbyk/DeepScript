import React from 'react';
import AnimatedText from './AnimatedText';
import { cn } from '@/lib/utils';


const About: React.FC = () => {
  return (
    <div className="glass-panel p-8 animate-fade-in mb-16">
       <h2 className="font-agency font-bold text-3xl md:text-5xl text-center mb-6">DESCRIPTION</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-medium mb-4">About</h3>
          <p className="text-muted-foreground mb-6">
            DeepScript is an open-source handwriting simulation model which can render texts with a custom handwritten font. Users can either use our 
            built-in fonts or can upload their own handwriting sample too. For uploading your sample, draw each glyph that you want to add and upload a scanned image. Note that only the glyphs that you provide will be used in your font.
          </p>
            <p className="text-muted-foreground mb-6">
DeepScript is a capstone mini-project developed as part of our sixth-semester curriculum at KIIT. Our dedicated team has contributed their utmost effort and expertise to deliver a high-quality, innovative solution.
            </p>

        </div>
        
        <div>
          <h3 className="text-xl font-medium mb-4">Key Features</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start">
              <span className="inline-block bg-accent text-black rounded-full p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Real-time text editing</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-accent text-black rounded-full p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Built-in handwritten fonts for diverse styles</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-accent text-black rounded-full p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Custom font upload for personalized projects</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-accent text-black rounded-full p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Instant preview of the output</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-accent text-black rounded-full p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Export to PDF for easy sharing and printing</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
