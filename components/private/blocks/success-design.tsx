"use client";

import Brand from "@/components/core/brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TColor } from "@/utils/types";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface IProps {
  brand: boolean;
  preview: boolean;
  color: TColor;
  title: string;
  description: string;
}

const SuccessDesign = ({ brand, preview, color, description, title }: IProps) => {
  const t = useTranslations("app");
  const lightenColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  };
  const lighterColor = lightenColor(color, 20);

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] w-full p-4">
      <Card className="flex flex-col gap-8 p-8 w-full sm:max-w-md border-transparent">
        <div className="flex flex-col justify-center items-center gap-6">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-md opacity-30 animate-pulse"
              style={{ backgroundColor: color }}
            />
            <div
              className="relative flex items-center justify-center w-16 h-16 rounded-full"
              style={{ backgroundColor: color }}>
              <CheckIcon className="w-8 h-8 text-white stroke-[3]" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 text-center">
            <h1
              className="text-3xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${color}, ${lighterColor})`,
              }}>
              {title}
            </h1>
            <p className="text-center text-base text-foreground/80 leading-relaxed">{description}</p>
          </div>
        </div>
        {brand && (
          <div className="flex justify-center items-center gap-5 flex-col mt-4">
            <div className="text-center">
              <span className="font-semibold text-sm text-foreground/70">{t("success_cta")}</span>
            </div>
            <Button
              size="default"
              className="flex items-center justify-center gap-2 w-full group transition-all text-white"
              style={{ backgroundColor: color }}
              asChild={!preview}>
              {preview ? (
                <>
                  <Brand type="logo" className="w-5 h-5 fill-white" />
                  <span className="">{t("access_cta")}</span>
                </>
              ) : (
                <Link href={"/signup"} className="flex items-center gap-2">
                  <Brand type="logo" className="w-5 h-5 fill-white" />
                  <span className="">{t("access_cta")}</span>
                </Link>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SuccessDesign;
