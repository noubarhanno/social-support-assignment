import React from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../atoms/LanguageSwitcher";
import { cn } from "../../lib/utils";

/**
 * Header organism component for the application.
 *
 * Features:
 * - Logo/brand text on the left side
 * - Language switcher on the right side
 * - RTL support (elements switch positions in Arabic)
 * - UAE Government branding colors
 * - Responsive design with proper spacing
 *
 * @returns {JSX.Element} The header component
 */
const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center h-16 justify-between",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
        >
          {/* Logo Section */}
          <div className="shrink-0 flex items-center gap-3">
            <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold text-sm">
              NJ
            </div>
            <span className="text-lg font-semibold text-gray-800 sm:block hidden">
              {t("common.socialSupport")}
            </span>
          </div>

          {/* Language Switcher */}
          <div className="shrink-0">
            <LanguageSwitcher variant="inline" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
