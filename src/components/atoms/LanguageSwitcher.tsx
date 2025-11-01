import type { FC } from "react";
import { useRTL } from "../../lib/hooks/useRTL";

/**
 * Language switcher component for toggling between English and Arabic.
 * Automatically handles RTL layout changes.
 */
const LanguageSwitcher: FC = () => {
  const { currentLanguage, switchLanguage } = useRTL();

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => switchLanguage(currentLanguage === "en" ? "ar" : "en")}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        aria-label={`Switch to ${
          currentLanguage === "en" ? "Arabic" : "English"
        }`}
      >
        {currentLanguage === "en" ? "عربي" : "English"}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
