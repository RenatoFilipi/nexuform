import { EBlock, EForm, ETheme } from "@/utils/entities";
import { create } from "zustand";

interface studio {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
  originalBlocks: EBlock[];
  setForm: (p: EForm) => void;
  setTheme: (p: ETheme) => void;
  setBlocks: (p: EBlock[]) => void;
  setOriginalBlocks: (p: EBlock[]) => void;
}

const useStudioStore = create<studio>((set) => ({
  form: {
    id: "",
    created_at: "",
    updated_at: "",
    name: "",
    description: null,
    owner_id: "",
    status: "",
    submit_label: "Submit",
    public_id: "",
    success_title: "",
    success_description: "",
    org_id: "",
  },
  theme: {
    id: "",
    created_at: "",
    updated_at: "",
    form_id: "",
    numeric_blocks: false,
    app_branding: true,
    uppercase_block_name: false,
    custom_primary_color: "#713AED",
  },
  blocks: [],
  originalBlocks: [],
  setForm: (p) => set({ form: p }),
  setTheme: (p) => set({ theme: p }),
  setBlocks: (p) => set({ blocks: p }),
  setOriginalBlocks: (p) => set({ originalBlocks: p }),
}));

export default useStudioStore;
