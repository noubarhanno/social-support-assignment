/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useWizardFlowGuard } from "../lib/hooks/useWizardFlowGuard";
import { STORAGE_KEYS } from "../lib/utils/constants";

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockLocation = { pathname: "/step1" };

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
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

describe("useWizardFlowGuard Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe("Step completion tracking", () => {
    it("should mark steps as completed and track completion time", () => {
      const { result } = renderHook(() => useWizardFlowGuard());

      act(() => {
        result.current.markStepCompleted(1);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.WIZARD_DATA,
        expect.stringContaining('"isCompleted":true')
      );
    });

    it("should return correct completion state", () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          personalInfo: { isCompleted: true, completedAt: "2024-01-01" },
        })
      );

      const { result } = renderHook(() => useWizardFlowGuard());

      const completion = result.current.getStepCompletion(1);
      expect(completion.isCompleted).toBe(true);
      expect(completion.completedAt).toBe("2024-01-01");
    });

    it("should return false for incomplete steps", () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({}));

      const { result } = renderHook(() => useWizardFlowGuard());

      const completion = result.current.getStepCompletion(1);
      expect(completion.isCompleted).toBe(false);
    });
  });

  describe("Flow navigation logic", () => {
    it("should allow access to step1 always", () => {
      const { result } = renderHook(() => useWizardFlowGuard());

      expect(result.current.canAccessRoute("/step1")).toBe(true);
    });

    it("should not allow access to step2 if step1 is not completed", () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({}));

      const { result } = renderHook(() => useWizardFlowGuard());

      expect(result.current.canAccessRoute("/step2")).toBe(false);
    });

    it("should allow access to step2 if step1 is completed", () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          personalInfo: { isCompleted: true },
        })
      );

      const { result } = renderHook(() => useWizardFlowGuard());

      expect(result.current.canAccessRoute("/step2")).toBe(true);
    });

    it("should not allow access to summary if not all steps completed", () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          personalInfo: { isCompleted: true },
          professionalInfo: { isCompleted: false },
        })
      );

      const { result } = renderHook(() => useWizardFlowGuard());

      expect(result.current.canAccessRoute("/summary")).toBe(false);
    });

    it("should allow access to summary if all steps completed", () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          personalInfo: { isCompleted: true },
          professionalInfo: { isCompleted: true },
          additionalInfo: { isCompleted: true },
        })
      );

      const { result } = renderHook(() => useWizardFlowGuard());

      expect(result.current.canAccessRoute("/summary")).toBe(true);
    });
  });

  describe("Application number generation", () => {
    it("should allow application number generation only when on summary with all steps complete", () => {
      mockLocation.pathname = "/summary";
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          personalInfo: { isCompleted: true },
          professionalInfo: { isCompleted: true },
          additionalInfo: { isCompleted: true },
        })
      );

      const { result } = renderHook(() => useWizardFlowGuard());

      expect(result.current.shouldGenerateApplicationNumber()).toBe(true);
    });

    it("should not allow application number generation when not on summary", () => {
      mockLocation.pathname = "/step1";
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          personalInfo: { isCompleted: true },
          professionalInfo: { isCompleted: true },
          additionalInfo: { isCompleted: true },
        })
      );

      const { result } = renderHook(() => useWizardFlowGuard());

      expect(result.current.shouldGenerateApplicationNumber()).toBe(false);
    });
  });

  describe("Reset functionality", () => {
    it("should reset all completion states", () => {
      // Setup existing data
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          personalInfo: { name: "John", isCompleted: true },
          professionalInfo: { company: "Acme", isCompleted: true },
          additionalInfo: { notes: "Test", isCompleted: true },
        })
      );

      const { result } = renderHook(() => useWizardFlowGuard());

      act(() => {
        result.current.resetAllCompletions();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.WIZARD_DATA,
        expect.stringContaining('"isCompleted":false')
      );
    });
  });
});
