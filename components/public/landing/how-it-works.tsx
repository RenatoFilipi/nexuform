"use client";
import {
  BarChart3Icon,
  ClipboardCheckIcon,
  FilePlusIcon,
  LayoutGridIcon,
  SendIcon,
  SettingsIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

const HowItWorks = () => {
  const t = useTranslations("landing");

  const steps = [
    {
      title: t("hiw.step1_title"),
      description: t("hiw.step1_description"),
      icon: <FilePlusIcon size={40} className="text-primary" />,
    },
    {
      title: t("hiw.step2_title"),
      description: t("hiw.step2_description"),
      icon: <ClipboardCheckIcon size={40} className="text-primary" />,
    },
    {
      title: t("hiw.step3_title"),
      description: t("hiw.step3_description"),
      icon: <SettingsIcon size={40} className="text-primary" />,
    },
    {
      title: t("hiw.step4_title"),
      description: t("hiw.step4_description"),
      icon: <LayoutGridIcon size={40} className="text-primary" />,
    },
    {
      title: t("hiw.step5_title"),
      description: t("hiw.step5_description"),
      icon: <BarChart3Icon size={40} className="text-primary" />,
    },
    {
      title: t("hiw.step6_title"),
      description: t("hiw.step6_description"),
      icon: <SendIcon size={40} className="text-primary" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-16 w-full">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
            {t("hiw.headline")}
          </h2>
          <p className="mt-4 text-base leading-7 sm:mt-4 text-foreground/70">
            {t("hiw.sub_headline")}
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 transition-shadow border rounded-lg shadow-sm hover:shadow-md hover:border-primary">
              {step.icon}
              <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
              <p className="mt-4 text-base text-center text-foreground/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
