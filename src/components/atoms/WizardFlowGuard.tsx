import { useEffect } from "react";
import { useWizardFlowGuard } from "../../lib/hooks";

/**
 * Component that enforces wizard flow restrictions
 * Redirects users to appropriate step based on completion state
 */
const WizardFlowGuard = () => {
  const { redirectToAppropriateStep } = useWizardFlowGuard();

  useEffect(() => {
    redirectToAppropriateStep();
  }, [redirectToAppropriateStep]);

  return null; // This component doesn't render anything
};

export default WizardFlowGuard;
