import { FormProgressProps } from "@/models/analytics";
import { appState, block, colorLabel, formStatus } from "./types";

export interface ColorProps {
  label: colorLabel;
  tw_class: string;
}
export interface BrandProps {
  className?: string;
  type: "logo" | "logo_text";
}
export interface FormSubmissionItemProps {
  id: string;
  form_id: string;
  sender: string;
  submitted_at: string;
}
export interface AnalyticsCardProps {
  icon: JSX.Element;
  title: string;
  value: string;
  state: appState;
}
export interface ChartSubmissionsProps {
  forms: FormProgressProps[];
  state: appState;
}
export interface addBlockProps {
  type: block;
  name: string;
  icon: JSX.Element | null;
  enabled: boolean;
  description: string;
}
export interface FormGroupProps {
  mode: "preview" | "release";
}
export interface FormItemProps {
  id: string;
  title: string;
  status: formStatus;
  responsesCount: number;
}
export interface FormSettingsStatusProps {
  status: formStatus;
  label: string;
  description: string;
  icon: JSX.Element | null;
}
