"use client";

import GridPattern from "@/components/magicui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Cta = () => {
  const t = useTranslations("landing");

  return (
    <section className="w-full py-40 flex justify-center sm:justify-start items-center px-4 sm:px-20 sm:bg-gradient-to-r relative from-primary to-foreground bg-primary">
      <GridPattern width={15} height={15} x={-1} y={-1} strokeDasharray={"4 2"} className={cn("")} maxOpacity={0.2} />
      <div className="w-full flex flex-col gap-4 sm:gap-0 z-10 justify-center">
        <h2 className=" text-2xl sm:text-4xl text-center sm:text-start text-background font-medium">
          {t("cta_headline")}
        </h2>
        <p className="text-sm sm:text-lg text-center sm:text-start text-background">{t("cta_subheadline")}</p>
        <div className="mt-8">
          <Button asChild variant={"secondary"} className="w-full sm:w-fit">
            <Link href={"/signup"}>
              {t("cta_get_started")} <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Cta;
