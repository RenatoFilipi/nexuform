export interface AnalyticsModel {
  forms_total: number;
  views_total: number;
  submissions_total: number;
  forms: FormProgressModel[];
}

export interface FormProgressModel {
  id: string;
  name: string;
  submissions: number;
}
