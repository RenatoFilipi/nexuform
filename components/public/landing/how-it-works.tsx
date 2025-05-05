"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BarChartIcon, CheckIcon, DatabaseIcon, LayersIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const HowItWorks = () => {
  const t = useTranslations("landing");
  const steps = [
    {
      title: t("step1_label"),
      description: t("step1_desc"),
      icon: LayersIcon,
      details: [t("step1_topic1"), t("step1_topic2"), t("step1_topic3")],
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-100/80 dark:bg-blue-900/20",
    },
    {
      title: t("step2_label"),
      description: t("step2_desc"),
      icon: DatabaseIcon,
      details: [t("step2_topic1"), t("step2_topic2"), t("step2_topic3")],
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-100/80 dark:bg-purple-900/20",
    },
    {
      title: t("step3_label"),
      description: t("step3_desc"),
      icon: BarChartIcon,
      details: [t("step3_topic1"), t("step3_topic2"), t("step3_topic3")],
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-100/80 dark:bg-green-900/20",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/10 dark:from-background dark:to-muted/5 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
          <Badge className="bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30 px-4 py-1.5 text-sm font-medium shadow-sm">
            {t("nav_htw")}
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {t("htw_headline")}
          </h2>
          <p className="text-xl text-muted-foreground/90 dark:text-muted-foreground/70">{t("htw_subheadline")}</p>
        </div>

        {/* Horizontal cards showing all steps at once */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="group relative h-full" data-aos="fade-up" data-aos-delay={index * 100}>
              {/* Decorative element */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              />

              <Card className="h-full overflow-hidden border-0 shadow-lg dark:shadow-none dark:border dark:border-muted/20 bg-background/80 dark:bg-muted/5 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1">
                <div className={`p-6 ${step.bgColor} transition-colors duration-500`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${step.color} text-white shadow-md`}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground dark:text-foreground">{step.title}</h3>
                      <p className="text-muted-foreground dark:text-muted-foreground mt-1 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4 bg-background/80 dark:bg-muted/5">
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <li key={detail} className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 mt-1 p-1 rounded-full bg-gradient-to-br ${step.color} text-white`}>
                          <CheckIcon className="h-3 w-3" />
                        </div>
                        <p className="text-foreground/90 dark:text-foreground/80 text-sm">{detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
