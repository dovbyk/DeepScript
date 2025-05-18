import React, { useEffect, useState } from "react";

const LoadingScreen = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      // Add small delay for smooth fade
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // You can adjust this if needed
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin" />
        </div>
      ) : (
        <div className="animate-fade-in transition-opacity duration-700">{children}</div>
      )}
    </>
  );
};

export default LoadingScreen;
