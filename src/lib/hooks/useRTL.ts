import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Custom hook for managing RTL layout and language switching.
 * Automatically updates document direction and lang attributes.
 * Persists language selection to localStorage.
 */
export const useRTL = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isRTL = i18n.language === "ar";

    // Update document direction
    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    // Update document language
    document.documentElement.lang = i18n.language;

    // Add/remove RTL class for additional styling if needed
    if (isRTL) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [i18n.language]);

  const switchLanguage = (language: "en" | "ar") => {
    // Change language and automatically persist to localStorage via i18next
    i18n.changeLanguage(language);
  };

  return {
    isRTL: i18n.language === "ar",
    currentLanguage: i18n.language,
    switchLanguage,
  };
};
