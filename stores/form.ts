import { EBlock, EForm, EFormAnalytics, ESubmission } from "@/utils/entities";
import { create } from "zustand";

interface form {
  form: EForm;
  blocks: EBlock[];
  submissions: ESubmission[];
  formAnalytics: EFormAnalytics;
  setForm: (payload: EForm) => void;
  setBlocks: (payload: EBlock[]) => void;
  setSubmissions: (payload: ESubmission[]) => void;
  setFormAnalytics: (payload: EFormAnalytics) => void;
  reset: () => void;
}

const useFormStore = create<form>((set) => ({
  form: {
    id: "",
    created_at: "",
    updated_at: "",
    name: "",
    description: null,
    owner_id: "",
    status: "",
    submit_text: "Submit",
    public_url: "",
  },
  blocks: [],
  submissions: [],
  formAnalytics: {
    id: "",
    created_at: "",
    updated_at: "",
    form_id: "",
    profile_id: "",
    total_submissions: 0,
    total_views: 0,
    avg_completion_rate: null,
    avg_completion_time: null,
  },
  setForm: (payload) => set({ form: payload }),
  setBlocks: (payload) => set({ blocks: payload }),
  setSubmissions: (payload) => set({ submissions: payload }),
  setFormAnalytics: (payload) => set({ formAnalytics: payload }),
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
        submit_text: "Submit",
        public_url: "",
      },
      blocks: [],
      submissions: [],
      formAnalytics: {
        id: "",
        created_at: "",
        updated_at: "",
        form_id: "",
        profile_id: "",
        total_submissions: 0,
        total_views: 0,
        avg_completion_rate: null,
        avg_completion_time: null,
      },
    }),
}));

export default useFormStore;
