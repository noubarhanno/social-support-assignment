import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWizardNavigation } from "../../lib/contexts";
import Loading from "./Loading";

/**
 * Component that handles redirection from root path to the last visited step.
 * Uses ConfigContext to get the saved wizard step and redirects accordingly.
 */
const WizardRedirect = () => {
  const navigate = useNavigate();
  const { wizardStep } = useWizardNavigation();

  useEffect(() => {
    const getStepPath = (step: number): string => {
      switch (step) {
        case 0:
          return "/step1";
        case 1:
          return "/step2";
        case 2:
          return "/step3";
        default:
          return "/step1";
      }
    };

    const targetPath = getStepPath(wizardStep);
    navigate(targetPath, { replace: true });
  }, [navigate, wizardStep]);

  // Show loading while redirecting
  return <Loading />;
};

export default WizardRedirect;
