import { createTranslator } from "use-intl/core";
import {
  basicForms,
  basicPricing,
  basicSubmissions,
  freeTrialForms,
  freeTrialPeriod,
  freeTrialPricing,
  freeTrialSubmissions,
  proForms,
  proPricing,
  proSubmissions,
} from "./envs";
import { IPlan } from "./interfaces";

export const getPlans = async (locale: string): Promise<IPlan[]> => {
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const t = createTranslator({ locale, messages });
  return [
    {
      name: t("app.label_plan_free_trial"),
      price: freeTrialPricing,
      type: "free_trial",
      isMostPopular: false,
      freeTrialDuration: freeTrialPeriod,
      features: [
        { description: t("app.feat_forms", { n: freeTrialForms }), comingSoon: false },
        { description: t("app.feat_submissions", { n: freeTrialSubmissions }), comingSoon: false },
        { description: t("app.feat_basic_support"), comingSoon: false },
        { description: t("app.feat_basic_analytics"), comingSoon: false },
      ],
      ctaButton: t("app.label_upgrade_now"),
      label: "Free Trial",
    },
    {
      name: t("app.label_plan_basic"),
      price: basicPricing,
      type: "basic",
      isMostPopular: false,
      freeTrialDuration: null,
      features: [
        { description: t("app.feat_forms", { n: basicForms }), comingSoon: false },
        { description: t("app.feat_submissions", { n: basicSubmissions }), comingSoon: false },
        { description: t("app.feat_basic_support"), comingSoon: false },
        { description: t("app.feat_basic_analytics"), comingSoon: false },
      ],
      ctaButton: t("app.label_upgrade_now"),
      label: "Basic",
    },
    {
      name: t("app.label_plan_pro"),
      price: proPricing,
      type: "pro",
      isMostPopular: true,
      freeTrialDuration: null,
      features: [
        { description: t("app.feat_forms", { n: proForms }), comingSoon: false },
        { description: t("app.feat_submissions", { n: proSubmissions }), comingSoon: false },
        { description: t("app.feat_priority_support"), comingSoon: false },
        { description: t("app.feat_remove_branding"), comingSoon: false },
        { description: t("app.feat_data_export"), comingSoon: false },
        { description: t("app.feat_forms_templates"), comingSoon: false },
        { description: t("app.feat_premium_analytics"), comingSoon: false },
      ],
      ctaButton: t("app.label_upgrade_now"),
      label: "Pro",
    },
  ];
};
export const getPlans2 = (locale: string): IPlan[] => {
  const plans: IPlan[] = [
    {
      name: "Free Trial",
      price: 0,
      type: "free_trial",
      isMostPopular: false,
      freeTrialDuration: 14,
      ctaButton: "Start Free Trial",
      label: "Free Trial",
      features: [
        { description: "Up to 3 forms", comingSoon: false },
        { description: "Up to 300 submissions", comingSoon: false },
        { description: "Basic support (48h response time)", comingSoon: false },
        { description: "Basic analytics (submission tracking)", comingSoon: false },
        { description: "Branding required", comingSoon: false },
        { description: "No team members", comingSoon: false },
      ],
    },
    {
      name: "Basic",
      price: 12,
      type: "basic",
      isMostPopular: false,
      freeTrialDuration: null,
      ctaButton: "Subscribe as Individual",
      label: "Starter",
      features: [
        { description: "Up to 5 forms", comingSoon: false },
        { description: "Up to 1,500 submissions per month", comingSoon: false },
        { description: "1 user included", comingSoon: false },
        { description: "Standard support (48h response time)", comingSoon: false },
        { description: "Basic analytics", comingSoon: false },
        { description: "CSV export", comingSoon: false },
        { description: "Branding required", comingSoon: false },
      ],
    },
    {
      name: "Pro",
      price: 35,
      type: "pro",
      isMostPopular: true,
      freeTrialDuration: null,
      ctaButton: "Subscribe for Team",
      label: "Pro",
      features: [
        { description: "Up to 15 forms", comingSoon: false },
        { description: "Up to 5,000 submissions per month", comingSoon: false },
        { description: "Includes up to 5 members (1 admin + 4 members)", comingSoon: false },
        { description: "$5/month per additional member", comingSoon: false },
        { description: "Priority support (12h response time)", comingSoon: false },
        { description: "Remove branding", comingSoon: false },
        { description: "Form templates", comingSoon: false },
        { description: "CSV export", comingSoon: false },
        { description: "Premium analytics", comingSoon: false },
      ],
    },
  ];

  return plans;
};
