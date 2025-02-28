import { EForm, EFormAnalytics, ESubmission } from "@/utils/entities";
import { create } from "zustand";

interface analytics {
  forms: EForm[];
  formsAnalytics: EFormAnalytics[];
  submissions: ESubmission[];
  setForms: (payload: EForm[]) => void;
  setFormAnalytics: (payload: EFormAnalytics[]) => void;
  setSubmissions: (payload: ESubmission[]) => void;
}

const useAnalyticsStore = create<analytics>((set) => ({
  forms: [],
  formsAnalytics: [],
  submissions: [],
  setForms: (payload) => set({ forms: payload }),
  setFormAnalytics: (payload) => set({ formsAnalytics: payload }),
  setSubmissions: (payload) => set({ submissions: payload }),
  reset: () => set({ forms: [], formsAnalytics: [], submissions: [] }),
}));

export default useAnalyticsStore;
