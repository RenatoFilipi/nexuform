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
      color: "text-blue-500 bg-blue-50",
    },
    {
      title: t("step2_label"),
      description: t("step2_desc"),
      icon: DatabaseIcon,
      details: [t("step2_topic1"), t("step2_topic2"), t("step2_topic3")],
      color: "text-purple-500 bg-purple-50",
    },
    {
      title: t("step3_label"),
      description: t("step3_desc"),
      icon: BarChartIcon,
      details: [t("step3_topic1"), t("step3_topic2"), t("step3_topic3")],
      color: "text-green-500 bg-green-50",
    },
  ];
  const [selectedStep, setSelectedStep] = useState(steps[0]);

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="text-primary border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium">
            {t("nav_htw")}
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{t("htw_headline")}</h2>
          <p className="text-lg text-muted-foreground">{t("htw_subheadline")}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Steps Navigation */}
          <div className="space-y-4">
            {steps.map((step) => (
              <button
                key={step.title}
                onClick={() => setSelectedStep(step)}
                className={`w-full text-left p-6 rounded-xl transition-all border-2 ${
                  selectedStep.title === step.title
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-transparent hover:border-muted-foreground/20 bg-background hover:shadow-sm"
                }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${step.color}`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Details Panel */}
          <Card className="h-full overflow-hidden border-0 shadow-lg">
            <div className={`p-6 ${selectedStep.color.replace("text-", "bg-").replace("500", "50")}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${selectedStep.color}`}>
                  <selectedStep.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">{selectedStep.title}</h3>
                  <p className="text-muted-foreground">{selectedStep.description}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h4 className="font-medium text-lg">Key Features:</h4>
              <ul className="space-y-3">
                {selectedStep.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 mt-1 p-1 rounded-full ${selectedStep.color}`}>
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <p className="text-muted-foreground">{detail}</p>
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
