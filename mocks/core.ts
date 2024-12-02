import { FormItemProps, FormSubmissionProps } from "@/models/modules";

export const mockFormItens: FormItemProps[] = [
  {
    id: "b68e83e3-f646-4ddd-8eac-2d7ce0abddf6",
    status: "draft",
    submissions: 0,
    views: 0,
    title: "Product",
  },
];
export const mockFormSubmissions: FormSubmissionProps[] = [
  {
    id: "355d1fdf-725e-4a9a-85bd-6cf1de750454",
    form_id: "b68e83e3-f646-4ddd-8eac-2d7ce0abddf6",
    sender: "sub-6N4USPYM3QIG",
    status: "not_reviewed",
    submitted_at: new Date().toISOString(),
    answers: [],
  },
];
