import type { FC } from "react";
import { useRTL } from "../../lib/hooks/useRTL";

interface LanguageSwitcherProps {
  variant?: "fixed" | "inline";
}

/**
 * Language switcher component with flag icons and smooth hover effects.
 * Toggles between English (UK flag colors) and Arabic (UAE flag colors).
 * Automatically handles RTL layout changes.
 */
const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ variant = "fixed" }) => {
  const { currentLanguage, switchLanguage } = useRTL();

  const containerClass = variant === "fixed" ? "fixed top-4 right-4 z-50" : "";

  // UK Flag Icon Component (for English)
  const UKFlag = () => (
    <div className="w-6 h-4 rounded-sm overflow-hidden border border-gray-200">
      <svg viewBox="0 0 60 30" className="w-full h-full">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="white" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 L30,30 M0,15 L60,15" stroke="white" strokeWidth="10" />
        <path d="M30,0 L30,30 M0,15 L60,15" stroke="#C8102E" strokeWidth="6" />
      </svg>
    </div>
  );

  // UAE Flag Icon Component (for Arabic)
  const UAEFlag = () => (
    <div className="w-6 h-4 rounded-sm overflow-hidden border border-gray-200">
      <svg viewBox="0 0 60 30" className="w-full h-full">
        <rect x="0" y="0" width="20" height="30" fill="#CE1126" />
        <rect x="20" y="0" width="40" height="10" fill="#009639" />
        <rect x="20" y="10" width="40" height="10" fill="#FFFFFF" />
        <rect x="20" y="20" width="40" height="10" fill="#000000" />
      </svg>
    </div>
  );

  return (
    <div className={containerClass}>
      <button
        onClick={() => switchLanguage(currentLanguage === "en" ? "ar" : "en")}
        className="group flex items-center gap-2 px-3 py-2 rounded-lg
                   bg-white/80 backdrop-blur-sm border border-gray-200
                   hover:bg-primary/10 hover:border-primary/20
                   transition-all duration-300 ease-in-out"
        aria-label={`Switch to ${
          currentLanguage === "en" ? "Arabic" : "English"
        }`}
      >
        {/* Flag Icon */}
        <div className="transition-colors duration-300">
          {currentLanguage === "en" ? <UAEFlag /> : <UKFlag />}
        </div>

        {/* Language Text */}
        <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors duration-300">
          {currentLanguage === "en" ? "عربي" : "English"}
        </span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
