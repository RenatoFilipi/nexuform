import { EBlock, EForm, ESubmission } from "@/utils/entities";
import { create } from "zustand";

interface form {
  form: EForm;
  blocks: EBlock[];
  submissions: ESubmission[];
  setForm: (payload: EForm) => void;
  setBlocks: (payload: EBlock[]) => void;
  setSubmissions: (payload: ESubmission[]) => void;
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
  setForm: (payload) => set({ form: payload }),
  setBlocks: (payload) => set({ blocks: payload }),
  setSubmissions: (payload) => set({ submissions: payload }),
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
    }),
}));

export default useFormStore;
