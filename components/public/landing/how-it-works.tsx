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
      color: "text-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: t("step2_label"),
      description: t("step2_desc"),
      icon: DatabaseIcon,
      details: [t("step2_topic1"), t("step2_topic2"), t("step2_topic3")],
      color: "text-purple-500 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      title: t("step3_label"),
      description: t("step3_desc"),
      icon: BarChartIcon,
      details: [t("step3_topic1"), t("step3_topic2"), t("step3_topic3")],
      color: "text-green-500 bg-green-50 dark:bg-green-900/30 dark:text-green-400",
    },
  ];
  const [selectedStep, setSelectedStep] = useState(steps[0]);

  return (
    <section
      id="how-it-works"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background dark:bg-gradient-to-b dark:from-background dark:to-muted/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="text-primary border-primary/30 bg-primary/10 dark:bg-primary/20 dark:border-primary/50 px-3 py-1.5 text-sm font-medium">
            {t("nav_htw")}
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{t("htw_headline")}</h2>
          <p className="text-lg text-muted-foreground dark:text-muted-foreground/80">{t("htw_subheadline")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Steps Navigation */}
          <div className="space-y-4">
            {steps.map((step) => (
              <button
                key={step.title}
                onClick={() => setSelectedStep(step)}
                className={`w-full text-left p-6 rounded-xl transition-all duration-300 border-2 ${
                  selectedStep.title === step.title
                    ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md dark:shadow-primary/10"
                    : "border-transparent hover:border-muted-foreground/20 bg-background dark:bg-muted/5 hover:shadow-sm dark:hover:shadow-muted/5"
                }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${step.color} transition-colors`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground dark:text-muted-foreground/70 mt-1">{step.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Details Panel */}
          <Card className="h-full overflow-hidden border-0 shadow-lg dark:shadow-none dark:border dark:border-muted/30">
            <div
              className={`p-6 ${selectedStep.color
                .replace("text-", "bg-")
                .replace("500", "50")
                .replace("bg-", "bg-")} dark:bg-gradient-to-r dark:from-muted/10 dark:to-muted/20`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${selectedStep.color}`}>
                  <selectedStep.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary dark:text-primary">{selectedStep.title}</h3>
                  <p className="text-muted-foreground dark:text-muted-foreground/80">{selectedStep.description}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4 bg-background dark:bg-muted/5">
              <h4 className="font-medium text-lg">Key Features:</h4>
              <ul className="space-y-3">
                {selectedStep.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 mt-1 p-1 rounded-full ${selectedStep.color}`}>
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <p className="text-muted-foreground dark:text-muted-foreground/80">{detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
