import type { FC } from "react";
import { useTranslation } from "react-i18next";

/**
 * Step 1 page component for the wizard form.
 * This page will contain the first step of the wizard form.
 */
const Step1: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {t("pages.step1.title")}
        </h1>
        <p className="text-gray-600">{t("pages.step1.description")}</p>
      </div>
    </div>
  );
};

export default Step1;
