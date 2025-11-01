import type { FC } from "react";
import { useTranslation } from "react-i18next";
import Template from "../components/templates/Template";

/**
 * Step 3 page component for the wizard form.
 * Situation Descriptions step with AI assistance - third step of the wizard.
 */
const Step3: FC = () => {
  const { t } = useTranslation();
  return (
    <Template currentStep={2}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("pages.step3.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("pages.step3.description")}
          </p>
        </div>

        {/* Form content will go here */}
        <div className="mt-8">
          <p className="text-gray-500 text-center">
            Fields: 1. Current Financial Situation, 2. Employment Circumstances,
            3. Reason for Applying
            <br />
            <span className="text-primary font-medium">
              ✨ AI Assistance Available (Help Me Write button)
            </span>
          </p>
        </div>
      </div>
    </Template>
  );
};

export default Step3;
