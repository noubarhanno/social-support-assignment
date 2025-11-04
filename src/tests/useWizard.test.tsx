/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useWizard } from "../lib/hooks/useWizard";

// Mock the WizardFlow generator
jest.mock("../lib/generators/WizardFlow", () => ({
  wizardFlowGenerator: jest.fn(() => ({
    next: jest.fn(),
    return: jest.fn(),
    throw: jest.fn(),
  })),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useWizard Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe("Basic functionality", () => {
    it("should provide all required wizard functions", () => {
      const { result } = renderHook(() => useWizard());

      expect(result.current.getWizardGenerator).toBeDefined();
      expect(result.current.resetWizardGenerator).toBeDefined();
      expect(result.current.resetWizard).toBeDefined();
      expect(result.current.getStepData).toBeDefined();
      expect(result.current.getWizardProgress).toBeDefined();
    });

    it("should return functions that are stable across re-renders", () => {
      const { result, rerender } = renderHook(() => useWizard());
      
      const initialFunctions = {
        getWizardGenerator: result.current.getWizardGenerator,
        resetWizardGenerator: result.current.resetWizardGenerator,
        resetWizard: result.current.resetWizard,
        getStepData: result.current.getStepData,
        getWizardProgress: result.current.getWizardProgress,
      };

      rerender();

      expect(result.current.getWizardGenerator).toBe(initialFunctions.getWizardGenerator);
      expect(result.current.resetWizardGenerator).toBe(initialFunctions.resetWizardGenerator);
      expect(result.current.resetWizard).toBe(initialFunctions.resetWizard);
      expect(result.current.getStepData).toBe(initialFunctions.getStepData);
      expect(result.current.getWizardProgress).toBe(initialFunctions.getWizardProgress);
    });
  });

  describe("Generator management", () => {
    it("should create and return the same generator instance on multiple calls", () => {
      const { result } = renderHook(() => useWizard());

      const generator1 = result.current.getWizardGenerator();
      const generator2 = result.current.getWizardGenerator();

      expect(generator1).toBe(generator2);
      expect(generator1).toBeDefined();
      expect(typeof generator1.next).toBe("function");
    });

    it("should create a new generator when resetWizardGenerator is called", () => {
      const { result } = renderHook(() => useWizard());

      const generator1 = result.current.getWizardGenerator();
      
      act(() => {
        result.current.resetWizardGenerator();
      });
      
      const generator2 = result.current.getWizardGenerator();

      expect(generator1).not.toBe(generator2);
      expect(generator2).toBeDefined();
    });
  });

  describe("Step data management", () => {
    it("should return empty object when no data is saved", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useWizard());

      expect(result.current.getStepData(1)).toEqual({});
      expect(result.current.getStepData(2)).toEqual({});
      expect(result.current.getStepData(3)).toEqual({});
    });

    it("should return saved data for specific steps", () => {
      const savedData = {
        personalInfo: { name: "John Doe", email: "john@example.com" },
        professionalInfo: { company: "Acme Corp", position: "Developer" },
        additionalInfo: { notes: "Test notes", priority: "high" },
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));

      const { result } = renderHook(() => useWizard());

      expect(result.current.getStepData(1)).toEqual({ 
        name: "John Doe", 
        email: "john@example.com" 
      });
      expect(result.current.getStepData(2)).toEqual({ 
        company: "Acme Corp", 
        position: "Developer" 
      });
      expect(result.current.getStepData(3)).toEqual({ 
        notes: "Test notes", 
        priority: "high" 
      });
    });

    it("should handle invalid JSON gracefully", () => {
      localStorageMock.getItem.mockReturnValue("invalid-json");

      const { result } = renderHook(() => useWizard());

      expect(result.current.getStepData(1)).toEqual({});
      expect(result.current.getStepData(2)).toEqual({});
      expect(result.current.getStepData(3)).toEqual({});
    });

    it("should handle missing step data gracefully", () => {
      const savedData = {
        personalInfo: { name: "John Doe" },
        // Missing professionalInfo and additionalInfo
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));

      const { result } = renderHook(() => useWizard());

      expect(result.current.getStepData(1)).toEqual({ name: "John Doe" });
      expect(result.current.getStepData(2)).toEqual({});
      expect(result.current.getStepData(3)).toEqual({});
    });
  });

  describe("Wizard progress management", () => {
    it("should return current progress from localStorage", () => {
      localStorageMock.getItem.mockReturnValue("2");

      const { result } = renderHook(() => useWizard());

      expect(result.current.getWizardProgress()).toBe(2);
    });

    it("should return 0 when no progress is saved", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useWizard());

      expect(result.current.getWizardProgress()).toBe(0);
    });

    it("should handle invalid progress value gracefully", () => {
      localStorageMock.getItem.mockReturnValue("invalid-number");

      const { result } = renderHook(() => useWizard());

      expect(result.current.getWizardProgress()).toBe(0);
    });
  });

  describe("Wizard reset functionality", () => {
    it("should reset wizard data and progress", () => {
      const { result } = renderHook(() => useWizard());

      act(() => {
        result.current.resetWizard();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "wizard-form-data",
        "{}"
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "wizard-progress",
        "0"
      );
    });

    it("should create a new generator after reset", () => {
      const { result } = renderHook(() => useWizard());

      const generator1 = result.current.getWizardGenerator();
      
      act(() => {
        result.current.resetWizard();
      });
      
      const generator2 = result.current.getWizardGenerator();

      expect(generator1).not.toBe(generator2);
    });
  });

  describe("Error handling", () => {
    it("should handle localStorage errors gracefully in getStepData", () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      const { result } = renderHook(() => useWizard());

      expect(() => result.current.getStepData(1)).not.toThrow();
      expect(result.current.getStepData(1)).toEqual({});
    });

    it("should handle localStorage errors gracefully in getWizardProgress", () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      const { result } = renderHook(() => useWizard());

      expect(() => result.current.getWizardProgress()).not.toThrow();
      expect(result.current.getWizardProgress()).toBe(0);
    });

    it("should handle localStorage errors gracefully in resetWizard", () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      const { result } = renderHook(() => useWizard());

      expect(() => {
        act(() => {
          result.current.resetWizard();
        });
      }).not.toThrow();
    });
  });
});
