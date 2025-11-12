import type { FC } from "react";
import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/atoms/textarea";
import { useAI } from "@/lib/hooks";
import { useRTL } from "@/lib/hooks";
import clsx from "clsx";

/**
 * Props for AITextGenerator component
 */
interface AITextGeneratorProps {
  /** The default prompt to send to the AI service */
  prompt: string;
  /** Current text context (optional) to provide to AI */
  context?: string;
  /** Default value to pre-fill the generated text area */
  defaultValue?: string;
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
 * Enhanced component that provides AI text generation with:
 * 1. Customizable prompt editing
 * 2. Editable generated text in textarea
 * 3. Smart generate button states
 * 4. Mobile-responsive dialog
 */
const AITextGenerator: FC<AITextGeneratorProps> = ({
  prompt,
  context = "",
  defaultValue = "",
  onTextGenerated,
  buttonText,
  buttonClassName = "px-4 py-2 rounded bg-primary text-white text-sm",
  disabled = false,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [open, setOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(""); // Start with empty custom prompt
  const [editableResponse, setEditableResponse] = useState(defaultValue);
  const [hasGenerated, setHasGenerated] = useState(false);

  const { generateStreaming, response, isStreaming, error, cancel, reset } =
    useAI();

  /**
   * Handle opening dialog - immediately generate with default prompt
   */
  const handleOpenDialog = () => {
    setOpen(true);
    setCustomPrompt(""); // Keep custom prompt empty
    setEditableResponse(defaultValue);
    setHasGenerated(!!defaultValue); // Set hasGenerated to true if there's a defaultValue

    // Immediately generate text with default prompt if no defaultValue
    if (!defaultValue) {
      generateStreaming({
        prompt: prompt,
        context: context,
      });
    }
  };

  /**
   * Handle dialog close - cancel streaming and reset
   */
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      cancel();
      reset();
      setHasGenerated(false);
      setEditableResponse("");
    }
    setOpen(open);
  };

  /**
   * Handle user accepting the generated text
   */
  const handleAcceptText = () => {
    const finalText = editableResponse || "";
    if (finalText.trim()) {
      onTextGenerated(finalText);
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
   * Handle generating text with custom prompt (or default if custom is empty)
   */
  const handleGenerateText = () => {
    cancel();
    reset();
    setEditableResponse("");

    // Use custom prompt if provided, otherwise use default prompt
    const promptToUse = customPrompt.trim() || prompt;

    generateStreaming({
      prompt: promptToUse,
      context: context,
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Enter key: Send prompt if Enter alone, new line if Shift+Enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default textarea behavior
      if (customPrompt.trim() && !isStreaming) {
        handleGenerateText(); // Send the prompt
      }
    }
    // Shift+Enter allows new line (default textarea behavior)
  };

  const onChangePromptTextArea = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCustomPrompt(e.target.value);
    // Auto-resize on change as well
    const target = e.target as HTMLTextAreaElement;
    setTimeout(() => {
      target.style.height = "auto";
      const lineHeight = 24; // approximate line height
      const maxLines = 5;
      const minHeight = 80; // min-h-20 equivalent (3 lines)
      const maxHeight = lineHeight * maxLines + 20; // 5 lines + padding
      const newHeight = Math.min(
        Math.max(target.scrollHeight, minHeight),
        maxHeight
      );
      target.style.height = newHeight + "px";
    }, 0);
  };

  const onInputPromptTextArea = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    const lineHeight = 24; // approximate line height
    const maxLines = 5;
    const minHeight = 80; // min-h-20 equivalent (3 lines)
    const maxHeight = lineHeight * maxLines + 20; // 5 lines + padding
    const newHeight = Math.min(
      Math.max(target.scrollHeight, minHeight),
      maxHeight
    );
    target.style.height = newHeight + "px";
  };

  // Update editable response when AI response changes
  useEffect(() => {
    if (response) {
      setEditableResponse(response);
      if (!hasGenerated && response.length > 0) {
        setHasGenerated(true);
      }
    }
  }, [response, hasGenerated]);

  return (
    <>
      {/* AI Text Generation Button */}
      <Button
        type="button"
        className={buttonClassName}
        onClick={handleOpenDialog}
        disabled={disabled || isStreaming}
      >
        {buttonText || t("common.actions.helpMeWrite")}
      </Button>

      {/* AI Generation Dialog */}
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl w-[calc(100vw-1rem)] sm:w-full sm:mx-auto flex flex-col max-h-[85vh]">
          <DialogHeader className="shrink-0">
            <DialogTitle>{t("ai.dialog.title")}</DialogTitle>
            <DialogDescription>{t("ai.dialog.description")}</DialogDescription>
          </DialogHeader>

          {/* Generated Text Section */}
          <div className="space-y-4">
            {(editableResponse || isStreaming || error || defaultValue) && (
              <div>
                <label
                  htmlFor="generatedText"
                  className="text-sm font-medium leading-none mb-2 block"
                >
                  {t("ai.labels.editGeneratedText")}
                </label>

                {isStreaming && (
                  <div
                    className={`text-sm text-muted-foreground mb-2 flex items-center gap-2${clsx(
                      {
                        "flex-row-reverse": isRTL,
                        "flex-row": !isRTL,
                      }
                    )}`}
                  >
                    <div
                      className={`animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full ${clsx(
                        {
                          "flex-row-reverse ml-1": isRTL,
                          "flex-row mr-1": !isRTL,
                        }
                      )}`}
                    />
                    {t("ai.streaming")}
                  </div>
                )}

                <Textarea
                  id="generatedText"
                  value={editableResponse}
                  onChange={(e) => setEditableResponse(e.target.value)}
                  className={`min-h-40 max-h-60 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                  placeholder={isStreaming ? "" : t("ai.noContent")}
                  disabled={isStreaming}
                />

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
            )}
          </div>

          {/* Separator Line with Primary Color */}
          <div className="border-t border-primary/20 my-4 shrink-0"></div>

          {/* ChatGPT-style Input at Bottom */}
          <div className="shrink-0">
            <div className="relative">
              <Textarea
                id="customPrompt"
                value={customPrompt}
                onChange={onChangePromptTextArea}
                onKeyDown={onKeyDown}
                placeholder={t("ai.labels.customPromptPlaceholder")}
                className={`min-h-20 resize-none rounded-md border-2 border-primary focus:border-primary px-4 py-3 pr-12 ${
                  isRTL ? "text-right pl-12 pr-4" : "text-left"
                } transition-all duration-200`}
                dir={isRTL ? "rtl" : "ltr"}
                rows={3}
                style={{
                  height: "auto",
                  overflowY: "hidden",
                }}
                onInput={onInputPromptTextArea}
              />

              {/* Generate Button in Bottom Right */}
              <Button
                type="button"
                size="sm"
                onClick={handleGenerateText}
                disabled={isStreaming}
                className={`absolute bottom-2 h-8 w-8 rounded-full p-0 ${
                  isRTL ? "left-2" : "right-2"
                }`}
                variant={hasGenerated ? "outline" : "default"}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* Dialog Actions */}
          <DialogFooter className="gap-2 shrink-0 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="border-input"
            >
              {t("common.actions.cancel")}
            </Button>

            <Button
              type="button"
              onClick={handleAcceptText}
              disabled={
                !editableResponse ||
                editableResponse.trim().length === 0 ||
                isStreaming
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
