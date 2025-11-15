import React from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../organisms";
import { WizardProgress, WizardStep } from "../molecules";
import { useWizardNavigation } from "../../lib/contexts";
import { useWizardFlowGuard } from "../../lib/hooks";

interface TemplateProps {
  /** Content to be rendered in the main container */
  children: React.ReactNode;
  /** Optional additional classes for the main content container */
  contentClassName?: string;
}

/**
 * Template component that provides the main layout structure for all wizard pages.
 *
 * Features:
 * - Header with logo and language switcher
 * - WizardProgress component showing current step
 * - Main content container with max-width 1400px and centering
 * - Responsive padding and spacing
 * - RTL support throughout the layout
 *
 * @param props - Template component props
 * @returns {JSX.Element} The template layout component
 */
const Template: React.FC<TemplateProps> = ({
  children,
  contentClassName = "",
}) => {
  const { t } = useTranslation();
  const { wizardStep } = useWizardNavigation();
  const { hasApplicationNumber } = useWizardFlowGuard();
  
  // Check if navigation should be disabled (when application is completed)
  const shouldDisableNavigation = hasApplicationNumber();

  // Generate wizard steps with proper statuses based on wizardStep
  const getWizardSteps = (): WizardStep[] => [
    {
      id: "personal-info",
      title: t("wizard.steps.personalInfo"),
      status:
        wizardStep > 0 ? "completed" : wizardStep === 0 ? "active" : "inactive",
      route: "/step1",
    },
    {
      id: "family-financial",
      title: t("wizard.steps.familyFinancial"),
      status:
        wizardStep > 1 ? "completed" : wizardStep === 1 ? "active" : "inactive",
      route: "/step2",
    },
    {
      id: "situation",
      title: t("wizard.steps.situationDesc"),
      status:
        wizardStep > 2 ? "completed" : wizardStep === 2 ? "active" : "inactive",
      route: "/step3",
    },
  ];
  const steps = getWizardSteps();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="w-full">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <WizardProgress 
              steps={steps} 
              disableNavigation={shouldDisableNavigation}
            />
          </div>

          <div
            className={`w-full bg-white rounded-lg shadow-sm p-3 sm:p-6 lg:p-8 ${contentClassName}`}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Template;
