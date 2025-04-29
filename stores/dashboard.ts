import { EForm, ETemplate, ETemplate_block } from "@/utils/entities";
import { create } from "zustand";

interface forms {
  forms: EForm[];
  templates: ETemplate[];
  templateBlocks: ETemplate_block[];
  setForms: (payload: EForm[]) => void;
  setTemplates: (payload: ETemplate[]) => void;
  setTemplateBlocks: (payload: ETemplate_block[]) => void;
}

const useDashboardStore = create<forms>((set) => ({
  forms: [],
  templates: [],
  templateBlocks: [],
  submissionLogs: [],
  setForms: (payload) => set({ forms: payload }),
  setTemplates: (payload) => set({ templates: payload }),
  setTemplateBlocks: (payload) => set({ templateBlocks: payload }),
  reset: () => set({ forms: [], templates: [], templateBlocks: [] }),
}));

export default useDashboardStore;
