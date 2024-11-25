import { AnalyticsModel } from "@/models/analytics";
import { formSubmissionList } from "./forms";

export const AnalyticsContent: AnalyticsModel = {
  forms_total: 2,
  submissions_total: formSubmissionList.length,
  forms: [
    {
      id: "01b1c3c1-0993-4ba5-a53f-604b7708f6e4",
      name: "Product Evaluation",
      submissions: formSubmissionList.filter(
        (x) => x.form_id === "01b1c3c1-0993-4ba5-a53f-604b7708f6e4"
      ).length,
    },
    {
      id: "d9dd8f26-dabc-4f4c-bac3-facb19d621a8",
      name: "Course Feedback",
      submissions: formSubmissionList.filter(
        (x) => x.form_id === "d9dd8f26-dabc-4f4c-bac3-facb19d621a8"
      ).length,
    },
  ],
};
