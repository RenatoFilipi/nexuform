import {
  AnalyticsModel,
  BlockModel,
  FormModel,
  SubmissionModel,
} from "./models";

export const mockForms: FormModel[] = [
  {
    id: "b68e83e3-f646-4ddd-8eac-2d7ce0abddf6",
    owner_id: "",
    created_at: "",
    updated_at: "",
    name: "Product",
    description: null,
    numeric_blocks: true,
    status: "published",
    submit_label: "Submit",
    submissions: 1,
    views: 1,
    theme: "Slate",
  },
];
export const mockBlocks: BlockModel[] = [
  {
    id: "94a712ed-9e93-4298-824b-3e7fd1f3341d",
    form_id: "b68e83e3-f646-4ddd-8eac-2d7ce0abddf6",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: "How would you rate the overall quality of the product?",
    description:
      "Evaluate the product as a whole, considering its performance, features, and reliability.",
    max_char: null,
    max_scale: null,
    min_char: null,
    min_scale: null,
    placeholder: null,
    position: 1,
    rating: null,
    required: false,
    type: "short_answer",
    options: null,
    show_char: null,
  },
];
export const mockAnalytics: AnalyticsModel = {
  total_forms: 1,
  total_submissions: 1,
  total_views: 1,
};
export const mockSubmissions: SubmissionModel[] = [
  {
    id: "82f99639-1669-4da9-9b0e-afb2b3cf484e",
    form_id: "b68e83e3-f646-4ddd-8eac-2d7ce0abddf6",
    submitted_at: new Date().toISOString(),
    sender: "sub-6N4USPYM3QIG",
    status: "not_reviewed",
  },
];
