import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "inactive" | "active" | "completed";

export interface WizardStep {
  id: string;
  title: string;
  icon?: React.ReactNode;
  status: StepStatus;
}

export interface WizardProgressProps {
  steps: WizardStep[];
  className?: string;
}

/**
 * WizardProgress - A molecule component for displaying multi-step wizard progress.
 * Simple design matching screenshot: icons with titles below, connected by lines.
 *
 * @param steps - Array of wizard steps with status
 * @param className - Additional CSS classes
 */
const WizardProgress: React.FC<WizardProgressProps> = ({
  steps,
  className,
}) => {
  const getStepIcon = (step: WizardStep, stepIndex: number) => {
    const { status, icon } = step;

    switch (status) {
      case "completed":
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
            <Check className="w-5 h-5" />
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
        {steps.map((step, stepIndex) => (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div className="flex flex-col items-center">
              {/* Icon */}
              {getStepIcon(step, stepIndex)}

              {/* Title */}
              <div
                className={cn(
                  "mt-2 text-sm font-medium text-center transition-colors duration-300",
                  {
                    "text-primary":
                      step.status === "active" || step.status === "completed",
                    "text-gray-500": step.status === "inactive",
                  }
                )}
              >
                {step.title}
              </div>
            </div>

            {/* Connector Line */}
            {getConnectorLine(stepIndex, step.status)}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default WizardProgress;
