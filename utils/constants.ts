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
import { IPlanLanding } from "./interfaces";

export const minWidth640 = "(min-width: 640px)";
export const minute = 1000 * 60;
export const day = 24 * 60 * 60 * 1000;
export const paginationRange = 8;
export const paginationFrom = 0;
export const paginationTo = paginationRange;
export const planSettings = {
  freeTrial: {
    period: freeTrialPeriod,
    pricing: freeTrialPricing,
    forms: freeTrialForms,
    submissions: freeTrialSubmissions,
  },
  basic: {
    pricing: basicPricing,
    forms: basicForms,
    submissions: basicSubmissions,
  },
  pro: {
    pricing: proPricing,
    forms: proForms,
    submissions: proSubmissions,
  },
};
export const plans: IPlanLanding[] = [
  {
    name: "Free Trial",
    price: freeTrialPricing,
    features: [
      `${freeTrialPeriod} days trial`,
      `${freeTrialForms} forms`,
      `${freeTrialSubmissions} submissions`,
      "Basic analytics (Submissions tracking)",
      "Email notifications",
    ],
    highlighted: false,
    type: "free_trial",
    buttonLabel: "Start Free Trial",
  },
  {
    name: "Basic",
    price: basicPricing,
    features: [
      `${basicForms} forms`,
      `${basicSubmissions} submissions`,
      "Basic support (24h response time)",
      "Basic analytics (Submissions tracking)",
      "Email notifications",
    ],
    highlighted: false,
    type: "basic",
    buttonLabel: "Upgrade to Basic",
  },
  {
    name: "Pro",
    price: proPricing,
    features: [
      `${proForms} forms`,
      `${proSubmissions} submissions`,
      "Priority support (6h response time)",
      "Premium analytics",
      "Remove Nebulaform branding",
      "Email notifications",
      "Integrations",
      "Data export (CSV)",
    ],
    highlighted: true,
    type: "pro",
    buttonLabel: "Upgrade to Pro",
  },
];
