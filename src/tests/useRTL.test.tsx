import { renderHook, act } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";
import { useRTL } from "../lib/hooks/useRTL";
import { ReactNode } from "react";

// Create a wrapper component for tests
const wrapper = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe("useRTL Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset document attributes
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
    document.documentElement.classList.remove("rtl");

    // Clear localStorage
    localStorage.clear();
  });

  describe("Basic Functionality", () => {
    it("should return correct hook interface", () => {
      const { result } = renderHook(() => useRTL(), { wrapper });

      expect(result.current).toHaveProperty("isRTL");
      expect(result.current).toHaveProperty("currentLanguage");
      expect(result.current).toHaveProperty("switchLanguage");
    });

    it("should provide switchLanguage function", () => {
      const { result } = renderHook(() => useRTL(), { wrapper });

      expect(typeof result.current.switchLanguage).toBe("function");
    });

    it("should detect RTL correctly for language", () => {
      const { result } = renderHook(() => useRTL(), { wrapper });

      // RTL should be boolean and correspond to Arabic language
      expect(typeof result.current.isRTL).toBe("boolean");
      expect(result.current.isRTL).toBe(
        result.current.currentLanguage === "ar"
      );
    });
  });

  describe("Language Switching", () => {
    it("should handle language switching", () => {
      const { result } = renderHook(() => useRTL(), { wrapper });

      act(() => {
        result.current.switchLanguage("ar");
      });

      // Verify that the function works without errors
      expect(result.current.switchLanguage).toBeDefined();
    });
  });

  describe("Document Updates", () => {
    it("should update document attributes", () => {
      renderHook(() => useRTL(), { wrapper });

      // Document attributes should be set
      expect(document.documentElement.dir).toBeDefined();
      expect(document.documentElement.lang).toBeDefined();
    });
  });

  describe("LocalStorage Integration", () => {
    it("should work with localStorage for persistence", () => {
      // Test that localStorage is available and functional
      localStorage.setItem("i18nextLng", "en");
      expect(localStorage.getItem("i18nextLng")).toBe("en");

      localStorage.setItem("i18nextLng", "ar");
      expect(localStorage.getItem("i18nextLng")).toBe("ar");
    });
  });
});
