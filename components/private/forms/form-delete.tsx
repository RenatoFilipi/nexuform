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
import { minWidth640 } from "@/utils/constants";
import { createClient } from "@/utils/supabase/client";
import { setState } from "@/utils/types";
import { LoaderIcon } from "lucide-react";
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
}: {
  children: ReactNode;
  formId: string;
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
              Permanently removes the selected form, including all associated
              responses and settings. This action cannot be undone. Ensure you
              have exported any necessary data before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Body formId={formId} setState={setOpen} />
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
            Permanently removes the selected form, including all associated
            responses and settings. This action cannot be undone. Ensure you
            have exported any necessary data before proceeding.
          </DrawerDescription>
        </DrawerHeader>
        <Body formId={formId} setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  formId,
}: {
  setState: setState<boolean>;
  formId: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();
  const router = useRouter();

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
    <div className="flex flex-col gap-6 h-full overflow-y-auto pt-4 sm:pt-0">
      <div className="flex justify-end flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4">
        <Button
          onClick={() => setState(false)}
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          Cancel
        </Button>
        <Button
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
