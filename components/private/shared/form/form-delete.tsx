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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useGlobalStore from "@/stores/global";
import { createClient } from "@/utils/supabase/client";
import { TSetState } from "@/utils/types";
import { AlertCircleIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ReactNode, useState, useTransition } from "react";
import { toast } from "sonner";

const FormDelete = ({ children, formId, formName }: { children: ReactNode; formId: string; formName: string }) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="backdrop-blur-sm">
        <AlertDialogContent className="flex flex-col w-full min-w-[650px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("label_absolute_delete_form")}</AlertDialogTitle>
            <AlertDialogDescription>{t("desc_absolute_delete_form")}</AlertDialogDescription>
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
      setState(false);
    });
  };

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pt-4 sm:pt-0">
      <div className="grid gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="form_name" className="text-xs">
            {t("label_absolute_type_email_delete_form")}
          </Label>
          <span className="font-semibold text-sm hidden">{formName}</span>
        </div>
        <Input type="text" id="form_name" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <div className="flex justify-start items-center gap-1 bg-destructive/15 p-2 rounded">
        <AlertCircleIcon className="w-4 h-4 text-destructive" />
        <span className="text-sm font-semibold text-destructive">{t("label_action_undone")}</span>
      </div>
      <div className="flex justify-end flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4">
        <Button
          disabled={isPending}
          onClick={() => setState(false)}
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          {t("label_cancel")}
        </Button>
        <Button
          disabled={!matches || isPending}
          onClick={onDeleteForm}
          variant={"destructive"}
          size={"sm"}
          className="w-full sm:w-fit">
          {isPending && <LoaderIcon className="animate-spin w-4 h-4 mr-2" />}
          {t("label_delete_form")}
        </Button>
      </div>
    </div>
  );
};

export default FormDelete;
