import React, { useState } from "react";
import { Check, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useWizardNavigation } from "../../lib/contexts";
import { useRTL } from "@/lib";

export type StepStatus = "inactive" | "active" | "completed";

export interface WizardStep {
  id: string;
  title: string;
  icon?: React.ReactNode;
  status: StepStatus;
  route?: string; // Route to navigate to when clicked
}

export interface WizardProgressProps {
  steps: WizardStep[];
  className?: string;
  disableNavigation?: boolean; // Disable step navigation (e.g., when application is completed)
}

/**
 * WizardProgress - A molecule component for displaying multi-step wizard progress.
 * Simple design matching screenshot: icons with titles below, connected by lines.
 * Completed steps are clickable and show edit icon on hover.
 *
 * @param steps - Array of wizard steps with status
 * @param className - Additional CSS classes
 */
const WizardProgress: React.FC<WizardProgressProps> = (props) => {
  const { steps, className, disableNavigation = false } = props;
  const navigate = useNavigate();
  const { setWizardStep } = useWizardNavigation();
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  // Use i18n directly for RTL detection
  const { isRTL } = useRTL();

  const handleStepClick = (step: WizardStep, stepIndex: number) => {
    // Only allow clicking on completed steps to go back and edit
    // But disable all navigation if step navigation is disabled (passed via props)
    if (step.status === "completed" && !props.disableNavigation) {
      setWizardStep(stepIndex as 0 | 1 | 2);
      if (step.route) {
        navigate(step.route);
      }
    }
  };

  const getStepIcon = (step: WizardStep, stepIndex: number) => {
    const { status, icon } = step;
    const isHovered = hoveredStep === step.id;
    const isClickable = status === "completed" && !disableNavigation;
    const isDisabled = status === "completed" && disableNavigation;

    switch (status) {
      case "completed":
        return (
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200",
              {
                // Normal completed state (clickable)
                "bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 hover:scale-105":
                  isClickable,
                "shadow-lg": isHovered && isClickable,
                // Disabled completed state (non-clickable) - lighter primary color
                "bg-primary/40 text-primary-foreground/70 cursor-not-allowed":
                  isDisabled,
              }
            )}
          >
            {isHovered && isClickable ? (
              <Edit3 className="w-5 h-5 transition-all duration-200" />
            ) : (
              <Check className="w-5 h-5 transition-all duration-200" />
            )}
          </div>
        );
      case "active":
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
            {icon || (
              <span className="text-sm font-semibold">{stepIndex + 1}</span>
            )}
          </div>
        );
      default: // inactive
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-500">
            {icon || (
              <span className="text-sm font-semibold">{stepIndex + 1}</span>
            )}
          </div>
        );
    }
  };

  const getConnectorLine = (stepIndex: number, currentStatus: StepStatus) => {
    if (stepIndex === steps.length - 1) return null;

    const isActive = currentStatus === "completed";

    return (
      <div
        className={cn("flex-1 h-0.5 mx-4 transition-colors duration-300", {
          "bg-primary": isActive,
          "bg-gray-300": !isActive,
        })}
      />
    );
  };

  return (
    <nav className={cn("w-full", className)} aria-label="Wizard Progress">
      <div
        className={cn(
          "flex items-center justify-between",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}
      >
        {steps.map((step, stepIndex) => {
          const isClickable = step.status === "completed" && !disableNavigation;

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div
                className={cn(
                  "flex flex-col items-center transition-opacity duration-200",
                  {
                    "cursor-pointer": isClickable,
                    "cursor-not-allowed opacity-70":
                      disableNavigation && step.status === "completed",
                  }
                )}
                onMouseEnter={() => isClickable && setHoveredStep(step.id)}
                onMouseLeave={() => isClickable && setHoveredStep(null)}
                onClick={() => handleStepClick(step, stepIndex)}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                aria-label={isClickable ? `Go to ${step.title}` : undefined}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    handleStepClick(step, stepIndex);
                  }
                }}
              >
                {/* Icon */}
                {getStepIcon(step, stepIndex)}

                {/* Title */}
                <div
                  className={cn(
                    "mt-2 text-sm font-medium text-center transition-colors duration-200",
                    {
                      "text-primary":
                        (step.status === "active" ||
                          step.status === "completed") &&
                        !disableNavigation,
                      "text-gray-500": step.status === "inactive",
                      "text-primary/50":
                        disableNavigation && step.status === "completed",
                      "hover:text-primary/80": isClickable,
                    }
                  )}
                >
                  {step.title}
                </div>
              </div>

              {/* Connector Line */}
              {getConnectorLine(stepIndex, step.status)}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default WizardProgress;
