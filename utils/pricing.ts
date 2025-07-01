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

export const plans = (): IPlan[] => [
  {
    id: "free_trial",
    name: "Free Trial",
    description: "Explore core features for 14 days. Upgrade required to keep forms active.",
    type: "free_trial",
    price: {
      amount: 0,
      annualAmount: 0,
    },
    features: [
      { description: "Up to 2 forms", comingSoon: false },
      { description: "Up to 100 submissions per month", comingSoon: false },
      { description: "1 user included", comingSoon: false },
      { description: "Basic support (48h response time)", comingSoon: false },
      { description: "Branding required", comingSoon: false },
    ],
    freeTrialDuration: 14,
    isMostPopular: false,
    ctaLabel: "Start free 14-day trial",
    metadata: {
      stripePriceId: null,
      stripeProductId: null,
    },
    limits: {
      maxForms: 2,
      maxSubmissionsPerMonth: 100,
      maxUsers: 1,
    },
    recommendedFor: "Experiment and test core features",
    billingIntervalOptions: ["month"],
    isFree: true,
    tags: ["trial"],
    comingSoon: false,
  },
  {
    id: "starter",
    name: "Starter",
    description: "Ideal for solo creators and freelancers who need essential form capabilities",
    type: "starter",
    price: {
      amount: 12,
      annualAmount: 115,
    },
    features: [
      { description: "Up to 5 forms", comingSoon: false },
      { description: "Up to 1,500 submissions per month", comingSoon: false },
      { description: "1 user included", comingSoon: false },
      { description: "Standard support (24h response time)", comingSoon: false },
      { description: "Basic analytics", comingSoon: false },
      { description: "CSV export", comingSoon: false },
      { description: "Branding required", comingSoon: false },
    ],
    freeTrialDuration: null,
    isMostPopular: false,
    ctaLabel: "Upgrade to Starter",
    metadata: {
      stripePriceId: null,
      stripeProductId: null,
    },
    limits: {
      maxForms: 5,
      maxSubmissionsPerMonth: 1500,
      maxUsers: 1,
    },
    recommendedFor: "Solo creators and freelancers",
    billingIntervalOptions: ["month", "year"],
    isFree: false,
    tags: [],
    comingSoon: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Designed for small teams and growing businesses with collaboration needs",
    type: "pro",
    price: {
      amount: 29,
      annualAmount: 278,
    },
    features: [
      { description: "Up to 15 forms", comingSoon: false },
      { description: "Up to 5,000 submissions per month", comingSoon: false },
      { description: "Includes up to 5 members (1 admin + 4 members)", comingSoon: false },
      { description: "Priority support (6h response time)", comingSoon: false },
      { description: "Remove branding", comingSoon: false },
      { description: "Form templates", comingSoon: false },
      { description: "CSV export", comingSoon: false },
      { description: "Premium analytics", comingSoon: false },
      { description: "$5/month per additional member", comingSoon: true },
    ],
    freeTrialDuration: null,
    isMostPopular: true,
    ctaLabel: "Upgrade to Pro",
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
    recommendedFor: "Small teams and growing businesses",
    billingIntervalOptions: ["month", "year"],
    isFree: false,
    tags: ["popular"],
    comingSoon: false,
  },
];
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
        { description: t("pricing.starter_feat_06"), comingSoon: false },
        { description: t("pricing.starter_feat_07"), comingSoon: false },
      ],
      freeTrialDuration: null,
      isMostPopular: false,
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
        { description: t("pricing.pro_feat_09"), comingSoon: true },
      ],
      freeTrialDuration: null,
      isMostPopular: true,
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
