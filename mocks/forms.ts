import { FormItemProps, FormSubmissionItemProps } from "@/helpers/interfaces";
import { FormModel } from "@/models/form";

export const formSubmissionList: FormSubmissionItemProps[] = [
  {
    id: "35f94feb-ae0c-41a1-b425-83cb6f60df70",
    form_id: "4d6b48e1-5a1f-47c0-ae52-0eda19bed5e9",
    sender: "anonymous submission",
    submitted_at: new Date().toISOString(),
    blocks: [
      {
        id: "f6d8ff43-176a-4b0b-b0c7-f1571382d721",
        block_id: "42a272fd-1cc3-488e-8148-4381e4ffefeb",
        type: "long_answer",
        value:
          "I really appreciate how user-friendly the product is. The interface is intuitive, and I was able to get started right away without needing a lot of guidance. I also love the range of features it offers, especially the customization options that allow me to tailor the product to my needs.",
      },
    ],
  },
];
export const formSettingsList: FormModel[] = [
  {
    id: "4d6b48e1-5a1f-47c0-ae52-0eda19bed5e9",
    owner_id: "",
    name: "Product Feedback",
    description:
      "We value your feedback! Your insights help us improve our product and ensure it meets your needs.",
    blocks: [
      {
        id: "42a272fd-1cc3-488e-8148-4381e4ffefeb",
        form_id: "4d6b48e1-5a1f-47c0-ae52-0eda19bed5e9",
        created_at: "",
        updated_at: "",
        name: "What do you like most about the product?",
        description:
          "Share your favorite aspects of the product, such as specific features, design, or performance.",
        options: null,
        required: true,
        type: "long_answer",
        placeholder: null,
        max_character_limit: 400,
        min_character_limit: 1,
        show_character_limit: true,
        position: 1,
        max_rating: null,
        max_scale: null,
      },
    ],
    created_at: "",
    updated_at: "",
    numeric_blocks: true,
    primary_color: "Yellow",
    submit_label: "Send Response",
    status: "published",
  },
];
export const formList: FormItemProps[] = [
  {
    id: "4d6b48e1-5a1f-47c0-ae52-0eda19bed5e9",
    title: "Product Feedback",
    status: "published",
    responsesCount: 0,
  },
];
