"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { minWidth640 } from "@/utils/constants";
import { createClient } from "@/utils/supabase/client";
import { TSetState } from "@/utils/types";
import { AlertCircleIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState, useTransition } from "react";
import { useMedia } from "react-use";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";

const FormDelete = ({
  children,
  formId,
  formName,
}: {
  children: ReactNode;
  formId: string;
  formName: string;
}) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action permanently removes the selected form, including all
              associated responses and settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Body formId={formId} formName={formName} setState={setOpen} />
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3">
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action permanently removes the selected form, including all
            associated responses and settings. This action cannot be undone.
          </DrawerDescription>
        </DrawerHeader>
        <Body formId={formId} formName={formName} setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  formId,
  formName,
}: {
  setState: TSetState<boolean>;
  formId: string;
  formName: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();
  const router = useRouter();
  const [value, setValue] = useState("");

  const onDeleteForm = () => {
    startTransition(async () => {
      const { error } = await supabase.from("forms").delete().eq("id", formId);
      if (error) {
        toast.error("Error on deleting form.");
        console.log(error);
        return;
      }
      router.push("/dashboard/forms");
    });
  };

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pt-4 sm:pt-0">
      <div className="grid gap-3">
        <Label htmlFor="form_name">
          Type <span className="text-destructive">&quot;{formName}&quot;</span>{" "}
          to delete this form.
        </Label>
        <Input
          type="text"
          id="form_name"
          placeholder=""
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="flex justify-start items-center gap-1">
        <AlertCircleIcon className="w-4 h-4 text-destructive" />
        <span className="text-sm">This action cannot be undone.</span>
      </div>
      <div className="flex justify-end flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4">
        <Button
          onClick={() => setState(false)}
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          Cancel
        </Button>
        <Button
          disabled={formName !== value}
          onClick={onDeleteForm}
          variant={"destructive"}
          size={"sm"}
          className="w-full sm:w-fit">
          {isPending ? (
            <LoaderIcon className="animate-spin w-4 h-4" />
          ) : (
            "Delete Form"
          )}
        </Button>
      </div>
    </div>
  );
};

export default FormDelete;
