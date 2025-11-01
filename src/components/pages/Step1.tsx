import type { FC } from "react";
import { useTranslation } from "react-i18next";
import Template from "../templates/Template";

/**
 * Step 1 page component for the wizard form.
 * Personal Information step - first step of the wizard.
 */
const Step1: FC = () => {
  const { t } = useTranslation();

  return (
    <Template currentStep={0}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("pages.step1.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("pages.step1.description")}
          </p>
        </div>

        {/* Form content will go here */}
        <div className="mt-8">
          <p className="text-gray-500 text-center">
            Fields: Name, National ID, Date of Birth, Gender, Address, City,
            State, Country, Phone, Email
          </p>
        </div>
      </div>
    </Template>
  );
};

export default Step1;
