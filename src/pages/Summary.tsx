import type { FC } from "react";
import { useTranslation } from "react-i18next";
import Template from "../components/templates/Template";

/**
 * Summary page component that displays the final results.
 * Shows a summary of all form submissions after completion.
 */
const Summary: FC = () => {
  const { t } = useTranslation();
  return (
    <Template currentStep={3}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">
            {t("pages.summary.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("pages.summary.description")}
          </p>
        </div>

        {/* Summary content will go here */}
        <div className="mt-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              What happens next?
            </h2>
            <ul className="text-green-700 space-y-1">
              <li>
                • We will review your application within 2-3 business days
              </li>
              <li>• You will receive an email confirmation shortly</li>
              <li>• Our support team will contact you to discuss next steps</li>
            </ul>
          </div>
        </div>
      </div>
    </Template>
  );
};

export default Summary;
