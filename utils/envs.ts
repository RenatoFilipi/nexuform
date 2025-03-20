export const freeTrialPeriod = Number(process.env.NEXT_PUBLIC_PLAN_FREE_TRIAL_PERIOD) ?? 14;
export const freeTrialPricing = Number(process.env.NEXT_PUBLIC_PLAN_FREE_TRIAL_PRICING) ?? 0;
export const freeTrialForms = Number(process.env.NEXT_PUBLIC_PLAN_FREE_TRIAL_FORMS) ?? 2;
export const freeTrialSubmissions = Number(process.env.NEXT_PUBLIC_PLAN_FREE_TRIAL_SUBMISSIONS) ?? 200;

export const basicPricing = Number(process.env.NEXT_PUBLIC_PLAN_BASIC_PRICING) ?? 7;
export const basicForms = Number(process.env.NEXT_PUBLIC_PLAN_BASIC_FORMS) ?? 5;
export const basicSubmissions = Number(process.env.NEXT_PUBLIC_PLAN_BASIC_SUBMISSIONS) ?? 1000;

export const proPricing = Number(process.env.NEXT_PUBLIC_PLAN_PRO_PRICING) ?? 15;
export const proForms = Number(process.env.NEXT_PUBLIC_PLAN_PRO_FORMS) ?? 10;
export const proSubmissions = Number(process.env.NEXT_PUBLIC_PLAN_PRO_SUBMISSIONS) ?? 3000;
