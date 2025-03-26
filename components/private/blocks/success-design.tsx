"use client";

import Brand from "@/components/core/brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IDesign } from "@/utils/interfaces";
import { TColor } from "@/utils/types";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const design: IDesign[] = [
  { label: "slate", tw_class: "bg-slate-500/10 text-slate-500" },
  { label: "gray", tw_class: "bg-gray-500/10 text-gray-500" },
  { label: "zinc", tw_class: "bg-zinc-500/10 text-zinc-500" },
  { label: "neutral", tw_class: "bg-neutral-500/10 text-neutral-500" },
  { label: "stone", tw_class: "bg-stone-500/10 text-stone-500" },
  { label: "red", tw_class: "bg-red-500/10 text-red-500" },
  { label: "orange", tw_class: "bg-orange-500/10 text-orange-500" },
  { label: "amber", tw_class: "bg-amber-500/10 text-amber-500" },
  { label: "yellow", tw_class: "bg-yellow-500/10 text-yellow-500" },
  { label: "lime", tw_class: "bg-lime-500/10 text-lime-500" },
  { label: "green", tw_class: "bg-green-500/10 text-green-500" },
  { label: "emerald", tw_class: "bg-emerald-500/10 text-emerald-500" },
  { label: "teal", tw_class: "bg-teal-500/10 text-teal-500" },
  { label: "cyan", tw_class: "bg-cyan-500/10 text-cyan-500" },
  { label: "sky", tw_class: "bg-sky-500/10 text-sky-500" },
  { label: "blue", tw_class: "bg-blue-500/10 text-blue-500" },
  { label: "indigo", tw_class: "bg-indigo-500/10 text-indigo-500" },
  { label: "violet", tw_class: "bg-violet-500/10 text-violet-500" },
  { label: "purple", tw_class: "bg-purple-500/10 text-purple-500" },
  { label: "fuchsia", tw_class: "bg-fuchsia-500/10 text-fuchsia-500" },
  { label: "pink", tw_class: "bg-pink-500/10 text-pink-500" },
  { label: "rose", tw_class: "bg-rose-500/10 text-rose-500" },
];
interface IProps {
  brand: boolean;
  preview: boolean;
  color: TColor;
  title: string;
  description: string;
}

const SuccessDesign = ({ brand, preview, color, description, title }: IProps) => {
  const t = useTranslations("app");
  const currentColor = design.find((x) => x.label === color) ?? design[0];

  return (
    <div className="flex justify-center items-center w-full">
      <Card className="flex flex-col gap-6 sm:w-[500px] p-8 w-full">
        <div className="flex flex-col justify-center items-center gap-6">
          <div className={twMerge(currentColor.tw_class, "rounded-full p-3")}>
            <CheckIcon className="w-10 h-10" />
          </div>
          <div className="flex flex-col justify-center items-center gap-1">
            <h1 className="text-2xl font-bold text-center">{title}</h1>
            <p className="text-center text-base text-foreground/60">{description}</p>
          </div>
        </div>
        {brand && (
          <div className="flex justify-center items-center gap-3 flex-col">
            <div className="text-center">
              <span className="font-medium text-sm text-foreground/70">{t("success_cta")}</span>
            </div>
            <Button
              size="lg"
              variant={"outline"}
              className="w-full flex items-center justify-center gap-2"
              asChild={!preview}>
              {preview ? (
                <>
                  <Brand type="logo" className="w-4 h-4 fill-foreground" />
                  {t("access_cta")}
                </>
              ) : (
                <Link href={"/signup"}>
                  <Brand type="logo" className="w-4 h-4 fill-foreground" />
                  {t("access_cta")}
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
