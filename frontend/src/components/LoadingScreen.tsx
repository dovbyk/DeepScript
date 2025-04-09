
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  children: React.ReactNode;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a short loading time, then hide the loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Logo animation variants
  const logoVariants = {
    hidden: { 
      pathLength: 0,
      opacity: 0 
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { 
        duration: 1,
        ease: "easeInOut",
      }
    }
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  return (
    <>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 1 }}
          onAnimationComplete={() => {
            document.body.style.overflow = "auto";
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32"
          >
            <motion.svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {/* Animated logo elements */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="white"
                strokeWidth="2"
                fill="none"
                variants={logoVariants}
              />
              <motion.path
                d="M30 40 L50 65 L70 40"
                stroke="white"
                strokeWidth="2"
                fill="none"
                variants={logoVariants}
              />
              <motion.path
                d="M30 60 L50 35 L70 60"
                stroke="white"
                strokeWidth="2"
                fill="none"
                variants={logoVariants}
                transition={{ delay: 0.3, duration: 1 }}
              />
            </motion.svg>
          </motion.div>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default LoadingScreen;
