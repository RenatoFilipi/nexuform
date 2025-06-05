import { paginationFrom, paginationTo, qFinalDate, qInitDate } from "@/utils/constants";
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
  from: Date;
  to: Date;
  setForm: (payload: EForm) => void;
  setForms: (payload: EForm[]) => void;
  setSubmissionLogs: (paylaod: ESubmissionLog[]) => void;
  setViewLogs: (paylaod: EViewLog[]) => void;
  setBlocks: (payload: EBlock[]) => void;
  setSubmissions: (payload: ESubmission[]) => void;
  setSubmissionPagination: (payload: IPagination) => void;
  setFrom: (payload: Date) => void;
  setTo: (payload: Date) => void;
  resetDateControls: () => void;
}

const useGlobalStore = create<global>((set) => ({
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
  forms: [],
  submissionLogs: [],
  viewLogs: [],
  blocks: [],
  submissions: [],
  submissionPagination: { from: paginationFrom, to: paginationTo },
  from: qFinalDate,
  to: qInitDate,
  setForm: (payload) => set({ form: payload }),
  setForms: (payload) => set({ forms: payload }),
  setSubmissionLogs: (payload) => set({ submissionLogs: payload }),
  setViewLogs: (payload) => set({ viewLogs: payload }),
  setBlocks: (payload) => set({ blocks: payload }),
  setSubmissions: (payload) => set({ submissions: payload }),
  setSubmissionPagination: (payload) => set({ submissionPagination: payload }),
  setFrom: (payload) => set({ from: payload }),
  setTo: (payload) => set({ to: payload }),
  resetDateControls: () => ({ from: qFinalDate, to: qInitDate }),
}));

export default useGlobalStore;
