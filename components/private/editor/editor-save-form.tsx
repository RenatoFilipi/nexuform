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
        <DialogContent className="flex flex-col min-w-[650px] h-[85%]">
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

  const onSave = async (status: string) => {
    try {
      setAppState("loading");

      await onSaveForm(status);
      await onSaveTheme();
      await onSaveBlocks();

      toast.success(t("suc_update_form"));
      queryClient.invalidateQueries({ queryKey: ["submissionData"] });
      router.push(`/dashboard/forms/${form.id}`);
    } catch (error) {
      toast.error((error as Error).message || t("err_generic"));
    } finally {
      setAppState("idle");
    }
  };
  const onSaveForm = async (status: string) => {
    try {
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
    } catch (error) {
      throw error;
    }
  };
  const onSaveTheme = async () => {
    try {
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
    } catch (error) {
      throw error;
    }
  };
  const onSaveBlocks = async () => {
    try {
      const elementsBefore = blocksReadyOnly;
      const elementsAfter = blocks;

      const beforeIds = new Set(elementsBefore.map((x) => x.id));
      const afterIds = new Set(elementsAfter.map((x) => x.id));

      const modifiedElements = elementsAfter.filter((after) => {
        if (!beforeIds.has(after.id)) return false;
        const before = elementsBefore.find((x) => x.id === after.id);
        return JSON.stringify(before) !== JSON.stringify(after);
      });

      const newElements = elementsAfter.filter((x) => !beforeIds.has(x.id));
      const removedElements = elementsBefore.filter((x) => !afterIds.has(x.id));

      const elementsToUpsert = [...modifiedElements, ...newElements];

      if (elementsToUpsert.length > 0) {
        const { error: upsertError } = await supabase.from("blocks").upsert(elementsToUpsert);

        if (upsertError) {
          throw new Error(t("err_generic"));
        }
      }

      if (removedElements.length > 0) {
        const deletePromises = removedElements.map((x) => supabase.from("blocks").delete().eq("id", x.id));

        const deleteResults = await Promise.all(deletePromises);

        const hasError = deleteResults.some(({ error }) => error);
        if (hasError) {
          throw new Error(t("err_generic"));
        }
      }
    } catch (error) {
      console.error("Error saving blocks:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          disabled={appState === "loading"}
          className="border rounded-lg p-6 flex flex-col items-center justify-center gap-4 text-center hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => onSave(form.status)}>
          <div className="p-3 rounded-full bg-primary/10">
            <SaveIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">{t("label_save_form")}</h3>
          </div>
        </button>
        {/* Save and Publish Option */}
        <button
          disabled={appState === "loading"}
          className="border rounded-lg p-6 flex flex-col items-center justify-center gap-4 text-center hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => onSave("published")}>
          <div className="p-3 rounded-full bg-primary/10">
            <UploadIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">{t("label_save_publish")}</h3>
            <p className="text-sm text-muted-foreground">{t("desc_save_publish")}</p>
            {hasNoBlocks && (
              <Alert className="p-1" variant={"warning"}>
                <AlertDescription>No blocks to publish this form.</AlertDescription>
              </Alert>
            )}
          </div>
        </button>
      </div>
      <div className="flex justify-start gap-2">
        <Button disabled={appState === "loading"} onClick={() => setState(false)} variant={"outline"} size={"sm"}>
          {t("label_close")}
        </Button>
      </div>
    </div>
  );
};

export default EditorSaveForm;
