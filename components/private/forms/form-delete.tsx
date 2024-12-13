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
import { minWidth640 } from "@/helpers/constants";
import { setState } from "@/helpers/types";
import { ReactNode, useState } from "react";
import { useMediaQuery } from "react-responsive";
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
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              form and remove the data from our servers.
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
            This action cannot be undone. This will permanently delete this form
            and remove the data from our servers.
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
