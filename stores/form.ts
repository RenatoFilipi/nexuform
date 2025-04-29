import { day, paginationFrom, paginationTo } from "@/utils/constants";
import { EBlock, EForm, EFormAnalytics, ESubmission, ESubmissionLog, EViewLog } from "@/utils/entities";
import { IFormFilters, IPagination } from "@/utils/interfaces";
import { create } from "zustand";

interface form {
  form: EForm;
  blocks: EBlock[];
  submissions: ESubmission[];
  overviewSubmissions: ESubmission[];
  formAnalytics: EFormAnalytics;
  filters: IFormFilters;
  pagination: IPagination;
  forms: EForm[];
  submissionLogs: ESubmissionLog[];
  viewLogs: EViewLog[];
  setForm: (payload: EForm) => void;
  setBlocks: (payload: EBlock[]) => void;
  setSubmissions: (payload: ESubmission[]) => void;
  setOverviewSubmissions: (payload: ESubmission[]) => void;
  setFormAnalytics: (payload: EFormAnalytics) => void;
  setFilters: (payload: IFormFilters) => void;
  setPagination: (payload: IPagination) => void;
  setForms: (payload: EForm[]) => void;
  setSubmissionLogs: (paylaod: ESubmissionLog[]) => void;
  setViewLogs: (paylaod: EViewLog[]) => void;
  reset: () => void;
}

const to = new Date(Date.now() - 1 * day).toISOString();
const from = new Date(Date.now() - 24 * day).toISOString();

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
    nebulaform_branding: true,
    success_title: "",
    success_description: "",
    email_notifications: false,
    email_notifications_to: [],
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
  pagination: { from: paginationFrom, to: paginationTo },
  forms: [],
  submissionLogs: [],
  viewLogs: [],
  setForm: (payload) => set({ form: payload }),
  setBlocks: (payload) => set({ blocks: payload }),
  setSubmissions: (payload) => set({ submissions: payload }),
  setFormAnalytics: (payload) => set({ formAnalytics: payload }),
  setFilters: (payload) => set({ filters: payload }),
  setOverviewSubmissions: (payload) => set({ overviewSubmissions: payload }),
  setPagination: (payload) => set({ pagination: payload }),
  setForms: (payload) => set({ forms: payload }),
  setSubmissionLogs: (payload) => set({ submissionLogs: payload }),
  setViewLogs: (payload) => set({ viewLogs: payload }),
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
        nebulaform_branding: true,
        success_title: "",
        success_description: "",
        email_notifications: false,
        email_notifications_to: [],
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
      pagination: { from: paginationFrom, to: paginationTo },
      forms: [],
      submissionLogs: [],
      viewLogs: [],
    }),
}));

export default useFormStore;
