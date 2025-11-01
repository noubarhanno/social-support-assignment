import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import Loading from "../components/atoms/Loading";
import LanguageSwitcher from "../components/atoms/LanguageSwitcher";
import { useRTL } from "../lib/hooks/useRTL";

// Lazy load pages for better performance
const Step1 = lazy(() => import("../pages/Step1"));
const Step2 = lazy(() => import("../pages/Step2"));
const Step3 = lazy(() => import("../pages/Step3"));
const Summary = lazy(() => import("../pages/Summary"));

/**
 * App Router component that handles all route definitions.
 * Implements lazy loading for all pages with loading fallbacks.
 */
const AppRouter = () => {
  // Initialize RTL support
  useRTL();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageSwitcher />
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Redirect root to step 1 */}
            <Route path="/" element={<Navigate to="/step1" replace />} />

            {/* Wizard steps with persistent state */}
            <Route path="/step1" element={<Step1 />} />
            <Route path="/step2" element={<Step2 />} />
            <Route path="/step3" element={<Step3 />} />

            {/* Summary page */}
            <Route path="/summary" element={<Summary />} />

            {/* Catch-all route - redirect to step 1 */}
            <Route path="*" element={<Navigate to="/step1" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default AppRouter;
