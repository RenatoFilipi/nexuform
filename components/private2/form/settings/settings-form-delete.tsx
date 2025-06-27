"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useGlobalStore from "@/stores/global";
import { createClient } from "@/utils/supabase/client";
import { TSetState } from "@/utils/types";
import { motion } from "framer-motion";
import { LayersIcon, LoaderIcon, SkullIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ReactNode, useState, useTransition } from "react";
import { toast } from "sonner";

const SettingsFormDelete = ({
  children,
  formId,
  formName,
}: {
  children: ReactNode;
  formId: string;
  formName: string;
}) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="backdrop-blur-sm">
        <AlertDialogContent className="flex flex-col w-full max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("label_absolute_delete_form")}</AlertDialogTitle>
            <AlertDialogDescription className="hidden">{t("desc_absolute_delete_form")}</AlertDialogDescription>
          </AlertDialogHeader>
          <Body formId={formId} formName={formName} setState={setOpen} />
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
const Body = ({ setState, formId, formName }: { setState: TSetState<boolean>; formId: string; formName: string }) => {
  const t = useTranslations("app");
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();
  const router = useRouter();
  const [value, setValue] = useState("");
  const global = useGlobalStore();
  const matches = formName.trim().toLowerCase() === value.trim().toLowerCase();

  const onDeleteForm = () => {
    startTransition(async () => {
      const { error } = await supabase.from("forms").delete().eq("id", formId);
      if (error) {
        toast.error(t("err_generic"));
        return;
      }
      toast.success(t("suc_form_delete"));
      router.push("/dashboard/organizations");
      global.setForms(global.forms.filter((x) => x.id !== formId));
    });
  };

  return (
    <div className="flex flex-1 flex-col justify-between gap-6">
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-muted/20 to-background border border-muted/30 shadow-lg h-full flex flex-col justify-center items-center w-full overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/30 rounded-full blur-xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-secondary/30 rounded-full blur-xl"></div>
        </div>
        <div className="flex justify-center items-center py-14 flex-col gap-8">
          <motion.div
            animate={{
              x: 0,
              opacity: 1,
              boxShadow: [
                "0 0 0 0 rgba(220, 38, 38, 0.7)",
                "0 0 0 10px rgba(220, 38, 38, 0)",
                "0 0 0 0 rgba(220, 38, 38, 0)",
              ],
              borderColor: ["rgb(220 38 38 / 0.7)", "rgb(220 38 38 / 0.3)", "rgb(220 38 38 / 0.7)"],
            }}
            transition={{
              delay: 0.2,
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center gap-4 p-4 bg-destructive/10 rounded-xl border border-muted/20 shadow-sm backdrop-blur-sm">
            <LayersIcon className="text-destructive w-8 h-8" />
          </motion.div>
          <div className="flex flex-col gap-6 items-center text-center">
            <span className="text-sm">{t("desc_absolute_delete_form")}</span>
            <Badge variant={"destructive"}>{t("label_action_undone")}</Badge>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-4">
        <Button
          disabled={isPending}
          onClick={() => setState(false)}
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          {t("label_cancel")}
        </Button>
        <Button onClick={onDeleteForm} variant={"destructive_outline"} size={"sm"} className="w-full sm:w-fit">
          {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
          {t("label_delete_form")}
        </Button>
      </div>
    </div>
  );
};

export default SettingsFormDelete;
