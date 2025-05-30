import { EAnswer, EBlock, EForm, ESubmission, ETheme } from "@/utils/entities";
import { create } from "zustand";

interface submission {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
  submission: ESubmission;
  answers: EAnswer[];
  setForm: (payload: EForm) => void;
  setTheme: (payload: ETheme) => void;
  setBlocks: (payload: EBlock[]) => void;
  setSubmission: (payload: ESubmission) => void;
  setAnswers: (payload: EAnswer[]) => void;
  reset: () => void;
}

const usePublicStore = create<submission>((set) => ({
  form: {
    id: "",
    created_at: "",
    updated_at: "",
    name: "",
    description: null,
    owner_id: "",
    status: "",
    submit_label: "Submit",
    public_url: "",
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
  setForm: (payload) => set({ form: payload }),
  setTheme: (payload) => set({ theme: payload }),
  setBlocks: (payload) => set({ blocks: payload }),
  setSubmission: (payload) => set({ submission: payload }),
  setAnswers: (payload) => set({ answers: payload }),
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
        public_url: "",
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

export default usePublicStore;
