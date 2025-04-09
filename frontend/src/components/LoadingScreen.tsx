const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black transition-opacity duration-500">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-gray-400 dark:border-gray-600 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
