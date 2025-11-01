import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../organisms/Header";
import WizardProgress, { WizardStep } from "../molecules/WizardProgress";

interface TemplateProps {
  /** The current step in the wizard (0-based index) */
  currentStep: number;
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
  currentStep,
  children,
  contentClassName = "",
}) => {
  const { t } = useTranslation();

  // Generate wizard steps with proper statuses based on currentStep
  const getWizardSteps = (): WizardStep[] => [
    {
      id: "personal-info",
      title: t("wizard.steps.personalInfo"),
      status:
        currentStep > 0
          ? "completed"
          : currentStep === 0
          ? "active"
          : "inactive",
    },
    {
      id: "family-financial",
      title: t("wizard.steps.familyFinancial"),
      status:
        currentStep > 1
          ? "completed"
          : currentStep === 1
          ? "active"
          : "inactive",
    },
    {
      id: "situation-desc",
      title: t("wizard.steps.situationDesc"),
      status:
        currentStep > 2
          ? "completed"
          : currentStep === 2
          ? "active"
          : "inactive",
    },
  ];

  const steps = getWizardSteps();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <WizardProgress steps={steps} />
          </div>

          <div
            className={`w-full bg-white rounded-lg shadow-sm p-6 sm:p-8 ${contentClassName}`}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Template;
