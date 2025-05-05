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
      color: "from-blue-400 to-blue-600",
      borderColor: "border-blue-400/20",
    },
    {
      title: t("feat2_headline"),
      description: t("feat2_subheadline"),
      icon: BarChartIcon,
      color: "from-purple-400 to-purple-600",
      borderColor: "border-purple-400/20",
    },
    {
      title: t("feat3_headline"),
      description: t("feat3_subheadline"),
      icon: DatabaseIcon,
      color: "from-green-400 to-green-600",
      borderColor: "border-green-400/20",
    },
    {
      title: t("feat4_headline"),
      description: t("feat4_subheadline"),
      icon: HexagonIcon,
      color: "from-orange-400 to-orange-600",
      borderColor: "border-orange-400/20",
    },
  ];

  return (
    <section
      id="features"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background dark:bg-gradient-to-b dark:from-background dark:to-muted/5 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-primary/10  blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
          <Badge className="bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30 px-4 py-1.5 text-sm font-medium shadow-sm">
            {t("nav_features")}
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {t("feat_headline")}
          </h2>
          <p className="text-xl text-muted-foreground/90 dark:text-muted-foreground">{t("feat_subheadline")}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border ${feature.borderColor} bg-background/70 dark:bg-muted/5 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 backdrop-blur-sm`}>
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br opacity-0 ${feature.color} group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Glow effect */}
              <div
                className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500`}
              />

              <div className="relative z-10 space-y-5">
                <div
                  className={`inline-flex items-center justify-center p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground/90 dark:text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
