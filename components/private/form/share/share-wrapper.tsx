"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { EForm, EProfile, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, CopyIcon, DownloadIcon, ExternalLinkIcon, LoaderIcon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface IProps {
  profile: EProfile;
  subscription: ESubscription;
  email: string;
  locale: string;
  form: EForm;
}

const ShareWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const global = useGlobalStore();
  const isPublished = global.form.status === "published";

  const query = useQuery({
    queryKey: ["formSubmissionsData"],
    queryFn: () => {
      user.setEmail(props.email);
      user.setProfile(props.profile);
      user.setSubscription(props.subscription);
      user.setLocale(props.locale);
      global.setForm(props.form);
      return null;
    },
  });

  if (query.isPending) return null;

  if (!isPublished)
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 space-y-8">
        <div className="relative group">
          <div className="relative flex justify-center items-center p-3 w-fit rounded bg-primary/10">
            <Share2Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-bold tracking-tight">{t("label_not_public")}</h3>
          <p className="text-muted-foreground max-w-md text-sm">{t("desc_not_public")}</p>
        </div>
        <Button variant="secondary" size="sm" asChild className="group">
          <Link href={`/dashboard/editor/${global.form.id}`} className="flex items-center gap-2">
            <ArrowUpRightIcon className="w-5 h-5" />
            {t("nav_editor")}
          </Link>
        </Button>
      </div>
    );

  return (
    <div className="flex flex-col gap-10">
      <ShareLink />
      <ShareQrCode />
    </div>
  );
};
const ShareLink = () => {
  const t = useTranslations("app");
  const global = useGlobalStore();
  const isProduction = process.env.NODE_ENV === "production";
  const protocol = isProduction ? "https" : "http";
  const fullUrl = `${protocol}://${window.location.host}/s/${global.form.public_url}`;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-semibold">{t("label_link_share")}</Label>
        <p className="text-xs text-muted-foreground/80">{t("desc_link_share")}</p>
      </div>
      <div className="flex items-center gap-2">
        <Input value={fullUrl} readOnly className="text-sm flex-1 font-mono bg-muted/30 border-muted-foreground/20" />
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="hover:bg-primary/10 hover:text-primary border-muted-foreground/20">
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
            className="hover:bg-primary/10 hover:text-primary border-muted-foreground/20">
            <CopyIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
const ShareQrCode = () => {
  const global = useGlobalStore();
  const t = useTranslations("app");
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const isProduction = process.env.NODE_ENV === "production";
  const protocol = isProduction ? "https" : "http";
  const fullUrl = `${protocol}://${window.location.host}/s/${global.form.public_url}`;

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
            downloadLink.download = `form-${global.form.name}-qrcode.png`.replace(/\s+/g, "-");
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-semibold">{t("label_qr_share")}</Label>
        <p className="text-xs text-muted-foreground/80">{t("desc_qr_share")}</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div ref={qrCodeRef} className="bg-white p-4 rounded-xl shadow-sm border border-muted-foreground/10">
          <QRCodeSVG value={fullUrl} size={170} level="H" includeMargin={false} />
        </div>
        <Button onClick={downloadQRCode} disabled={isGenerating} className="w-fit gap-2" variant="outline">
          {isGenerating ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <DownloadIcon className="w-4 h-4" />}
          {t("label_download_qrcode")}
        </Button>
      </div>
    </div>
  );
};
export default ShareWrapper;
