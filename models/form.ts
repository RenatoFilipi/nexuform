import { block, formStatus } from "@/helpers/types";

export interface FormModel {
  id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  primary_color: string;
  submit_label: string;
  blocks: BlockModel[];
  numeric_blocks: boolean;
  status: formStatus;
  views: number;
  responses: number;
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
  options: { id: string; text: string }[] | null;
  max_character_limit: number | null;
  min_character_limit: number | null;
  show_character_limit: boolean | null;
  position: number;
  max_rating: number | null;
  max_scale: number | null;
}
export interface SubmissionModel {}
