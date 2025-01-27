"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { minWidth640 } from "@/utils/constants";
import { TFormStatus, TSetState } from "@/utils/types";
import { AlertCircleIcon, ArrowRightIcon, CopyIcon } from "lucide-react";
import Link from "next/link";
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
  publicUrl,
  status,
}: {
  children: React.ReactNode;
  publicUrl: string;
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
          <Body setState={setOpen} publicUrl={publicUrl} status={status} />
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
        <Body setState={setOpen} publicUrl={publicUrl} status={status} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  publicUrl,
  status,
}: {
  setState: TSetState<boolean>;
  publicUrl: string;
  status: TFormStatus;
}) => {
  const [url] = useState(`${window.location.host}/s/${publicUrl}`);

  return (
    <div className="flex flex-col gap-6">
      {status !== "published" && (
        <div className="flex items-start gap-4 p-4 border rounded-lg bg-info/10 border-info/20">
          <AlertCircleIcon className="w-6 h-6 text-info" />
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Form is not public</h3>
            <p className="text-sm">
              This form is currently private. To make it public, go to the
              editor page and update its status.
            </p>
            <div className="flex justify-end items-center">
              <Button variant="outline" size="sm" className="w-fit">
                <Link href={`/dashboard/editor/${publicUrl}`}>
                  Go to Editor
                </Link>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
      {status === "published" && (
        <div className="flex flex-col items-center gap-8">
          <div className="flex w-full gap-4 items-center">
            <Input
              value={url}
              className="w-full text-sm text-foreground/60"
              readOnly
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(url);
                toast.success("Link Copied");
              }}
              variant="outline"
              size="sm"
              className="flex items-center gap-2">
              <CopyIcon className="w-4 h-4" />
              Copy
            </Button>
          </div>
          <div className="flex items-center gap-6">
            <Card className="p-4 bg-white border">
              <QRCodeSVG value={url} className="w-24 h-24" />
            </Card>
            <p className="text-sm text-center text-foreground/80 max-w-xs">
              Scan the QR code or copy the link to share your form with others
              quickly and effortlessly.
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-end">
        <Button
          className="w-full sm:w-auto"
          variant="outline"
          size="sm"
          onClick={() => setState(false)}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default FormShare;
