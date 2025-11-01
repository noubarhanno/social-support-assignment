import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

/**
 * Component that handles redirection from root path to the last visited step.
 * This component loads the saved step from localStorage and redirects accordingly.
 */
const WizardRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getLastVisitedStep = (): string => {
      try {
        const saved = localStorage.getItem("wizard-current-step");
        if (saved !== null) {
          const step = parseInt(saved, 10);
          // Validate step is within valid range (0-3)
          if (step >= 0 && step <= 3) {
            switch (step) {
              case 0:
                return "/step1";
              case 1:
                return "/step2";
              case 2:
                return "/step3";
              case 3:
                return "/summary";
              default:
                return "/step1";
            }
          }
        }
      } catch (error) {
        console.warn("Failed to load current step from localStorage:", error);
      }
      return "/step1"; // Default to first step
    };

    const targetPath = getLastVisitedStep();
    navigate(targetPath, { replace: true });
  }, [navigate]);

  // Show loading while redirecting
  return <Loading />;
};

export default WizardRedirect;
