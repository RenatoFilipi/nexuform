import { formStatus, submissionStatus } from "./types";

export interface FormProps {
  id: string;
  name: string;
  status: formStatus;
  views: number;
  submissions: number;
}
export interface SubmissionProps {
  id: string;
  form_id: string;
  sender: string;
  submitted_at: string;
  status: submissionStatus;
}
