/**
 * useWizard Hook
 * Provides wizard generator and utility functions for wizard steps
 */
import { saveToStorage, loadFromStorage } from "../utils/storage";
import { wizardFlowGenerator, WizardStep } from "../generators/WizardFlow";

// Storage keys for wizard data
const WIZARD_DATA_KEY = "wizard-form-data";
const WIZARD_PROGRESS_KEY = "wizard-progress";

/**
 * Global wizard generator instance
 * Can be imported and used across different step components
 */
let globalWizardGenerator: AsyncGenerator<WizardStep, any, any> | null = null;

/**
 * Get or create the global wizard generator with proper progress initialization
 * Ensures single wizard instance across the application and handles progress restoration
 */
export const getWizardGenerator = () => {
  if (!globalWizardGenerator) {
    globalWizardGenerator = wizardFlowGenerator();
    // Note: The generator itself will check saved progress on initialization
  }
  return globalWizardGenerator;
};

/**
 * Reset the global wizard generator and clear saved data
 * Call this to start over
 */
export const resetWizard = () => {
  globalWizardGenerator = null;
  saveToStorage(WIZARD_DATA_KEY, {});
  saveToStorage(WIZARD_PROGRESS_KEY, 0);
};

/**
 * Reset just the generator (for step submissions)
 * Creates a fresh generator instance
 */
export const resetWizardGenerator = () => {
  globalWizardGenerator = null;
};

/**
 * Get saved form data for a specific step
 * @param step Step number (1, 2, or 3)
 * @returns Saved form data for the step or empty object
 */
export const getStepData = (step: number): any => {
  const savedData = loadFromStorage<Record<string, any>>(WIZARD_DATA_KEY, {});

  switch (step) {
    case 1:
      return savedData.personalInfo || {};
    case 2:
      return savedData.professionalInfo || {};
    case 3:
      return savedData.additionalInfo || {};
    default:
      return {};
  }
};

/**
 * Get the current wizard progress (how many steps completed)
 * @returns Number of completed steps (0-3)
 */
export const getWizardProgress = (): number => {
  return loadFromStorage<number>(WIZARD_PROGRESS_KEY, 0);
};

/**
 * Main useWizard hook that provides all wizard functionality
 * @returns Object with wizard generator and utility functions
 */
export const useWizard = () => {
  return {
    getWizardGenerator,
    resetWizard,
    resetWizardGenerator,
    getStepData,
    getWizardProgress,
  };
};
