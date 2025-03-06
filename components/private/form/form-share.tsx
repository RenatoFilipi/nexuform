"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { minWidth640 } from "@/utils/constants";
import { EForm } from "@/utils/entities";
import { TSetState } from "@/utils/types";
import { ArrowRightIcon, CopyIcon, Share2Icon } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "../../ui/drawer";

const FormShare = ({ children, form }: { children: React.ReactNode; form: EForm }) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col min-w-[650px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Share Your Form</DialogTitle>
            <DialogDescription>Make your form accessible to others and start collecting responses.</DialogDescription>
          </DialogHeader>
          <Body setState={setOpen} form={form} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col max-h-[90%]">
        <DrawerHeader>
          <DialogTitle>Share Your Form</DialogTitle>
          <DialogDescription>Make your form accessible to others and start collecting responses..</DialogDescription>
        </DrawerHeader>
        <Body setState={setOpen} form={form} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ setState, form }: { setState: TSetState<boolean>; form: EForm }) => {
  const [url] = useState(`${window.location.host}/s/${form.public_url}`);

  return (
    <div className="flex flex-col gap-6 h-full">
      {form.status !== "published" && (
        <div className="flex items-center flex-col justify-center gap-4 px-4 py-8 border h-full rounded-lg">
          <div className="flex justify-center items-center p-2 bg-warning/10 rounded">
            <Share2Icon className="w-8 h-8 text-warning" />
          </div>
          <div className="flex flex-col justify-center items-center gap-6">
            <div className="flex justify-center items-center flex-col gap-1">
              <h3 className="text-base font-medium">Form is not public</h3>
              <p className="text-xs text-foreground/70 text-center">
                This form is currently private. To make it public, go to the editor page and update its status.
              </p>
            </div>
            <div className="flex justify-end items-center">
              <Button variant="secondary" size="sm">
                <ArrowRightIcon className="w-4 h-4 mr-2" />
                <Link href={`/dashboard/editor/${form.id}`}>Go to Editor</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      {form.status === "published" && (
        <div className="flex flex-col items-center justify-start gap-8 h-full">
          <div className="grid gap-3 w-full">
            <div className="grid gap-1">
              <Label>Share via link</Label>
              <span className="text-xs text-foreground/60">
                Copy the link below to easily share your form with others.
              </span>
            </div>
            <div className="flex justify-center items-center w-full gap-4">
              <Input value={url} className="w-full text-sm text-foreground/60" readOnly />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  toast.success("Link Copied");
                }}
                variant="outline"
                size="icon"
                className="flex items-center gap-2">
                <CopyIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="gap-3 w-full h-full hidden">
            <div className="grid gap-1 h-fit">
              <Label>Share via QR Code</Label>
              <span className="text-xs text-foreground/60">
                Scan the QR code or copy the link to share your form with others quickly and effortlessly.
              </span>
            </div>
            <div className="flex justify-center items-center flex-1 h-full">
              <Card className="p-2 bg-primary/10">
                <QRCodeSVG value={url} className="w-36 h-36" />
              </Card>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-end">
        <Button className="w-full sm:w-auto" variant="outline" size="sm" onClick={() => setState(false)}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default FormShare;
