import React from 'react';

const About: React.FC = () => {
  return (
    <div className="glass-panel p-8 animate-fade-in mb-16">
      <h2 className="font-agency text-3xl text-center mb-8">DESCRIPTION</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-medium mb-4">Our Mission</h3>
          <p className="text-muted-foreground mb-6">
            Fontify was created with a single purpose: to democratize font styling and make custom typography accessible to everyone. 
            We believe that beautiful text should not be limited by technical knowledge or expensive software.
          </p>
          <p className="text-muted-foreground">
            Our platform allows you to transform ordinary text into stunning visual compositions through an 
            intuitive interface, whether you're a professional designer or just starting your creative journey.
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
              <span>Real-time text editing with instant preview</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-accent text-black rounded-full p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Curated font library with diverse styling options</span>
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
              <span>AI-powered font generation from handwriting samples</span>
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
