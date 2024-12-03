import { block, formStatus } from "@/helpers/types";

export interface FormModel {
  id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  theme: string;
  submit: string;
  numeric: boolean;
  status: formStatus;
  views: number;
  submissions: number;
  blocks: BlockModel[];
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
  max_char: number | null;
  min_char: number | null;
  position: number;
  rating: number | null;
  max_scale: number | null;
  min_scale: number | null;
}
export interface AnalyticsModel {
  total_forms: number;
  total_submissions: number;
  total_views: number;
  forms: { id: string; name: string; submissions: number }[];
}
