import { EForm, ESubmission_log, ETemplate, ETemplate_block } from "@/utils/entities";
import { create } from "zustand";

interface forms {
  forms: EForm[];
  templates: ETemplate[];
  templateBlocks: ETemplate_block[];
  submissionLogs: ESubmission_log[];
  setForms: (payload: EForm[]) => void;
  setTemplates: (payload: ETemplate[]) => void;
  setTemplateBlocks: (payload: ETemplate_block[]) => void;
  setSubmissionLogs: (payload: ESubmission_log[]) => void;
}

const useDashboardStore = create<forms>((set) => ({
  forms: [],
  templates: [],
  templateBlocks: [],
  submissionLogs: [],
  setForms: (payload) => set({ forms: payload }),
  setTemplates: (payload) => set({ templates: payload }),
  setTemplateBlocks: (payload) => set({ templateBlocks: payload }),
  setSubmissionLogs: (payload) => set({ submissionLogs: payload }),
  reset: () => set({ forms: [], templates: [], templateBlocks: [], submissionLogs: [] }),
}));

export default useDashboardStore;
