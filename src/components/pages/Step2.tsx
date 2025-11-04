import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Template } from "../templates";

/**
 * Step 2 page component for the wizard form.
 * Family & Financial Information step - second step of the wizard.
 */
const Step2: FC = () => {
  const { t } = useTranslation();
  return (
    <Template currentStep={1}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("pages.step2.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("pages.step2.description")}
          </p>
        </div>

        {/* Form content will go here */}
        <div className="mt-8">
          <p className="text-gray-500 text-center">
            Fields: Marital Status, Dependents, Employment Status, Monthly
            Income, Housing Status
          </p>
        </div>
      </div>
    </Template>
  );
};

export default Step2;
