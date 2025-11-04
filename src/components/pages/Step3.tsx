import type { FC } from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Template } from "../templates";
import { useWizardNavigation } from "../../lib/contexts";
import { StepHeader } from "../atoms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/atoms/dialog";
import { useAI } from "@/lib/hooks";

/**
 * Step 3 page component for the wizard form.
 * Situation Descriptions step with AI assistance - third step of the wizard.
 */
const Step3: FC = () => {
  const { t } = useTranslation();
  const { setWizardStep } = useWizardNavigation();

  // Set wizard step to 2 (0-based index) when component mounts
  useEffect(() => {
    setWizardStep(2);
  }, []); // Remove setWizardStep from dependencies to prevent infinite loop

  // Local state for the textarea and dialog
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const { generateStreaming, response, isStreaming, error, cancel, reset } =
    useAI();

  return (
    <Template>
      <div className="space-y-6">
        <StepHeader
          title={t("pages.step3.title")}
          description={t("pages.step3.description")}
        />

        {/* Form content - textarea with AI assistance */}
        <div className="mt-8 max-w-3xl mx-auto">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t("pages.step3.fieldLabel", "Describe your situation")}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full rounded-md border border-input p-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder={t(
              "pages.step3.fieldPlaceholder",
              "Write a brief description of your current situation..."
            )}
          />

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded bg-primary text-white text-sm"
              onClick={() => {
                // Open dialog and start streaming AI suggestion
                setOpen(true);
                // Build a simple prompt using current text
                const prompt = t(
                  "ai.prompts.improveText",
                  "I am unemployed with no income. Help me describe my financial hardship."
                ).replace("{input}", text || "");

                generateStreaming({ prompt, context: text || "" });
              }}
            >
              {t("common.actions.helpMeWrite", "Help me write")}
            </button>

            <button
              type="button"
              className="px-4 py-2 rounded border border-input text-sm"
              onClick={() => setText("")}
            >
              {t("common.actions.clear", "Clear")}
            </button>
          </div>

          {/* Dialog showing streaming AI result */}
          <Dialog
            open={open}
            onOpenChange={(val) => {
              if (!val) {
                // If dialog closed, cancel streaming and reset AI hook
                cancel();
                reset();
              }
              setOpen(val);
            }}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {t("ai.dialog.title", "AI suggestion")}
                </DialogTitle>
                <DialogDescription>
                  {t(
                    "ai.dialog.description",
                    "The AI will provide a suggested text below as it streams. You can accept it to replace your field or close to cancel."
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="min-h-40 max-h-[50vh] overflow-auto whitespace-pre-wrap p-2 border border-border rounded">
                {isStreaming && (
                  <div className="text-sm text-muted-foreground">
                    {t("ai.streaming", "Generating...")}
                  </div>
                )}
                <div className="text-sm">
                  {response || t("ai.noContent", "No suggestion yet")}
                </div>
                {error && (
                  <div className="text-sm text-destructive mt-2">
                    {String(error)}
                  </div>
                )}
              </div>

              <DialogFooter>
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-input text-sm"
                  onClick={() => {
                    // Cancel and close, do not copy
                    cancel();
                    reset();
                    setOpen(false);
                  }}
                >
                  {t("common.actions.cancel", "Cancel")}
                </button>

                <button
                  type="button"
                  className="px-4 py-2 rounded bg-primary text-white text-sm"
                  onClick={() => {
                    // Accept the AI suggestion and copy to textarea
                    setText(response || text);
                    cancel();
                    reset();
                    setOpen(false);
                  }}
                >
                  {t("common.actions.accept", "Accept")}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Template>
  );
};

export default Step3;
