import { FormItemProps } from "@/components/private/forms/form-item";
import { FormSubmissionItemProps } from "@/components/private/forms/form-submission-item";

export const formList: FormItemProps[] = [
  {
    id: "01b1c3c1-0993-4ba5-a53f-604b7708f6e4",
    title: "Product Evaluation",
    status: "published",
    responsesCount: 474,
  },
  {
    id: "d9dd8f26-dabc-4f4c-bac3-facb19d621a8",
    title: "Course Feedback",
    status: "draft",
    responsesCount: 317,
  },
];

export const formSubmissionList: FormSubmissionItemProps[] = [
  {
    id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
    form_id: "01b1c3c1-0993-4ba5-a53f-604b7708f6e4",
    email: "user1@example.com",
    submitted_at: new Date().toISOString(),
  },
  {
    id: "b2c3d4e5-f678-9012-3456-789abcdef123",
    form_id: "01b1c3c1-0993-4ba5-a53f-604b7708f6e4",
    email: "user2@example.com",
    submitted_at: new Date().toISOString(),
  },
  {
    id: "c3d4e5f6-7890-1234-5678-9abcdef12345",
    form_id: "01b1c3c1-0993-4ba5-a53f-604b7708f6e4",
    email: "user3@example.com",
    submitted_at: new Date().toISOString(),
  },
  {
    id: "d4e5f678-9012-3456-789a-bcdef1234567",
    form_id: "d9dd8f26-dabc-4f4c-bac3-facb19d621a8",
    email: "user4@example.com",
    submitted_at: new Date().toISOString(),
  },
  {
    id: "e5f67890-1234-5678-9abc-def123456789",
    form_id: "d9dd8f26-dabc-4f4c-bac3-facb19d621a8",
    email: "user5@example.com",
    submitted_at: new Date().toISOString(),
  },
  {
    id: "f6789012-3456-789a-bcde-f123456789ab",
    form_id: "d9dd8f26-dabc-4f4c-bac3-facb19d621a8",
    email: "user6@example.com",
    submitted_at: new Date().toISOString(),
  },
  {
    id: "67890123-4567-89ab-cdef-123456789abc",
    form_id: "d9dd8f26-dabc-4f4c-bac3-facb19d621a8",
    email: "user7@example.com",
    submitted_at: new Date().toISOString(),
  },
];
