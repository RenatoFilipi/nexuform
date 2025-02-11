import { EBlock, EForm, EFormAnalytics, ESubmission } from "@/utils/entities";
import { IFormFilters } from "@/utils/interfaces";
import { create } from "zustand";

interface form {
  form: EForm;
  blocks: EBlock[];
  submissions: ESubmission[];
  overviewSubmissions: ESubmission[];
  formAnalytics: EFormAnalytics;
  filters: IFormFilters;
  setForm: (payload: EForm) => void;
  setBlocks: (payload: EBlock[]) => void;
  setSubmissions: (payload: ESubmission[]) => void;
  setOverviewSubmissions: (payload: ESubmission[]) => void;
  setFormAnalytics: (payload: EFormAnalytics) => void;
  setFilters: (payload: IFormFilters) => void;
  reset: () => void;
}

const to = new Date().toISOString();
const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

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
    new_submission_notification: false,
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
  overviewSubmissions: [],
  filters: { from, to, sort: "ascending", status: "all" },
  setForm: (payload) => set({ form: payload }),
  setBlocks: (payload) => set({ blocks: payload }),
  setSubmissions: (payload) => set({ submissions: payload }),
  setFormAnalytics: (payload) => set({ formAnalytics: payload }),
  setFilters: (payload) => set({ filters: payload }),
  setOverviewSubmissions: (payload) => set({ overviewSubmissions: payload }),
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
        new_submission_notification: false,
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
