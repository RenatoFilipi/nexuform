import type { JSX } from "react";
import { TBlock, TBrand, TColor, TFilterSort, TFormStatus, TFormStatusExtended, TIntegrations, TPlan } from "./types";

export interface IDesign {
  label: TColor;
  tw_class: string;
}
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
}
export interface IFormStatus {
  status: TFormStatus;
  label: string;
  description: string;
  icon: JSX.Element | null;
}
export interface IFormFilters {
  from: string;
  to: string;
  status: TFormStatusExtended;
  sort: TFilterSort;
}
export interface IPlan {
  name: string;
  price: number;
  type: TPlan;
}
export interface IPlanLanding extends IPlan {
  features: string[];
  highlighted: boolean;
  buttonLabel: string;
}
export interface IIntegration {
  name: string;
  description: string;
  type: TIntegrations;
  icon: React.ReactNode;
  enabled: boolean;
  pro: boolean;
}
export interface IPagination {
  from: number;
  to: number;
}
