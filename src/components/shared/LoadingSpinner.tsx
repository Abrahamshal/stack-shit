const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;