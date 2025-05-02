import type { JSX } from "react";
import { EBlock, EForm, ETheme } from "./entities";
import { TBlock, TBrand, TPlan, TTemplateCategory } from "./types";

export interface IBrand {
  className?: string;
  type: TBrand;
}
export interface IBlockData {
  type: TBlock;
  name: string;
  icon: JSX.Element | null;
  enabled: boolean;
  description: string;
  category: string;
}
export interface IPagination {
  from: number;
  to: number;
}
export interface IFormTemplate {
  id: string;
  enabled: boolean;
  category: TTemplateCategory;
  name: string;
  description: string;
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
  pro: boolean;
}
export interface FormSubmission {
  formId: string;
  name: string;
  count: number;
  percentage: number;
}

export interface IPlan {
  name: string;
  price: number;
  type: TPlan;
  isMostPopular: boolean;
  freeTrialDuration: number | null;
  features: IPlanFeatures[];
  ctaButton: string;
}
export interface IPlanFeatures {
  description: string;
  comingSoon: boolean;
}
export interface IBlockViewSettings {
  block: TBlock;
  showIsIdentifier: boolean;
  showName: boolean;
  showDescription: boolean;
  showPlaceholder: boolean;
  showMaxChar: boolean;
  showMinChar: boolean;
  showMaxDate: boolean;
  showMinDate: boolean;
  showMaxScale: boolean;
  showMinScale: boolean;
  showOptions: boolean;
  showPosition: boolean;
  showRating: boolean;
  showRequired: boolean;
  showChar: boolean;
}
