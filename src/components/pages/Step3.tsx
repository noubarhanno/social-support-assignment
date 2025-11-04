import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Template } from "../templates";
import { useWizardNavigation } from "../../lib/contexts";
import { StepHeader } from "../atoms";

/**
 * Step 3 page component for the wizard form.
 * Situation Descriptions step with AI assistance - third step of the wizard.
 */
const Step3: FC = () => {
  const { t } = useTranslation();
  const { setWizardStep } = useWizardNavigation();

  // Set wizard step to 2 when component mounts
  useEffect(() => {
    setWizardStep(2);
  }, [setWizardStep]);

  return (
    <Template>
      <div className="space-y-6">
        <StepHeader
          title={t("pages.step3.title")}
          description={t("pages.step3.description")}
        />

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
