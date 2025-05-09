"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useEditorStore from "@/stores/editor";
import { minWidth640 } from "@/utils/constants";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TSetState } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { SaveIcon, UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/drawer";

const EditorSaveForm = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col min-w-[650px] h-[55%]">
          <DialogHeader className="text-left">
            <DialogTitle>{t("label_save_form")}</DialogTitle>
            <DialogDescription>{t("desc_save_options")}</DialogDescription>
          </DialogHeader>
          <Body setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 max-h-[90%]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("label_save_form")}</DrawerTitle>
          <DrawerDescription>{t("desc_save_options")}</DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const { form, theme, blocks, blocksReadyOnly } = useEditorStore();
  const router = useRouter();
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const queryClient = useQueryClient();
  const hasNoBlocks = blocks.length <= 0;

  const handleSave = async (status: string) => {
    if (appState === "loading") return;

    try {
      setAppState("loading");

      // Execute all save operations in sequence
      await Promise.all([saveForm(status), saveTheme(), saveBlocks()]);

      toast.success(t("suc_update_form"));
      queryClient.invalidateQueries({ queryKey: ["submissionData"] });
      router.push(`/dashboard/forms/${form.id}`);
    } catch (error) {
      console.error("Save operation failed:", error);
      toast.error((error as Error).message || t("err_generic"));
    } finally {
      setAppState("idle");
    }
  };
  const saveForm = async (status: string) => {
    const { error } = await supabase
      .from("forms")
      .update({
        name: form.name,
        description: form.description,
        status: status,
        submit_label: form.submit_label,
        success_title: form.success_title,
        success_description: form.success_description,
      })
      .eq("id", form.id);

    if (error) {
      throw new Error(t("err_generic"));
    }
  };
  const saveTheme = async () => {
    const { error } = await supabase
      .from("themes")
      .update({
        numeric_blocks: theme.numeric_blocks,
        app_branding: theme.app_branding,
        uppercase_block_name: theme.uppercase_block_name,
        custom_primary_color: theme.custom_primary_color,
      })
      .eq("id", theme.id);

    if (error) {
      throw new Error(t("err_generic"));
    }
  };
  const saveBlocks = async () => {
    const elementsBefore = blocksReadyOnly;
    const elementsAfter = blocks;

    // Identify changes between versions
    const beforeIds = new Set(elementsBefore.map((x) => x.id));
    const afterIds = new Set(elementsAfter.map((x) => x.id));

    const modifiedElements = elementsAfter.filter((after) => {
      const before = elementsBefore.find((x) => x.id === after.id);
      return before && JSON.stringify(before) !== JSON.stringify(after);
    });

    const newElements = elementsAfter.filter((x) => !beforeIds.has(x.id));
    const removedElements = elementsBefore.filter((x) => !afterIds.has(x.id));

    // Process changes in a single transaction if possible
    const upsertPromises = [];
    const deletePromises = [];

    if (modifiedElements.length > 0 || newElements.length > 0) {
      upsertPromises.push(supabase.from("blocks").upsert([...modifiedElements, ...newElements]));
    }

    if (removedElements.length > 0) {
      deletePromises.push(...removedElements.map((x) => supabase.from("blocks").delete().eq("id", x.id)));
    }

    // Execute all operations in parallel
    const results = await Promise.all([...upsertPromises, ...deletePromises]);

    // Check for errors
    const hasError = results.some((result) => result.error);
    if (hasError) {
      throw new Error(t("err_generic"));
    }
  };

  const saveOptions = [
    {
      label: t("label_save_form"),
      description: "",
      icon: <SaveIcon className="h-6 w-6 text-primary" />,
      onClick: () => handleSave(form.status),
      disabled: appState === "loading",
      variant: "default",
    },
    {
      label: t("label_save_publish"),
      description: t("desc_save_publish"),
      icon: <UploadIcon className="h-6 w-6 text-primary" />,
      onClick: () => handleSave("published"),
      disabled: appState === "loading" || hasNoBlocks,
      variant: "publish",
      warning: hasNoBlocks ? (
        <Alert className="p-1 mt-2" variant="warning">
          <AlertDescription>{t("label_editor_no_blocks_warn")}</AlertDescription>
        </Alert>
      ) : null,
    },
  ];

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        {saveOptions.map((option, index) => (
          <button
            key={index}
            disabled={option.disabled}
            className={`${
              option.disabled
                ? "opacity-60 cursor-not-allowed"
                : "hover:shadow-md hover:border-primary/30 cursor-pointer"
            }
 relative border rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-center 
          hover:bg-muted/20 transition-all duration-300 cursor-pointer group overflow-hidden bg-background
        `}
            onClick={option.onClick}>
            {/* Efeito de hover sutil */}
            {!option.disabled && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}

            <div
              className={`p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors ${
                option.disabled ? "" : "group-hover:scale-105"
              } transition-transform`}>
              {option.icon}
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-lg">{option.label}</h3>
              {option.description && (
                <p className="text-sm text-muted-foreground/80 leading-relaxed">{option.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-start gap-3 pt-2">
        <Button
          disabled={appState === "loading"}
          onClick={() => setState(false)}
          variant="outline"
          size="sm"
          className="border-2 hover:border-primary/50 transition-colors">
          {t("label_close")}
        </Button>
      </div>
    </div>
  );
};

export default EditorSaveForm;
