import { EForm } from "@/utils/entities";
import { create } from "zustand";

interface forms {
  forms: EForm[];
  setForms: (payload: EForm[]) => void;
}

const useFormsStore = create<forms>((set) => ({
  forms: [],
  setForms: (payload) => set({ forms: payload }),
  reset: () => set({ forms: [] }),
}));

export default useFormsStore;
