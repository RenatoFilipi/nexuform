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
