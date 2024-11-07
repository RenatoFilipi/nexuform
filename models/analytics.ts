export interface AnalyticsProps {
  forms_total: number;
  submissions_total: number;
  forms: FormProgressProps[];
}

export interface FormProgressProps {
  id: string;
  name: string;
  submissions: number;
}
