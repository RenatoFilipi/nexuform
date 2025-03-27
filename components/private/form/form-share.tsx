"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { minWidth640 } from "@/utils/constants";
import { EForm } from "@/utils/entities";
import { TSetState } from "@/utils/types";
import { ArrowRightIcon, CopyIcon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/drawer";

const FormShare = ({ children, form }: { children: React.ReactNode; form: EForm }) => {
  const t = useTranslations("app");
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col min-w-[650px] h-[500px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("label_form_share")}</DialogTitle>
            <DialogDescription>{t("desc_form_share")}</DialogDescription>
          </DialogHeader>
          <Body setState={setOpen} form={form} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col max-h-[90%] h-full">
        <DrawerHeader>
          <DrawerTitle>{t("label_form_share")}</DrawerTitle>
          <DrawerDescription>{t("desc_form_share")}</DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} form={form} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({ setState, form }: { setState: TSetState<boolean>; form: EForm }) => {
  const t = useTranslations("app");
  const [url] = useState(`${window.location.host}/s/${form.public_url}`);
  console.log(url);

  return (
    <div className="flex flex-col gap-6 h-full">
      {form.status !== "published" && (
        <div className="flex items-center flex-col justify-center gap-4 px-4 py-8 border h-full rounded-lg">
          <div className="flex justify-center items-center p-2 bg-warning/10 rounded">
            <Share2Icon className="w-8 h-8 text-warning" />
          </div>
          <div className="flex flex-col justify-center items-center gap-6">
            <div className="flex justify-center items-center flex-col gap-1">
              <h3 className="text-base font-medium">{t("label_not_public")}</h3>
              <p className="text-xs text-foreground/70 text-center">{t("desc_not_public")}</p>
            </div>
            <div className="flex justify-end items-center">
              <Button variant="secondary" size="sm">
                <ArrowRightIcon className="w-4 h-4 mr-2" />
                <Link href={`/dashboard/editor/${form.id}`}>{t("nav_editor")}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      {form.status === "published" && (
        <div className="flex flex-col items-center justify-start gap-8 h-full">
          <div className="grid gap-3 w-full">
            <div className="grid gap-1">
              <Label>{t("label_link_share")}</Label>
              <span className="text-xs text-foreground/60">{t("desc_link_share")}</span>
            </div>
            <div className="flex justify-center items-center w-full gap-4">
              <Input value={url} className="w-full text-sm text-foreground/60" readOnly />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  toast.success(t("label_link_copied"));
                }}
                variant="secondary"
                size="icon"
                className="flex items-center gap-2">
                <CopyIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="gap-3 w-full h-full">
            <div className="grid gap-1 h-fit">
              <Label>{t("label_qr_share")}</Label>
              <span className="text-xs text-foreground/60">{t("desc_qr_share")}</span>
            </div>
            <div className="flex justify-center items-center flex-1 h-full">
              <Card className="p-2 bg-white">
                <QRCodeSVG value={url} className="w-36 h-36" />
              </Card>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-end">
        <Button className="w-full sm:w-auto" variant="outline" size="sm" onClick={() => setState(false)}>
          {t("label_close")}
        </Button>
      </div>
    </div>
  );
};

export default FormShare;
