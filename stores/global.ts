import { day, paginationFrom, paginationTo } from "@/utils/constants";
import { EBlock, EForm, ESubmission, ESubmissionLog, EViewLog } from "@/utils/entities";
import { IPagination } from "@/utils/interfaces";
import { create } from "zustand";

interface global {
  form: EForm;
  forms: EForm[];
  submissionLogs: ESubmissionLog[];
  viewLogs: EViewLog[];
  blocks: EBlock[];
  submissions: ESubmission[];
  submissionPagination: IPagination;
  setForm: (payload: EForm) => void;
  setForms: (payload: EForm[]) => void;
  setSubmissionLogs: (paylaod: ESubmissionLog[]) => void;
  setViewLogs: (paylaod: EViewLog[]) => void;
  setBlocks: (payload: EBlock[]) => void;
  setSubmissions: (payload: ESubmission[]) => void;
  setSubmissionPagination: (payload: IPagination) => void;
}

const to = new Date(Date.now() - 1 * day).toISOString();
const from = new Date(Date.now() - 24 * day).toISOString();

const useGlobalStore = create<global>((set) => ({
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
  forms: [],
  submissionLogs: [],
  viewLogs: [],
  blocks: [],
  submissions: [],
  submissionPagination: { from: paginationFrom, to: paginationTo },
  setForm: (payload) => set({ form: payload }),
  setForms: (payload) => set({ forms: payload }),
  setSubmissionLogs: (payload) => set({ submissionLogs: payload }),
  setViewLogs: (payload) => set({ viewLogs: payload }),
  setBlocks: (payload) => set({ blocks: payload }),
  setSubmissions: (payload) => set({ submissions: payload }),
  setSubmissionPagination: (payload) => set({ submissionPagination: payload }),
}));

export default useGlobalStore;
