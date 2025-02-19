import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { TSetState } from "@/utils/types";
import { ReactNode, useState, useTransition } from "react";
import { useMedia } from "react-use";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/drawer";

const SettingsAccountDelete = ({ children }: { children: ReactNode }) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Personal Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action will <strong className="text-destructive">permanently delete all of your forms</strong>, along
              with all the related data. This includes all responses, settings, and any associated files. Once deleted,
              this data cannot be recovered. Please proceed with caution.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Body setState={setOpen} />
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3">
        <DrawerHeader>
          <DrawerTitle>Delete Personal Account</DrawerTitle>
          <DrawerDescription>
            This action will <strong className="text-destructive">permanently delete all of your forms</strong>, along
            with all the related data. This includes all responses, settings, and any associated files. Once deleted,
            this data cannot be recovered. Please proceed with caution.
          </DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="grid gap-3">
          <Label htmlFor="account_email">Type your related account email to continue.</Label>
          <Input id="account_email" type="text" />
        </div>
        <Alert variant={"destructive"}>
          <AlertDescription>
            This action is not reversible. Once confirmed, all your forms and associated data will be permanently
            deleted. Please be absolutely certain before proceeding.
          </AlertDescription>
        </Alert>
      </div>
      <div className="flex justify-between items-center">
        <Button variant={"outline"} size={"sm"} onClick={() => setState(false)}>
          Cancel
        </Button>
        <Button variant={"destructive"} size={"sm"}>
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default SettingsAccountDelete;
