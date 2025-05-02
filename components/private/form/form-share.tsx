"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { minWidth640 } from "@/utils/constants";
import { EForm } from "@/utils/entities";
import { TSetState } from "@/utils/types";
import { CopyIcon, DownloadIcon, ExternalLinkIcon, LoaderIcon, PenIcon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
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
        <DialogContent className="flex flex-col min-w-[650px] h-[90%] overflow-y-auto">
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
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const isProduction = process.env.NODE_ENV === "production";
  const protocol = isProduction ? "https" : "http";
  const fullUrl = `${protocol}://${window.location.host}/s/${form.public_url}`;

  const downloadQRCode = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (qrCodeRef.current) {
        const svg = qrCodeRef.current.querySelector("svg");
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `qrcode-${new Date().getTime()}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
            setIsGenerating(false);
          };
          img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
        }
      }
    }, 100);
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      {form.status !== "published" && (
        <div className="flex items-center flex-col justify-center gap-4 px-4 py-8 h-full rounded-lg">
          <div className="flex justify-center items-center p-2 bg-foreground/5 rounded">
            <Share2Icon className="w-6 h-6 text-warning" />
          </div>
          <div className="flex flex-col justify-center items-center gap-6">
            <div className="flex justify-center items-center flex-col gap-1">
              <h3 className="text-lg font-medium">{t("label_not_public")}</h3>
              <p className="text-sm text-muted-foreground text-center">{t("desc_not_public")}</p>
            </div>
            <div className="flex justify-end items-center">
              <Button variant="outline" size="sm">
                <PenIcon className="w-4 h-4 mr-2" />
                <Link href={`/dashboard/editor/${form.id}`}>{t("nav_editor")}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      {form.status === "published" && (
        <div className="flex flex-col items-center justify-start gap-8 h-full overflow-y-auto sm:overflow-hidden">
          <div className="grid gap-3 w-full">
            <div className="grid gap-1">
              <Label>{t("label_link_share")}</Label>
              <span className="text-xs text-foreground/60">{t("desc_link_share")}</span>
            </div>
            <div className="flex justify-center items-center w-full gap-4">
              <Input value={fullUrl} className="w-full text-sm text-foreground/60" readOnly />
              <div className="flex justify-center items-center gap-2">
                <Button variant="outline" size="icon" className="flex items-center gap-2" asChild>
                  <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(fullUrl);
                    toast.success(t("label_link_copied"));
                  }}
                  variant="outline"
                  size="icon"
                  className="flex items-center gap-2">
                  <CopyIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="gap-3 w-full h-full">
            <div className="grid gap-1 h-fit">
              <Label>{t("label_qr_share")}</Label>
              <span className="text-xs text-foreground/60">{t("desc_qr_share")}</span>
            </div>
            <div className="flex justify-evenly items-center flex-1 h-full gap-4 flex-col sm:flex-row">
              <div ref={qrCodeRef}>
                <QRCodeSVG value={fullUrl} size={256} level="H" />
              </div>
              <Button
                onClick={downloadQRCode}
                disabled={isGenerating}
                className="gap-2"
                variant={"outline"}
                size={"sm"}>
                {!isGenerating && <DownloadIcon className="w-4 h-4" />}
                {isGenerating && <LoaderIcon className="w-4 h-4 animate-spin" />}
                {t("label_download_qrcode")}
              </Button>
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
