import {
  AnalyticsModel,
  AnswerModel,
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
    description:
      "We value your feedback! Your insights help us improve our product and ensure it meets your needs.",
    numeric_blocks: true,
    status: "draft",
    submit_label: "Finish form",
    submissions: 1,
    views: 1,
    theme: "Emerald",
  },
  {
    id: "4a2b1f43-9cfd-42bd-b482-3ad8f50a994a",
    owner_id: "",
    created_at: "",
    updated_at: "",
    name: "Debug Report",
    description: "A form used to report and debug application issues.",
    numeric_blocks: true,
    status: "published",
    submit_label: "Submit Report",
    submissions: 1,
    views: 1,
    theme: "Blue",
  },
];
export const mockBlocks: BlockModel[] = [
  {
    id: "94a712ed-9e93-4298-824b-3e7fd1f3341d",
    form_id: "b68e83e3-f646-4ddd-8eac-2d7ce0abddf6",
    created_at: "2024-12-10T20:36:56.028Z",
    updated_at: "2024-12-10T20:36:56.028Z",
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
    type: "short_text",
    options: null,
    show_char: null,
  },
  {
    id: "b982735a-0c09-45a6-bf11-9ee6ab262f23",
    form_id: "b68e83e3-f646-4ddd-8eac-2d7ce0abddf6",
    created_at: "",
    updated_at: "",
    name: "Would you recommend this product to others?",
    description:
      "Share if you would suggest this product to friends, colleagues, or others. Explain your reasons",
    options: null,
    required: true,
    type: "custom_scale",
    placeholder: null,
    max_char: 100,
    min_char: 1,
    show_char: null,
    position: 2,
    rating: null,
    max_scale: null,
    min_scale: null,
  },
  {
    id: "a3f0b4b9-8bfa-4352-908e-25433c9d6b41",
    form_id: "5d6f3a93-6370-4b77-91d6-0c22a2bcf918",
    created_at: "2024-12-12T12:00:00Z",
    updated_at: "2024-12-12T12:00:00Z",
    name: "Game Genre",
    description: "Select the genre of the game you prefer.",
    type: "dropdown_menu",
    required: true,
    placeholder: "Choose a genre",
    options: [
      { id: "1", text: "Action" },
      { id: "2", text: "Adventure" },
      { id: "3", text: "RPG" },
      { id: "4", text: "Simulation" },
      { id: "5", text: "Strategy" },
    ],
    max_char: null,
    min_char: null,
    show_char: null,
    position: 1,
    rating: null,
    max_scale: null,
    min_scale: null,
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
    sender: "SUB-6N4USPYM3QIG",
    status: "not_reviewed",
  },
];
export const mockAnswers: AnswerModel[] = [
  {
    id: "e7bf67df-ebcb-42f5-8d42-a955d4f8dcc5",
    block_id: "94a712ed-9e93-4298-824b-3e7fd1f3341d",
    submission_id: "82f99639-1669-4da9-9b0e-afb2b3cf484e",
    answer:
      "I would rate the overall quality of the product as a 4 out of 5. The product is well-designed and performs reliably in most scenarios. The features are comprehensive and meet my needs effectively.",
  },
];
