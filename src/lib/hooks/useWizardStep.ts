import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export type WizardStepPath = "/" | "/step1" | "/step2" | "/step3" | "/summary";

export const STORAGE_KEY = "wizard-current-step";

/**
 * Custom hook for managing wizard step persistence using localStorage.
 * Automatically saves the current step and provides navigation helpers.
 *
 * Features:
 * - Persists current step to localStorage
 * - Automatically redirects from root to last visited step
 * - Provides navigation helpers for step transitions
 * - Handles invalid step states gracefully
 */
export const useWizardStep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<number>(0);

  /**
   * Get the step number from a path
   */
  const getStepFromPath = (path: string): number => {
    switch (path) {
      case "/":
      case "/step1":
        return 0;
      case "/step2":
        return 1;
      case "/step3":
        return 2;
      case "/summary":
        return 3;
      default:
        return 0;
    }
  };

  /**
   * Get the path from a step number
   */
  const getPathFromStep = (step: number): WizardStepPath => {
    switch (step) {
      case 0:
        return "/step1";
      case 1:
        return "/step2";
      case 2:
        return "/step3";
      case 3:
        return "/summary";
      default:
        return "/step1";
    }
  };

  /**
   * Save the current step to localStorage
   */
  const saveCurrentStep = (step: number) => {
    try {
      localStorage.setItem(STORAGE_KEY, step.toString());
    } catch (error) {
      console.warn("Failed to save current step to localStorage:", error);
    }
  };

  /**
   * Load the current step from localStorage
   */
  const loadCurrentStep = (): number => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const step = parseInt(saved, 10);
        // Validate step is within valid range (0-3)
        if (step >= 0 && step <= 3) {
          return step;
        }
      }
    } catch (error) {
      console.warn("Failed to load current step from localStorage:", error);
    }
    return 0; // Default to first step
  };

  /**
   * Navigate to a specific step
   */
  const navigateToStep = (step: number) => {
    if (step >= 0 && step <= 3) {
      const path = getPathFromStep(step);
      navigate(path);
    }
  };

  /**
   * Navigate to the next step
   */
  const navigateToNextStep = () => {
    const nextStep = Math.min(currentStep + 1, 3);
    navigateToStep(nextStep);
  };

  /**
   * Navigate to the previous step
   */
  const navigateToPreviousStep = () => {
    const prevStep = Math.max(currentStep - 1, 0);
    navigateToStep(prevStep);
  };

  /**
   * Reset wizard progress (clear localStorage and go to first step)
   */
  const resetWizard = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      navigateToStep(0);
    } catch (error) {
      console.warn("Failed to reset wizard progress:", error);
    }
  };

  // Effect to handle initial load and root path redirection
  useEffect(() => {
    const currentPath = location.pathname;
    const stepFromPath = getStepFromPath(currentPath);

    // If we're on the root path, redirect to the last visited step
    if (currentPath === "/") {
      const lastStep = loadCurrentStep();
      const targetPath = getPathFromStep(lastStep);
      navigate(targetPath, { replace: true });
      return;
    }

    // Update current step based on current path
    setCurrentStep(stepFromPath);

    // Save the current step to localStorage (but not for root path)
    if (currentPath !== "/") {
      saveCurrentStep(stepFromPath);
    }
  }, [location.pathname, navigate]);

  return {
    currentStep,
    navigateToStep,
    navigateToNextStep,
    navigateToPreviousStep,
    resetWizard,
    canGoNext: currentStep < 3,
    canGoPrevious: currentStep > 0,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === 3,
  };
};

export default useWizardStep;
