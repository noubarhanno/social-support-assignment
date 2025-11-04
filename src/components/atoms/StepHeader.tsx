import type { FC } from "react";

interface StepHeaderProps {
  /** The main title of the step */
  title: string;
  /** The description text below the title */
  description: string;
  /** Optional custom CSS classes for the container */
  className?: string;
  /** Optional custom CSS classes for the title */
  titleClassName?: string;
  /** Optional custom CSS classes for the description */
  descriptionClassName?: string;
}

/**
 * StepHeader - A reusable atom component for displaying step titles and descriptions
 * Used across wizard steps for consistent styling and layout
 */
const StepHeader: FC<StepHeaderProps> = ({
  title,
  description,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
}) => {
  return (
    <div className={`text-center ${className}`}>
      <h1 className={`text-3xl font-bold text-gray-900 mb-4 ${titleClassName}`}>
        {title}
      </h1>
      <p
        className={`text-lg text-gray-600 max-w-2xl mx-auto ${descriptionClassName}`}
      >
        {description}
      </p>
    </div>
  );
};

export default StepHeader;
