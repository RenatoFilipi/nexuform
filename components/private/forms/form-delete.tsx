"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { minWidth640 } from "@/helpers/constants";
import { setState } from "@/helpers/types";
import { ReactNode, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";

const FormDelete = ({
  children,
  formId,
}: {
  children: ReactNode;
  formId: string;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <Body formId={formId} setState={setOpen} />
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3">
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
  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pt-4 sm:pt-0">
      <h1 className="text-xl font-semibold">Are you absolutely sure?</h1>
      <div className="flex">
        <p className="text-sm text-foreground/80">
          This action cannot be undone. This will permanently delete this form
          and remove the data from our servers.
        </p>
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
          onClick={() => setState(false)}
          variant={"destructive"}
          size={"sm"}
          className="w-full sm:w-fit">
          Delete Form
        </Button>
      </div>
    </div>
  );
};

export default FormDelete;
