import { block, formStatus, submissionStatus } from "@/utils/types";

export interface FormModel {
  id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  theme: string;
  submit_label: string;
  numeric_blocks: boolean;
  status: formStatus;
  views: number;
  submissions: number;
  //uppercase_input_labels: boolean;
  //width: "centered" | "full";
  //remove_branding: boolean;
}
export interface BlockModel {
  id: string;
  form_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  type: block;
  required: boolean;
  placeholder: string | null;
  options: OptionModel[] | null;
  max_char: number | null;
  min_char: number | null;
  show_char: boolean | null;
  position: number;
  rating: number | null;
  max_scale: number | null;
  min_scale: number | null;
}
export interface OptionModel {
  id: string;
  text: string;
}
export interface SubmissionModel {
  id: string;
  form_id: string;
  sender: string;
  submitted_at: string;
  status: submissionStatus;
}
export interface AnswerModel {
  id: string;
  submission_id: string;
  block_id: string;
  answer: string;
}
export interface AnalyticsModel {
  total_forms: number;
  total_submissions: number;
  total_views: number;
}
