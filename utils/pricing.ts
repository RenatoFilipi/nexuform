import { createTranslator } from "use-intl/core";

export type TPlan = "free_trial" | "starter" | "pro";
export type TBillingInterval = "month" | "year";

export interface IFeature {
  description: string;
  comingSoon: boolean;
}

export interface IPrice {
  amount: number;
  annualAmount: number;
}

export interface ILimits {
  maxForms?: number;
  maxSubmissionsPerMonth?: number;
  maxUsers?: number;
  maxMembers?: number;
  additionalMemberPricePerMonth?: number;
}

export interface IMetadata {
  stripePriceId: string | null;
  stripeProductId?: string | null;
}

export interface IPlan {
  id: string;
  name: string;
  description: string;
  type: TPlan;
  price: IPrice;
  features: IFeature[];
  freeTrialDuration: number | null;
  isMostPopular: boolean;
  ctaLabel: string;
  metadata: IMetadata;
  limits?: ILimits;
  recommendedFor?: string;
  billingIntervalOptions?: TBillingInterval[];
  isFree?: boolean;
  tags?: string[];
  comingSoon?: boolean;
}
export const getPlans = async (locale: string) => {
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const t = createTranslator({ locale, messages });

  const plans: IPlan[] = [
    {
      id: "free_trial",
      name: t("pricing.free_trial_name"),
      description: t("pricing.free_trial_description"),
      type: "free_trial",
      price: {
        amount: 0,
        annualAmount: 0,
      },
      features: [
        { description: t("pricing.free_trial_feat_01"), comingSoon: false },
        { description: t("pricing.free_trial_feat_02"), comingSoon: false },
        { description: t("pricing.free_trial_feat_03"), comingSoon: false },
        { description: t("pricing.free_trial_feat_04"), comingSoon: false },
        { description: t("pricing.free_trial_feat_05"), comingSoon: false },
      ],
      freeTrialDuration: 14,
      isMostPopular: false,
      ctaLabel: t("pricing.free_trial_cta"),
      metadata: {
        stripePriceId: null,
        stripeProductId: null,
      },
      limits: {
        maxForms: 2,
        maxSubmissionsPerMonth: 100,
        maxUsers: 1,
      },
      recommendedFor: t("pricing.free_trial_recommended_for"),
      billingIntervalOptions: ["month"],
      isFree: true,
      tags: ["trial"],
      comingSoon: false,
    },
    {
      id: "starter",
      name: t("pricing.starter_name"),
      description: t("pricing.starter_description"),
      type: "starter",
      price: {
        amount: 12,
        annualAmount: 115,
      },
      features: [
        { description: t("pricing.starter_feat_01"), comingSoon: false },
        { description: t("pricing.starter_feat_02"), comingSoon: false },
        { description: t("pricing.starter_feat_03"), comingSoon: false },
        { description: t("pricing.starter_feat_04"), comingSoon: false },
        { description: t("pricing.starter_feat_05"), comingSoon: false },
        { description: t("pricing.starter_feat_07"), comingSoon: false },
        // { description: t("pricing.starter_feat_06"), comingSoon: false },
      ],
      freeTrialDuration: null,
      isMostPopular: true,
      ctaLabel: t("pricing.starter_cta"),
      metadata: {
        stripePriceId: null,
        stripeProductId: null,
      },
      limits: {
        maxForms: 5,
        maxSubmissionsPerMonth: 1500,
        maxUsers: 1,
      },
      recommendedFor: t("pricing.starter_recommended_for"),
      billingIntervalOptions: ["month", "year"],
      isFree: false,
      tags: [],
      comingSoon: false,
    },
    {
      id: "pro",
      name: t("pricing.pro_name"),
      description: t("pricing.pro_description"),
      type: "pro",
      price: {
        amount: 29,
        annualAmount: 278,
      },
      features: [
        { description: t("pricing.pro_feat_01"), comingSoon: false },
        { description: t("pricing.pro_feat_02"), comingSoon: false },
        { description: t("pricing.pro_feat_03"), comingSoon: false },
        { description: t("pricing.pro_feat_04"), comingSoon: false },
        { description: t("pricing.pro_feat_05"), comingSoon: false },
        { description: t("pricing.pro_feat_06"), comingSoon: false },
        { description: t("pricing.pro_feat_07"), comingSoon: false },
        { description: t("pricing.pro_feat_08"), comingSoon: false },
        // { description: t("pricing.pro_feat_09"), comingSoon: true },
      ],
      freeTrialDuration: null,
      isMostPopular: false,
      ctaLabel: t("pricing.pro_cta"),
      metadata: {
        stripePriceId: null,
        stripeProductId: null,
      },
      limits: {
        maxForms: 15,
        maxSubmissionsPerMonth: 5000,
        maxMembers: 5,
        additionalMemberPricePerMonth: 5,
      },
      recommendedFor: t("pricing.pro_recommended_for"),
      billingIntervalOptions: ["month", "year"],
      isFree: false,
      tags: ["popular"],
      comingSoon: false,
    },
  ];

  return plans;
};
