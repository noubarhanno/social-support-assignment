import type { FC } from "react";

/**
 * Summary page component that displays the final results.
 * This page will show a summary of all form submissions.
 */
const Summary: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Summary</h1>
        <p className="text-gray-600">
          This is the summary page showing the form results. Content will be
          implemented later.
        </p>
      </div>
    </div>
  );
};

export default Summary;
