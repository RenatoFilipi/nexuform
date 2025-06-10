"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { EForm, EProfile, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
  DownloadIcon,
  ExternalLinkIcon,
  LightbulbIcon,
  LinkIcon,
  LoaderIcon,
  SettingsIcon,
  Share2Icon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
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
      <div className="flex flex-col w-full gap-4">
        <div>
          <span className="font-semibold text-lg sm:text-xl">{t("label_share")}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Conteúdo Principal */}
          <Card className="flex flex-col justify-center items-center w-full gap-6 p-6">
            <div className="p-3 rounded bg-primary/10">
              <Share2Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col justify-center items-center gap-1 text-center">
              <h3 className="text-xl font-bold text-foreground">{t("label_not_public")}</h3>
              <p className="text-muted-foreground max-w-md text-sm/relaxed">{t("desc_not_public")}</p>
            </div>
            <Button variant="secondary" size="sm" asChild className="">
              <Link href={`/dashboard/editor/${global.form.id}`} className="flex items-center gap-2">
                <ArrowUpRightIcon className="w-4 h-4" />
                {t("nav_editor")}
              </Link>
            </Button>
          </Card>
          {/* Painel de Dicas */}
          <div className="w-full md:w-80 space-y-6">
            <Card className="flex flex-col gap-4 p-4 sm:p-6">
              <h4 className="font-semibold flex items-center gap-2 mb-4">
                <LightbulbIcon className="w-5 h-5 text-yellow-500" />
                {t("label_quick_tips")}
              </h4>
              <ul className="space-y-4 text-sm text-left">
                <li className="flex gap-3">
                  <CheckCircleIcon className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{t("label_tip_publish_to_share")}</span>
                </li>
                <li className="flex gap-3">
                  <SettingsIcon className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{t("label_tip_configure_privacy")}</span>
                </li>
                <li className="flex gap-3">
                  <UsersIcon className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{t("label_tip_restrict_access")}</span>
                </li>
              </ul>
            </Card>
            <Card className="p-4 sm:p-6">
              <h4 className="font-semibold flex items-center gap-2 mb-4">
                <ZapIcon className="w-5 h-5 text-orange-500" />
                {t("label_next_steps")}
              </h4>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/dashboard/editor/${global.form.id}`} className="flex items-center gap-2">
                  <ArrowUpRightIcon className="w-4 h-4" />
                  {t("label_configure_sharing")}
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col w-full gap-4">
      <div>
        <span className="font-semibold text-lg sm:text-xl">{t("label_share")}</span>
      </div>
      <div className="flex flex-col gap-10">
        <ShareLink />
        <ShareQrCode />
      </div>
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
    <Card className="flex flex-col sm:flex-row justify-between items-center gap-8 p-4 sm:p-8">
      <div className="flex flex-col gap-1 w-full">
        <Label className="text-base font-semibold">{t("label_link_share")}</Label>
        <p className="text-xs text-muted-foreground">{t("desc_link_share")}</p>
      </div>
      <div className="flex items-center gap-2 w-full">
        <Input value={fullUrl} readOnly className="text-sm flex-1 font-mono bg-muted/30 border-muted-foreground/20" />
        <div className="flex gap-1">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(fullUrl);
              toast.success(t("label_link_copied"));
            }}
            variant="outline"
            size="icon"
            className="hover:bg-primary/10 hover:text-primary border-muted-foreground/20">
            <LinkIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            asChild
            className="hover:bg-primary/10 hover:text-primary border-muted-foreground/20">
            <a href={fullUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
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
    <Card className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8 p-4 sm:p-8">
      <div className="flex flex-col gap-1">
        <Label className="text-base font-semibold">{t("label_qr_share")}</Label>
        <p className="text-xs text-muted-foreground">{t("desc_qr_share")}</p>
      </div>
      <div className="flex flex-col items-center gap-6">
        <div ref={qrCodeRef} className="bg-foreground p-3 rounded shadow-sm border border-muted-foreground/10">
          <QRCodeSVG value={fullUrl} size={170} level="H" />
        </div>
        <Button onClick={downloadQRCode} disabled={isGenerating} className="sm:w-full gap-2" variant="outline">
          {isGenerating ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <DownloadIcon className="w-4 h-4" />}
          {t("label_download_qrcode")}
        </Button>
      </div>
    </Card>
  );
};
export default ShareWrapper;
