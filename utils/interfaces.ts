import type { JSX } from "react";
import { TBlock, TBrand, TColors, TFormStatus } from "./types";

export interface IDesign {
  label: TColors;
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
