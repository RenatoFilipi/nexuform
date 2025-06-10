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

export const plans: IPlan[] = [
  {
    name: "Free Trial",
    price: freeTrialPricing,
    type: "free_trial",
    isMostPopular: false,
    freeTrialDuration: freeTrialPeriod,
    features: [
      { description: `Up to ${freeTrialForms} forms`, comingSoon: false },
      { description: `Up to ${freeTrialSubmissions} submissions`, comingSoon: false },
      { description: "Basic support (24h response time)", comingSoon: false },
      { description: "Basic templates", comingSoon: false },
      { description: "Integrations", comingSoon: true },
      { description: "Email notifications", comingSoon: true },
    ],
    ctaButton: "Start Free Trial",
  },
  {
    name: "Basic",
    price: basicPricing,
    type: "basic",
    isMostPopular: false,
    freeTrialDuration: null,
    features: [
      { description: `Up to ${basicForms} forms`, comingSoon: false },
      { description: `Up to ${basicSubmissions} submissions`, comingSoon: false },
      { description: "Basic support (24h response time)", comingSoon: false },
      { description: "Basic analytics (Submissions tracking)", comingSoon: false },
      { description: "Basic templates", comingSoon: false },
      { description: "Integrations)", comingSoon: true },
      { description: "Email notifications", comingSoon: true },
    ],
    ctaButton: "Choose Basic Plan",
  },
  {
    name: "Pro",
    price: proPricing,
    type: "pro",
    isMostPopular: true,
    freeTrialDuration: null,
    features: [
      { description: `Up to ${proForms} forms`, comingSoon: false },
      { description: `Up to ${proSubmissions} submissions`, comingSoon: false },
      { description: "Priority support (6h response time)", comingSoon: false },
      { description: "Remove branding", comingSoon: false },
      { description: "Data export (CSV)", comingSoon: false },
      { description: "Premium templates", comingSoon: false },
      { description: "Premium analytics", comingSoon: true },
      { description: "Email notifications", comingSoon: true },
      { description: "Premium integrations", comingSoon: true },
      // { description: "More to come", comingSoon: false },
    ],
    ctaButton: "Choose Pro Plan",
  },
];

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
        // { description: t("app.feat_forms_templates"), comingSoon: false },
      ],
      ctaButton: t("app.label_upgrade_now"),
    },
    {
      name: t("app.label_plan_basic"),
      price: basicPricing,
      type: "basic",
      isMostPopular: true,
      freeTrialDuration: null,
      features: [
        { description: t("app.feat_forms", { n: basicForms }), comingSoon: false },
        { description: t("app.feat_submissions", { n: basicSubmissions }), comingSoon: false },
        { description: t("app.feat_basic_support"), comingSoon: false },
        { description: t("app.feat_basic_analytics"), comingSoon: false },
        // { description: t("app.feat_forms_templates"), comingSoon: false },
      ],
      ctaButton: t("app.label_upgrade_now"),
    },
    {
      name: t("app.label_plan_pro"),
      price: proPricing,
      type: "pro",
      isMostPopular: false,
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
    },
  ];
};
