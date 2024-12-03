import { FormProgressModel } from "@/models/analytics";
import { appState, block, brand, colorLabel, formStatus } from "./types";

export interface ColorProps {
  label: colorLabel;
  tw_class: string;
}
export interface BrandProps {
  className?: string;
  type: brand;
}
export interface ChartSubmissionsProps {
  forms: FormProgressModel[];
  state: appState;
}
export interface addBlockProps {
  type: block;
  name: string;
  icon: JSX.Element | null;
  enabled: boolean;
  description: string;
}
export interface FormSettingsStatusProps {
  status: formStatus;
  label: string;
  description: string;
  icon: JSX.Element | null;
}
export interface BlockResponseProps {
  formId: string;
  name: string;
  answer: string;
}
