/**
 * useWizardFlowGuard Hook
 * Manages wizard step completion state and URL navigation restrictions
 */
import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/constants";

// Step data keys mapping - now using wizard-form-data structure
const STEP_DATA_KEYS = {
  1: "personalInfo",
  2: "professionalInfo",
  3: "additionalInfo",
} as const;

type StepNumber = keyof typeof STEP_DATA_KEYS;

interface StepCompletionData {
  isCompleted: boolean;
  completedAt?: string;
}

/**
 * Custom hook to manage wizard flow completion and navigation restrictions
 *
 * Features:
 * - Tracks completion state for each step in localStorage
 * - Prevents direct URL navigation to incomplete steps
 * - Redirects users to appropriate step based on completion status
 * - Manages application number generation only after proper completion
 *
 * @returns Object with flow management functions
 */
export const useWizardFlowGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Get completion state for a specific step
   */
  const getStepCompletion = useCallback(
    (step: StepNumber): StepCompletionData => {
      const wizardData = loadFromStorage<any>(STORAGE_KEYS.WIZARD_DATA, {});
      const stepKey = STEP_DATA_KEYS[step];
      const stepData = wizardData[stepKey] || {};
      return {
        isCompleted: stepData.isCompleted || false,
        completedAt: stepData.completedAt,
      };
    },
    []
  );

  /**
   * Mark a step as completed
   */
  const markStepCompleted = useCallback((step: StepNumber) => {
    const wizardData = loadFromStorage<any>(STORAGE_KEYS.WIZARD_DATA, {});
    const stepKey = STEP_DATA_KEYS[step];
    const existingStepData = wizardData[stepKey] || {};

    const updatedStepData = {
      ...existingStepData,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    };

    const updatedWizardData = {
      ...wizardData,
      [stepKey]: updatedStepData,
    };

    saveToStorage(STORAGE_KEYS.WIZARD_DATA, updatedWizardData);
  }, []);

  /**
   * Mark a step as incomplete and invalidate subsequent steps
   * Called when user goes back and modifies required fields
   */
  const markStepIncomplete = useCallback((step: StepNumber) => {
    const wizardData = loadFromStorage<any>(STORAGE_KEYS.WIZARD_DATA, {});

    // Mark current step and all subsequent steps as incomplete
    for (let s = step; s <= 3; s++) {
      const stepKey = STEP_DATA_KEYS[s as StepNumber];
      if (wizardData[stepKey]) {
        wizardData[stepKey] = {
          ...wizardData[stepKey],
          isCompleted: false,
          completedAt: undefined,
        };
      }
    }

    saveToStorage(STORAGE_KEYS.WIZARD_DATA, wizardData);
  }, []);

  /**
   * Get the highest completed step number
   */
  const getLastCompletedStep = useCallback((): number => {
    let lastCompleted = 0;

    for (let step = 1; step <= 3; step++) {
      const completion = getStepCompletion(step as StepNumber);
      if (completion.isCompleted) {
        lastCompleted = step;
      } else {
        break; // Stop at first incomplete step
      }
    }

    return lastCompleted;
  }, [getStepCompletion]);

  /**
   * Check if all steps are completed
   */
  const areAllStepsCompleted = useCallback((): boolean => {
    return [1, 2, 3].every(
      (step) => getStepCompletion(step as StepNumber).isCompleted
    );
  }, [getStepCompletion]);

  /**
   * Get the next allowed step based on completion state
   */
  const getNextAllowedStep = useCallback((): number => {
    const lastCompleted = getLastCompletedStep();
    return Math.min(lastCompleted + 1, 3);
  }, [getLastCompletedStep]);

  /**
   * Validate if user can access a specific route
   */
  const canAccessRoute = useCallback(
    (route: string): boolean => {
      const routeToStep: Record<string, number> = {
        "/step1": 1,
        "/step2": 2,
        "/step3": 3,
        "/summary": 4,
      };

      const targetStep = routeToStep[route];
      if (!targetStep) return true; // Allow non-wizard routes

      // Step 1 is always accessible
      if (targetStep === 1) return true;

      // For steps 2-3, check if previous steps are completed
      if (targetStep <= 3) {
        const lastCompleted = getLastCompletedStep();
        return targetStep <= lastCompleted + 1;
      }

      // Summary page requires all steps completed
      if (targetStep === 4) {
        return areAllStepsCompleted();
      }

      return false;
    },
    [getLastCompletedStep, areAllStepsCompleted]
  );

  /**
   * Redirect to appropriate step based on completion state
   */
  const redirectToAppropriateStep = useCallback(() => {
    const currentPath = location.pathname;

    if (!canAccessRoute(currentPath)) {
      const nextAllowed = getNextAllowedStep();
      const targetRoute = nextAllowed <= 3 ? `/step${nextAllowed}` : "/step1";
      navigate(targetRoute, { replace: true });
    }
  }, [location.pathname, canAccessRoute, getNextAllowedStep, navigate]);

  /**
   * Reset all completion states (for new application)
   */
  const resetAllCompletions = useCallback(() => {
    const wizardData = loadFromStorage<any>(STORAGE_KEYS.WIZARD_DATA, {});

    [1, 2, 3].forEach((step) => {
      const stepKey = STEP_DATA_KEYS[step as StepNumber];
      if (wizardData[stepKey]) {
        wizardData[stepKey] = {
          ...wizardData[stepKey],
          isCompleted: false,
          completedAt: undefined,
        };
      } else {
        // Initialize step data with completion state if it doesn't exist
        wizardData[stepKey] = {
          isCompleted: false,
          completedAt: undefined,
        };
      }
    });

    saveToStorage(STORAGE_KEYS.WIZARD_DATA, wizardData);
  }, []);

  /**
   * Check if application number should be generated
   * Only true if all steps completed through proper flow
   */
  const shouldGenerateApplicationNumber = useCallback((): boolean => {
    return areAllStepsCompleted() && location.pathname === "/summary";
  }, [areAllStepsCompleted, location.pathname]);

  return {
    getStepCompletion,
    markStepCompleted,
    markStepIncomplete,
    getLastCompletedStep,
    areAllStepsCompleted,
    canAccessRoute,
    redirectToAppropriateStep,
    resetAllCompletions,
    shouldGenerateApplicationNumber,
    getNextAllowedStep,
  };
};
