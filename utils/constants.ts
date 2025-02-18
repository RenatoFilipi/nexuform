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
import { IDesign, IPlanLanding } from "./interfaces";

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
const designTemplate: IDesign[] = [
  { label: "slate", tw_class: "" },
  { label: "gray", tw_class: "" },
  { label: "zinc", tw_class: "" },
  { label: "neutral", tw_class: "" },
  { label: "stone", tw_class: "" },
  { label: "red", tw_class: "" },
  { label: "orange", tw_class: "" },
  { label: "amber", tw_class: "" },
  { label: "yellow", tw_class: "" },
  { label: "lime", tw_class: "" },
  { label: "green", tw_class: "" },
  { label: "emerald", tw_class: "" },
  { label: "teal", tw_class: "" },
  { label: "cyan", tw_class: "" },
  { label: "sky", tw_class: "" },
  { label: "blue", tw_class: "" },
  { label: "indigo", tw_class: "" },
  { label: "violet", tw_class: "" },
  { label: "purple", tw_class: "" },
  { label: "fuchsia", tw_class: "" },
  { label: "pink", tw_class: "" },
  { label: "rose", tw_class: "" },
];
