import { render, screen } from "@testing-library/react";
import WizardProgress, {
  WizardStep,
} from "../components/molecules/WizardProgress";

describe("WizardProgress", () => {
  const mockSteps: WizardStep[] = [
    {
      id: "step1",
      title: "Personal Information",
      status: "completed",
    },
    {
      id: "step2",
      title: "Family & Financial Info",
      status: "active",
    },
    {
      id: "step3",
      title: "Situation Descriptions",
      status: "inactive",
    },
  ];

  describe("Basic Rendering", () => {
    it("should render all steps with correct titles", () => {
      render(<WizardProgress steps={mockSteps} />);

      expect(screen.getByText("Personal Information")).toBeInTheDocument();
      expect(screen.getByText("Family & Financial Info")).toBeInTheDocument();
      expect(screen.getByText("Situation Descriptions")).toBeInTheDocument();
    });

    it("should render with correct ARIA label", () => {
      render(<WizardProgress steps={mockSteps} />);

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("aria-label", "Wizard Progress");
    });
  });

  describe("Step Status Rendering", () => {
    it("should render completed step with check icon", () => {
      const completedSteps: WizardStep[] = [
        {
          id: "step1",
          title: "Completed Step",
          status: "completed",
        },
      ];

      render(<WizardProgress steps={completedSteps} />);

      const stepContainer = screen.getByText("Completed Step").parentElement;
      const iconContainer = stepContainer?.querySelector("div");

      expect(iconContainer).toHaveClass(
        "bg-primary",
        "text-primary-foreground"
      );

      // Check for Check icon (lucide-react renders as SVG)
      const checkIcon = stepContainer?.querySelector("svg");
      expect(checkIcon).toBeInTheDocument();
    });

    it("should render active step with step number", () => {
      const activeSteps: WizardStep[] = [
        {
          id: "step1",
          title: "Active Step",
          status: "active",
        },
      ];

      render(<WizardProgress steps={activeSteps} />);

      const stepContainer = screen.getByText("Active Step").parentElement;
      const iconContainer = stepContainer?.querySelector("div");

      expect(iconContainer).toHaveClass(
        "bg-primary",
        "text-primary-foreground"
      );
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should render inactive step with gray styling", () => {
      const inactiveSteps: WizardStep[] = [
        {
          id: "step1",
          title: "Inactive Step",
          status: "inactive",
        },
      ];

      render(<WizardProgress steps={inactiveSteps} />);

      const stepContainer = screen.getByText("Inactive Step").parentElement;
      const iconContainer = stepContainer?.querySelector("div");

      expect(iconContainer).toHaveClass("bg-gray-300", "text-gray-500");
    });
  });

  describe("Text Styling", () => {
    it("should apply primary color to active/completed step titles", () => {
      render(<WizardProgress steps={mockSteps} />);

      const completedTitle = screen.getByText("Personal Information");
      const activeTitle = screen.getByText("Family & Financial Info");

      expect(completedTitle).toHaveClass("text-primary");
      expect(activeTitle).toHaveClass("text-primary");
    });

    it("should apply gray color to inactive step title", () => {
      render(<WizardProgress steps={mockSteps} />);

      const inactiveTitle = screen.getByText("Situation Descriptions");
      expect(inactiveTitle).toHaveClass("text-gray-500");
    });
  });

  describe("Connector Lines", () => {
    it("should render connector lines between multiple steps", () => {
      const { container } = render(<WizardProgress steps={mockSteps} />);

      // Should have 2 connector lines for 3 steps
      const connectorLines = container.querySelectorAll(".h-0\\.5");
      expect(connectorLines).toHaveLength(2);
    });

    it("should style connector line based on step status", () => {
      const stepsWithCompleted: WizardStep[] = [
        {
          id: "step1",
          title: "Step 1",
          status: "completed",
        },
        {
          id: "step2",
          title: "Step 2",
          status: "active",
        },
      ];

      const { container } = render(
        <WizardProgress steps={stepsWithCompleted} />
      );

      const connectorLine = container.querySelector(".h-0\\.5");
      expect(connectorLine).toHaveClass("bg-primary");
    });
  });

  describe("Mixed Status Scenarios", () => {
    it("should handle mixed step statuses correctly", () => {
      render(<WizardProgress steps={mockSteps} />);

      // Check that step numbers are displayed for active/inactive steps
      expect(screen.getByText("2")).toBeInTheDocument(); // Active step
      expect(screen.getByText("3")).toBeInTheDocument(); // Inactive step

      // Check that completed step has proper styling
      const completedTitle = screen.getByText("Personal Information");
      expect(completedTitle).toHaveClass("text-primary");
    });
  });
});
