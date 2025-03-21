"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BarChartIcon, CheckIcon, DatabaseIcon, LayersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const HowItWorks = () => {
  const t = useTranslations("landing");
  const steps = [
    {
      title: t("step1_label"),
      description: t("step1_desc"),
      icon: LayersIcon,
      details: [t("step1_topic1"), t("step1_topic2"), t("step1_topic3")],
    },
    {
      title: t("step2_label"),
      description: t("step2_desc"),
      icon: DatabaseIcon,
      details: [t("step2_topic1"), t("step2_topic2"), t("step2_topic3")],
    },
    {
      title: t("step3_label"),
      description: t("step3_desc"),
      icon: BarChartIcon,
      details: [t("step3_topic1"), t("step3_topic2"), t("step3_topic3")],
    },
  ];
  const [selectedStep, setSelectedStep] = useState(steps[0]);

  return (
    <section
      id="how-it-works"
      className="py-16 w-full px-6 sm:px-12 sm:min-h-dvh flex justify-center items-center flex-col gap-6">
      <div className="flex flex-col gap-4 justify-center items-center">
        <Badge uppercase variant="primary" className="w-fit">
          {t("nav_htw")}
        </Badge>
        <h2 className="text-2xl font-bold leading-tight sm:text-4xl mt-3 text-center">{t("htw_headline")}</h2>
        <p className="text-base text-foreground/70 mt-2">{t("htw_subheadline")}</p>
      </div>
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 mt-10 sm:mt-16 xl:mt-12">
        {/* Sidebar - Steps */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-start items-center h-full w-full gap-4">
            <div className="gap-6 w-full grid grid-cols-1">
              {steps.map((step) => (
                <button
                  key={step.title}
                  onClick={() => setSelectedStep(step)}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all border 
              ${
                selectedStep.title === step.title
                  ? "border-primary bg-foreground/5"
                  : "border-transparent hover:border-foreground/30"
              }`}>
                  <div
                    className={`${
                      selectedStep.title === step.title ? "bg-foreground" : "bg-primary/10"
                    } flex justify-center items-center p-2 rounded`}>
                    <step.icon
                      className={`${selectedStep.title === step.title ? "text-background" : "text-primary"} w-6 h-6`}
                    />
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <h3 className="text-lg font-semibold text-start">{step.title}</h3>
                    <p className="text-sm text-foreground/70 text-start">{step.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Details Section */}
        <Card className="rounded-lg flex flex-col gap-4">
          <div className="bg-primary/5 p-4 flex justify-start items-center gap-4">
            <div className="flex items-center justify-center p-2 bg-primary/20 rounded">
              <selectedStep.icon className="text-primary w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground text-start">{selectedStep.title}</h3>
              <p className="text-sm text-foreground/70 text-start">{selectedStep.description}</p>
            </div>
          </div>
          <ul className="p-4 flex flex-col gap-3">
            {selectedStep.details.map((detail, index) => (
              <li key={index} className="flex items-center justify-start gap-4">
                <div className="flex justify-center items-center p-1 bg-primary/10 rounded">
                  <CheckIcon className="text-primary w-4 h-4" />
                </div>
                <p className="text-foreground text-sm">{detail}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
};

export default HowItWorks;
