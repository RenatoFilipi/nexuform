"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { minWidth640 } from "@/utils/constants";
import { mockForms } from "@/utils/mocks";
import { FormProps } from "@/utils/modules";
import { setState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { CopyIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
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
}: {
  children: React.ReactNode;
  formId: string;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
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
          <Body setState={setOpen} formId={formId} />
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
        <Body setState={setOpen} formId={formId} />
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
  const [url, setUrl] = useState("");
  const [form, setForm] = useState<FormProps | null>(null);

  useQuery({
    queryKey: ["formShareData"],
    queryFn: () => {
      const currentForm = mockForms.find((x) => x.id === formId);
      if (!currentForm) return;
      setForm(currentForm);
      setUrl(`${window.location.host}/s/${currentForm.id}`);
      return null;
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 justify-center items-start">
        {form?.status !== "published" && (
          <Alert variant={"destructive"}>
            <AlertDescription>
              This form is not currently public, change the status in the editor
              page.
            </AlertDescription>
          </Alert>
        )}
      </div>
      {form?.status === "published" && (
        <div className="flex flex-col justify-center items-center gap-6">
          <div className="flex justify-center items-center w-full gap-4">
            <Input value={url} className="text-foreground/60 w-full" readOnly />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(url);
                toast.success("Link Copied");
              }}
              variant={"default"}
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
