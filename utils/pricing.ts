import { createTranslator } from "use-intl/core";
import {
  ADDITIONAL_MEMBER_PRICE,
  FREE_TRIAL_FORMS,
  FREE_TRIAL_MAX_MEMBERS,
  FREE_TRIAL_PERIOD,
  FREE_TRIAL_PRICE,
  FREE_TRIAL_SUBMISSIONS,
  PRO_FORMS,
  PRO_MAX_MEMBERS,
  PRO_PRICE,
  PRO_SUBMISSIONS,
  STARTER_FORMS,
  STARTER_MAX_MEMBERS,
  STARTER_PRICE,
  STARTER_SUBMISSIONS,
} from "./envs";

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
        amount: FREE_TRIAL_PRICE,
        annualAmount: FREE_TRIAL_PRICE,
      },
      features: [
        { description: t("pricing.free_trial_feat_01"), comingSoon: false },
        { description: t("pricing.free_trial_feat_02"), comingSoon: false },
        { description: t("pricing.free_trial_feat_03"), comingSoon: false },
        { description: t("pricing.free_trial_feat_04"), comingSoon: false },
      ],
      freeTrialDuration: FREE_TRIAL_PERIOD,
      isMostPopular: false,
      ctaLabel: t("pricing.free_trial_cta"),
      metadata: {
        stripePriceId: null,
        stripeProductId: null,
      },
      limits: {
        maxForms: FREE_TRIAL_FORMS,
        maxSubmissionsPerMonth: FREE_TRIAL_SUBMISSIONS,
        maxUsers: FREE_TRIAL_MAX_MEMBERS,
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
        amount: STARTER_PRICE,
        annualAmount: 115,
      },
      features: [
        { description: t("pricing.starter_feat_01"), comingSoon: false },
        { description: t("pricing.starter_feat_02"), comingSoon: false },
        { description: t("pricing.starter_feat_03"), comingSoon: false },
        { description: t("pricing.starter_feat_04"), comingSoon: false },
        { description: t("pricing.starter_feat_05"), comingSoon: false },
        { description: t("pricing.starter_feat_08"), comingSoon: false },
      ],
      freeTrialDuration: null,
      isMostPopular: true,
      ctaLabel: t("pricing.starter_cta"),
      metadata: {
        stripePriceId: null,
        stripeProductId: null,
      },
      limits: {
        maxForms: STARTER_FORMS,
        maxSubmissionsPerMonth: STARTER_SUBMISSIONS,
        maxUsers: STARTER_MAX_MEMBERS,
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
        amount: PRO_PRICE,
        annualAmount: 278,
      },
      features: [
        { description: t("pricing.pro_feat_01"), comingSoon: false },
        { description: t("pricing.pro_feat_02"), comingSoon: false },
        { description: t("pricing.pro_feat_03"), comingSoon: false },
        { description: t("pricing.pro_feat_04"), comingSoon: false },
        { description: t("pricing.pro_feat_05"), comingSoon: false },
        { description: t("pricing.pro_feat_08"), comingSoon: false },
        { description: t("pricing.pro_feat_06"), comingSoon: false },
        { description: t("pricing.pro_feat_07"), comingSoon: false },
        { description: t("pricing.pro_feat_10"), comingSoon: false },
      ],
      freeTrialDuration: null,
      isMostPopular: false,
      ctaLabel: t("pricing.pro_cta"),
      metadata: {
        stripePriceId: null,
        stripeProductId: null,
      },
      limits: {
        maxForms: PRO_FORMS,
        maxSubmissionsPerMonth: PRO_SUBMISSIONS,
        maxMembers: PRO_MAX_MEMBERS,
        additionalMemberPricePerMonth: ADDITIONAL_MEMBER_PRICE,
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
