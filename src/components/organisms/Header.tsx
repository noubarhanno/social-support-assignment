import React from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../atoms/LanguageSwitcher";

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
  const { t } = useTranslation();
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0 flex items-center gap-3">
            <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold text-sm">
              NB
            </div>
            <span className="text-lg font-semibold text-gray-800">
              {t("common.socialSupport")}
            </span>
          </div>

          <div className="shrink-0">
            <LanguageSwitcher variant="inline" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
