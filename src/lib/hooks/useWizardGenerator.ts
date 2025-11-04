/**
 * Centralized Wizard Generator
 * Simple JavaScript generator for managing 3-step wizard flow
 */

export interface WizardStep {
  step: number;
  message: string;
  isComplete: boolean;
}

/**
 * Centralized Wizard Generator Function
 * Manages the 3-step wizard flow and data collection
 *
 * @returns Generator that yields current step info and collects form data
 */
export function* wizardController(): Generator<WizardStep, any, any> {
  const allFormData: Record<string, any> = {};

  // Step 1: Personal Information
  const step1Data = yield {
    step: 1,
    message: "Please fill in your personal information",
    isComplete: false,
  };

  if (step1Data) {
    allFormData.personalInfo = step1Data;
  }

  // Step 2: Professional Information
  const step2Data = yield {
    step: 2,
    message: "Please provide your professional details",
    isComplete: false,
  };

  if (step2Data) {
    allFormData.professionalInfo = step2Data;
  }

  // Step 3: Review & Additional Info
  const step3Data = yield {
    step: 3,
    message: "Please review and add any additional information",
    isComplete: false,
  };

  if (step3Data) {
    allFormData.additionalInfo = step3Data;
  }

  // Final submission - return data for external submission
  return {
    success: true,
    allData: allFormData,
    message: "Wizard completed successfully!",
  };
}

/**
 * Create a new wizard generator instance
 * Call this to start a new wizard flow
 */
export const createWizard = () => wizardController();

/**
 * Global wizard generator instance
 * Can be imported and used across different step components
 */
let globalWizardGenerator: Generator<WizardStep, any, any> | null = null;

/**
 * Get or create the global wizard generator
 * Ensures single wizard instance across the application
 */
export const getWizardGenerator = () => {
  if (!globalWizardGenerator) {
    globalWizardGenerator = wizardController();
  }
  return globalWizardGenerator;
};

/**
 * Reset the global wizard generator
 * Call this to start over
 */
export const resetWizard = () => {
  globalWizardGenerator = null;
};
