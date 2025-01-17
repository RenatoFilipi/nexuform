"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

const CallToAction = () => {
  const t = useTranslations("landing");

  return (
    <section className="py-40 bg-gradient-to-b from-[#181C1F] to-primary text-white w-full">
      <div className="px-4 mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("cta.headline")}</h2>
        <p className="mt-4 text-lg">{t("cta.sub_headline")}</p>
        <div className="mt-8 flex justify-center gap-4 flex-col sm:flex-row">
          <Button size={"sm"}>
            <Link href={"#how-it-works"}>{t("cta.action_1")}</Link>{" "}
          </Button>
          <Button size={"sm"} variant={"secondary"}>
            <Link href={"/signup"}>{t("cta.action_2")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
