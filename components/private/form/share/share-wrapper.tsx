"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EForm, EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { IContext } from "@/utils/interfaces";
import { useQuery } from "@tanstack/react-query";
import { DownloadIcon, ExternalLinkIcon, LinkIcon, LoaderIcon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  form: EForm;
  context: IContext;
}

const ShareWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["share-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganization(props.organization);
      app.setSubscription(props.subscription);
      app.setTeamMemberProfile(props.teamMemberProfile);
      app.setForm(props.form);
      app.setContext(props.context);
      return null;
    },
  });

  const isPublished = app.form.status === "published";
  if (query.isPending) return null;

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-4">
      {/* header */}
      <div>
        <span className="font-semibold text-lg sm:text-xl">{t("label_share")}</span>
      </div>
      {/* content */}
      {!isPublished && (
        <Card className="flex w-full justify-center items-center flex-col gap-4 py-36 px-4">
          <div className="flex justify-center items-center p-3 w-fit rounded bg-primary/10">
            <Share2Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col justify-center items-center gap-1 text-center">
            <h3 className="text-xl font-bold text-foreground">{t("label_not_public")}</h3>
            <p className="text-muted-foreground max-w-md text-sm/relaxed">{t("desc_not_public")}</p>
          </div>
        </Card>
      )}
      {isPublished && (
        <div className="flex flex-col gap-10">
          <ShareLink />
          <ShareQrCode />
        </div>
      )}
    </div>
  );
};

const ShareLink = () => {
  const t = useTranslations("app");
  const app = useAppStore();
  const isProduction = process.env.NODE_ENV === "production";
  const protocol = isProduction ? "https" : "http";
  const fullUrl = `${protocol}://${window.location.host}/s/${app.form.public_id}`;

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
  const t = useTranslations("app");
  const app = useAppStore();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const isProduction = process.env.NODE_ENV === "production";
  const protocol = isProduction ? "https" : "http";
  const fullUrl = `${protocol}://${window.location.host}/s/${app.form.public_id}`;

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
            downloadLink.download = `form-${app.form.name}-qrcode.png`.replace(/\s+/g, "-");
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
