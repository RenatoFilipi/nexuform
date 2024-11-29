import { AnalyticsModel } from "@/models/analytics";
import { formList, formSubmissionList } from "./forms";

export const AnalyticsContent: AnalyticsModel = {
  forms_total: formList.length,
  submissions_total: formSubmissionList.length,
  views_total: 4,
  forms: [
    {
      id: "4d6b48e1-5a1f-47c0-ae52-0eda19bed5e9",
      name: "Product Feedback",
      submissions: 1,
    },
  ],
};
