import type { FC } from "react";

/**
 * Loading component that displays a simple loading text.
 * Used as a fallback for lazy-loaded routes.
 */
const Loading: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
