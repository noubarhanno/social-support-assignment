import type { FC } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { useAI } from "@/lib/hooks";
import { useRTL } from "@/lib/hooks";

/**
 * Props for AITextGenerator component
 */
interface AITextGeneratorProps {
  /** The prompt to send to the AI service */
  prompt: string;
  /** Current text context (optional) to provide to AI */
  context?: string;
  /** Callback when AI generates text and user accepts it */
  onTextGenerated: (generatedText: string) => void;
  /** Button text (optional) */
  buttonText?: string;
  /** Button className (optional) */
  buttonClassName?: string;
  /** Whether the button should be disabled */
  disabled?: boolean;
}

/**
 * AITextGenerator Organism Component
 *
 * A reusable component that provides an "AI text generation" button which:
 * 1. Opens a dialog when clicked
 * 2. Calls OpenAI API with the provided prompt
 * 3. Streams the AI response in real-time
 * 4. Allows user to accept or cancel the generated text
 * 5. Calls onTextGenerated callback with the accepted text
 */
const AITextGenerator: FC<AITextGeneratorProps> = ({
  prompt,
  context = "",
  onTextGenerated,
  buttonText,
  buttonClassName = "px-4 py-2 rounded bg-primary text-white text-sm",
  disabled = false,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [open, setOpen] = useState(false);

  const { generateStreaming, response, isStreaming, error, cancel, reset } =
    useAI();

  /**
   * Handle opening dialog and starting AI generation
   */
  const handleGenerateText = () => {
    setOpen(true);
    generateStreaming({
      prompt: prompt,
      context: context,
    });
  };

  /**
   * Handle dialog close - cancel streaming and reset
   */
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      cancel();
      reset();
    }
    setOpen(open);
  };

  /**
   * Handle user accepting the generated text
   */
  const handleAcceptText = () => {
    const generatedText = response || "";
    if (generatedText.trim()) {
      onTextGenerated(generatedText);
    }
    cancel();
    reset();
    setOpen(false);
  };

  /**
   * Handle user canceling the generation
   */
  const handleCancel = () => {
    cancel();
    reset();
    setOpen(false);
  };

  /**
   * Handle generating a new response - clear current and restart
   */
  const handleGenerateNew = () => {
    cancel();
    reset();
    // Start a new generation with the same prompt and context
    generateStreaming({
      prompt: prompt,
      context: context,
    });
  };

  return (
    <>
      {/* AI Text Generation Button */}
      <Button
        type="button"
        className={buttonClassName}
        onClick={handleGenerateText}
        disabled={disabled || isStreaming}
      >
        {buttonText || t("common.actions.helpMeWrite")}
      </Button>

      {/* AI Generation Dialog */}
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("ai.dialog.title")}</DialogTitle>
            <DialogDescription>{t("ai.dialog.description")}</DialogDescription>
          </DialogHeader>

          {/* AI Response Content */}
          <div
            className={`min-h-40 max-h-[50vh] overflow-auto whitespace-pre-wrap p-4 border border-border rounded bg-muted/50 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {isStreaming && (
              <div
                className={`text-sm text-muted-foreground mb-2 flex items-center gap-2 ${
                  isRTL ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                {t("ai.streaming")}
              </div>
            )}

            <div className="text-sm leading-relaxed">
              {response || (!isStreaming && t("ai.noContent"))}
            </div>

            {error && (
              <div
                className={`text-sm text-destructive mt-2 p-2 bg-destructive/10 rounded ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <strong>{t("ai.error")}:</strong> {String(error)}
              </div>
            )}
          </div>

          {/* Dialog Actions */}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="border-input"
            >
              {t("common.actions.cancel")}
            </Button>

            {/* Generate New Button - only show if there's a response or error */}
            {(response || error) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateNew}
                disabled={isStreaming}
              >
                {t("ai.actions.generateNew")}
              </Button>
            )}

            <Button
              type="button"
              onClick={handleAcceptText}
              disabled={
                !response || response.trim().length === 0 || isStreaming
              }
            >
              {t("ai.actions.accept")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AITextGenerator;
