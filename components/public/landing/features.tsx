"use client";

import { Badge } from "@/components/ui/badge";
import { BarChartIcon, BlocksIcon, DatabaseIcon, HexagonIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const Features = () => {
  const t = useTranslations("landing");
  const features = [
    {
      title: t("feat1_headline"),
      description: t("feat1_subheadline"),
      icon: BlocksIcon,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: t("feat2_headline"),
      description: t("feat2_subheadline"),
      icon: BarChartIcon,
      color: "text-purple-500 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      title: t("feat3_headline"),
      description: t("feat3_subheadline"),
      icon: DatabaseIcon,
      color: "text-green-500 bg-green-50 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: t("feat4_headline"),
      description: t("feat4_subheadline"),
      icon: HexagonIcon,
      color: "text-orange-500 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400",
    },
  ];

  return (
    <section
      id="features"
      className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 flex justify-center items-center w-full bg-background dark:bg-gradient-to-b dark:from-background dark:to-muted/10">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="text-primary border-primary/30 bg-primary/10 dark:bg-primary/20 dark:border-primary/50 px-3 py-1.5 text-sm font-medium">
            {t("nav_features")}
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{t("feat_headline")}</h2>
          <p className="text-lg text-muted-foreground dark:text-muted-foreground/80">{t("feat_subheadline")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border bg-background dark:border-muted/30 p-6 transition-all hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:border-primary/30 dark:hover:border-primary/50 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-primary/10" />

              <div className="relative z-10 space-y-4">
                <div
                  className={`inline-flex items-center justify-center p-3 rounded-lg ${feature.color} transition-colors`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground dark:text-muted-foreground/80">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
