import { renderHook, act } from "@testing-library/react";
import React from "react";
import ConfigContextProvider, {
  useConfigContext,
  useWizardNavigation,
  WizardStep,
} from "../lib/contexts/ConfigContext";

// Wrapper component for testing
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ConfigContextProvider>{children}</ConfigContextProvider>
);

describe("ConfigContext", () => {
  describe("useConfigContext", () => {
    it("should provide initial state correctly", () => {
      const { result } = renderHook(() => useConfigContext(), { wrapper });

      expect(result.current.state.wizardStep).toBe(0);
    });

    it("should update wizard step when SET_WIZARD_STEP action is dispatched", () => {
      const { result } = renderHook(() => useConfigContext(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: "SET_WIZARD_STEP",
          payload: { wizardStep: 2 as WizardStep },
        });
      });

      expect(result.current.state.wizardStep).toBe(2);
    });

    it("should reset wizard step when RESET_WIZARD action is dispatched", () => {
      const { result } = renderHook(() => useConfigContext(), { wrapper });

      // First set to step 2
      act(() => {
        result.current.dispatch({
          type: "SET_WIZARD_STEP",
          payload: { wizardStep: 2 as WizardStep },
        });
      });

      expect(result.current.state.wizardStep).toBe(2);

      // Then reset
      act(() => {
        result.current.dispatch({
          type: "RESET_WIZARD",
          payload: {},
        });
      });

      expect(result.current.state.wizardStep).toBe(0);
    });
  });

  describe("useWizardNavigation hook", () => {
    it("should provide wizard navigation functions", () => {
      const { result } = renderHook(() => useWizardNavigation(), { wrapper });

      expect(result.current.wizardStep).toBe(0);
      expect(typeof result.current.setWizardStep).toBe("function");
      expect(typeof result.current.nextStep).toBe("function");
      expect(typeof result.current.previousStep).toBe("function");
      expect(typeof result.current.resetWizard).toBe("function");
    });

    it("should navigate to next step correctly", () => {
      const { result } = renderHook(() => useWizardNavigation(), { wrapper });

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.wizardStep).toBe(1);

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.wizardStep).toBe(2);

      // Should not go beyond step 2
      act(() => {
        result.current.nextStep();
      });

      expect(result.current.wizardStep).toBe(2);
    });

    it("should navigate to previous step correctly", () => {
      const { result } = renderHook(() => useWizardNavigation(), { wrapper });

      // Start from step 2
      act(() => {
        result.current.setWizardStep(2);
      });

      expect(result.current.wizardStep).toBe(2);

      act(() => {
        result.current.previousStep();
      });

      expect(result.current.wizardStep).toBe(1);

      act(() => {
        result.current.previousStep();
      });

      expect(result.current.wizardStep).toBe(0);

      // Should not go below step 0
      act(() => {
        result.current.previousStep();
      });

      expect(result.current.wizardStep).toBe(0);
    });

    it("should reset wizard correctly", () => {
      const { result } = renderHook(() => useWizardNavigation(), { wrapper });

      // Set to step 2
      act(() => {
        result.current.setWizardStep(2);
      });

      expect(result.current.wizardStep).toBe(2);

      // Reset
      act(() => {
        result.current.resetWizard();
      });

      expect(result.current.wizardStep).toBe(0);
    });
  });
});
