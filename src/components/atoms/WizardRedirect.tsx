import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWizardNavigation } from "../../lib/contexts";
import { useWizardFlowGuard } from "../../lib/hooks";
import Loading from "./Loading";

/**
 * Component that handles redirection from root path to the last visited step.
 * Uses ConfigContext to get the saved wizard step and redirects accordingly.
 */
const WizardRedirect = () => {
  const navigate = useNavigate();
  const { wizardStep } = useWizardNavigation();
  const { getNextAllowedStep } = useWizardFlowGuard();

  useEffect(() => {
    // Use flow guard to determine the next allowed step instead of just wizard step
    const nextAllowed = getNextAllowedStep();
    const targetPath = `/step${nextAllowed}`;

    console.log(
      `WizardRedirect: redirecting to ${targetPath} (wizard step: ${wizardStep}, next allowed: ${nextAllowed})`
    );
    navigate(targetPath, { replace: true });
  }, [navigate, wizardStep, getNextAllowedStep]);

  // Show loading while redirecting
  return <Loading />;
};

export default WizardRedirect;
