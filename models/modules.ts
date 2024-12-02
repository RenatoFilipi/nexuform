import { block, formStatus, submissionStatus } from "@/helpers/types";

export interface FormItemProps {
  id: string;
  title: string;
  status: formStatus;
  views: number;
  submissions: number;
}

export interface FormSubmissionProps {
  id: string;
  form_id: string;
  sender: string;
  submitted_at: string;
  status: submissionStatus;
  answers: FormAnswerProps[];
}

export interface FormAnswerProps {
  id: string;
  block_id: string;
  type: block;
  answer: string;
}
