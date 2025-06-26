import { EAnswer, EBlock, EForm, EOrganization, ESubmission, ETheme } from "@/utils/entities";
import { create } from "zustand";

interface submission {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
  submission: ESubmission;
  answers: EAnswer[];
  organization: EOrganization;
  setForm: (p: EForm) => void;
  setTheme: (p: ETheme) => void;
  setBlocks: (p: EBlock[]) => void;
  setSubmission: (p: ESubmission) => void;
  setAnswers: (p: EAnswer[]) => void;
  setOrganization: (p: EOrganization) => void;
  reset: () => void;
}

const useSubmissionStore = create<submission>((set) => ({
  form: {
    id: "",
    created_at: "",
    updated_at: "",
    name: "",
    description: null,
    owner_id: "",
    status: "",
    submit_label: "Submit",
    public_id: "",
    success_title: "",
    success_description: "",
    org_id: "",
  },
  theme: {
    id: "",
    created_at: "",
    updated_at: "",
    form_id: "",
    numeric_blocks: false,
    app_branding: true,
    uppercase_block_name: false,
    custom_primary_color: "#713AED",
  },
  submission: {
    id: "",
    created_at: "",
    updated_at: "",
    form_id: "",
    identifier: "",
    status: "not_reviewed",
    completion_time: 0,
  },
  answers: [],
  blocks: [],
  organization: {
    created_at: "",
    id: "",
    name: "",
    owner_id: "",
    public_id: "",
    status: "",
    updated_at: "",
  },
  setForm: (p) => set({ form: p }),
  setTheme: (p) => set({ theme: p }),
  setBlocks: (p) => set({ blocks: p }),
  setSubmission: (p) => set({ submission: p }),
  setAnswers: (p) => set({ answers: p }),
  setOrganization: (p) => set({ organization: p }),
  reset: () =>
    set({
      form: {
        id: "",
        created_at: "",
        updated_at: "",
        name: "",
        description: null,
        owner_id: "",
        status: "",
        submit_label: "Submit",
        public_id: "",
        success_title: "",
        success_description: "",
        org_id: "",
      },
      theme: {
        id: "",
        created_at: "",
        updated_at: "",
        form_id: "",
        numeric_blocks: false,
        app_branding: true,
        uppercase_block_name: false,
        custom_primary_color: "#713AED",
      },
      submission: {
        id: "",
        created_at: "",
        updated_at: "",
        form_id: "",
        identifier: "",
        status: "not_reviewed",
        completion_time: 0,
      },
      answers: [],
      blocks: [],
    }),
}));

export default useSubmissionStore;
