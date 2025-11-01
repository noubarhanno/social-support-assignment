import type { FC } from "react";

/**
 * Step 3 page component for the wizard form.
 * This page will contain the third step of the wizard form with AI integration.
 */
const Step3: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Step 3</h1>
        <p className="text-gray-600">
          This is the third step of the wizard form with AI assistance. Content
          will be implemented later.
        </p>
      </div>
    </div>
  );
};

export default Step3;
