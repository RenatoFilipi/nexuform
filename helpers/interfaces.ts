import { FormProgressModel } from "@/models/analytics";
import { appState, block, brand, colorLabel, formStatus, mode } from "./types";

export interface ColorProps {
  label: colorLabel;
  tw_class: string;
}
export interface BrandProps {
  className?: string;
  type: brand;
}
export interface FormItemProps {
  id: string;
  title: string;
  status: formStatus;
  responsesCount: number;
}

export interface FormSubmissionItemProps {
  id: string;
  form_id: string;
  sender: string;
  submitted_at: string;
  blocks: FormSubmissionBlockProps[];
}

export interface FormSubmissionBlockProps {
  id: string;
  block_id: string;
  type: block;
  value: string;
}

export interface AnalyticsCardProps {
  icon: JSX.Element;
  title: string;
  value: string;
  state: appState;
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
export interface FormGroupProps {
  mode: mode;
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
  response: string;
}
