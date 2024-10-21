import { block } from "@/helpers/types";

export interface FormProps {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  primary_color: string;
  background: string;
  foreground: string;
  submit_label: string;
  blocks: BlockProps[];
}

export interface BlockProps {
  id: string;
  name: string;
  description: string | null;
  type: block;
  required: boolean;
  options: { id: string; text: string }[] | null;
  placeholder: string | null;
  max_character_limit: number | null;
  min_character_limit: number | null;
  show_character_limit: boolean | null;
  position: number;
  max_rating: number | null;
  max_scale: number | null;
}
