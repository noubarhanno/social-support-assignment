import React, { useState } from "react";
import { Check, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useWizardNavigation } from "../../lib/contexts";

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
}

/**
 * WizardProgress - A molecule component for displaying multi-step wizard progress.
 * Simple design matching screenshot: icons with titles below, connected by lines.
 * Completed steps are clickable and show edit icon on hover.
 *
 * @param steps - Array of wizard steps with status
 * @param className - Additional CSS classes
 */
const WizardProgress: React.FC<WizardProgressProps> = ({
  steps,
  className,
}) => {
  const navigate = useNavigate();
  const { setWizardStep } = useWizardNavigation();
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const handleStepClick = (step: WizardStep, stepIndex: number) => {
    // Only allow clicking on completed steps
    if (step.status === "completed") {
      setWizardStep(stepIndex as 0 | 1 | 2);
      if (step.route) {
        navigate(step.route);
      }
    }
  };

  const getStepIcon = (step: WizardStep, stepIndex: number) => {
    const { status, icon } = step;
    const isHovered = hoveredStep === step.id;
    const isClickable = status === "completed";

    switch (status) {
      case "completed":
        return (
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground transition-all duration-200",
              {
                "cursor-pointer hover:bg-primary/90 hover:scale-105":
                  isClickable,
                "shadow-lg": isHovered,
              }
            )}
          >
            {isHovered ? (
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
      <div className="flex items-center justify-between">
        {steps.map((step, stepIndex) => {
          const isClickable = step.status === "completed";

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div
                className={cn("flex flex-col items-center", {
                  "cursor-pointer": isClickable,
                })}
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
                        step.status === "active" || step.status === "completed",
                      "text-gray-500": step.status === "inactive",
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
