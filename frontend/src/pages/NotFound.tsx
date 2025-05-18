
import React from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen watermark-background flex items-center justify-center p-4">
      <div className="glass-panel p-8 max-w-md w-full animate-fade-in">
        <div className="text-center">
          <h1 className="text-6xl font-bold font-agency mb-4 text-glow">404</h1>
          <p className="text-xl mb-6">Page not found</p>
          <p className="text-muted-foreground mb-8">
            The page at <span className="text-accent">{location.pathname}</span> doesn't exist.
          </p>
          
          <Link 
            to="/" 
            className="glass-button inline-flex items-center px-6 py-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
