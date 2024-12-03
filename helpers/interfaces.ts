import { FormProgressModel } from "@/models/analytics";
import {
  appState,
  block,
  brand,
  colorLabel,
  formStatus,
  submissionStatus,
} from "./types";

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
  views: number;
  responses: number;
}
export interface FormSubmissionItemProps {
  id: string;
  form_id: string;
  sender: string;
  submitted_at: string;
  status: submissionStatus;
  blocks: FormSubmissionBlockProps[];
}
export interface FormSubmissionBlockProps {
  id: string;
  block_id: string;
  type: block;
  answer: string;
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
