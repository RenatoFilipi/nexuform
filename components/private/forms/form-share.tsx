"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { minWidth640 } from "@/utils/constants";
import { TFormStatus, TSetState } from "@/utils/types";
import { CopyIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useMedia } from "react-use";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../../ui/drawer";

const FormShare = ({
  children,
  formId,
  status,
}: {
  children: React.ReactNode;
  formId: string;
  status: TFormStatus;
}) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Share Your Form</DialogTitle>
            <DialogDescription>
              Easily share your form with others using a link or a QR code.
            </DialogDescription>
          </DialogHeader>
          <Body setState={setOpen} formId={formId} status={status} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col">
        <DrawerHeader>
          <DialogTitle>Share Your Form</DialogTitle>
          <DialogDescription>
            Easily share your form with others using a link or a QR code.
          </DialogDescription>
        </DrawerHeader>
        <Body setState={setOpen} formId={formId} status={status} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  formId,
  status,
}: {
  setState: TSetState<boolean>;
  formId: string;
  status: TFormStatus;
}) => {
  const [url] = useState(`${window.location.host}/s/${formId}`);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 justify-center items-start">
        {status !== "published" && (
          <Alert variant={"destructive"}>
            <AlertDescription>
              This form is not currently public, change the status in the editor
              page.
            </AlertDescription>
          </Alert>
        )}
      </div>
      {status === "published" && (
        <div className="flex flex-col justify-center items-center gap-6">
          <div className="flex justify-center items-center w-full gap-4">
            <Input value={url} className="text-foreground/60 w-full" readOnly />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(url);
                toast.success("Link Copied");
              }}
              variant={"outline"}
              size={"sm"}
              className="w-fit">
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-center items-center rounded gap-6">
            <div className="bg-white p-2">
              <QRCodeSVG value={url} />
            </div>
            <p className="text-sm text-foreground/80">
              Scan the QR code or copy the link to share your form with others
              quickly and effortlessly.
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-end items-center">
        <Button
          className="w-full sm:w-fit"
          variant={"outline"}
          size={"sm"}
          onClick={() => setState(false)}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default FormShare;
