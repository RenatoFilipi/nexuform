import { block } from "@/helpers/types";

export interface FormProps {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  primary_color: string;
  background: string;
  foreground: String;
  submit_label: string;
  blocks: BlockProps[];
}

export interface BlockProps {
  id: string;
  question: string;
  description: string | null;
  type: block;
  required: boolean;
  options: string[] | null;
}
