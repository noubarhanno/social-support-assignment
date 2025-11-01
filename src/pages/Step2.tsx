import type { FC } from "react";

/**
 * Step 2 page component for the wizard form.
 * This page will contain the second step of the wizard form.
 */
const Step2: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Step 2</h1>
        <p className="text-gray-600">
          This is the second step of the wizard form. Content will be
          implemented later.
        </p>
      </div>
    </div>
  );
};

export default Step2;
