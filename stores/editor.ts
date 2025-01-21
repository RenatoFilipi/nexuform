import { EBlock, EForm, ETheme } from "@/utils/entities";
import { create } from "zustand";

interface editor {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
  blocksReadyOnly: EBlock[];
  preview: boolean;
  setForm: (payload: EForm) => void;
  setTheme: (payload: ETheme) => void;
  setBlocks: (payload: EBlock[]) => void;
  setBlocksReadyOnly: (payload: EBlock[]) => void;
  addBlock: (Payload: EBlock) => void;
  updateBlock: (id: string, payload: EBlock) => void;
  removeBlock: (id: string) => void;
  setPreview: (value: boolean) => void;
  reset: () => void;
}

const useEditorStore = create<editor>((set) => ({
  form: {
    id: "",
    created_at: "",
    updated_at: "",
    name: "",
    description: null,
    owner_id: "",
    status: "",
    submit_text: "Submit",
  },
  theme: {
    id: "",
    created_at: "",
    updated_at: "",
    form_id: "",
    numeric_blocks: false,
    primary_color: "slate",
  },
  blocks: [],
  blocksReadyOnly: [],
  preview: false,
  setForm: (payload) => set({ form: payload }),
  setTheme: (payload) => set({ theme: payload }),
  setBlocks: (payload) => set({ blocks: payload }),
  setBlocksReadyOnly: (payload) => set({ blocksReadyOnly: payload }),
  addBlock: (payload) => {
    set((state) => ({ blocks: [...state.blocks, payload] }));
  },
  updateBlock: (id, payload) => {
    set((state) => ({
      blocks: state.blocks.map((block) => (block.id === id ? payload : block)),
    }));
  },
  removeBlock: (id) => {
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
    }));
  },
  setPreview: (value) => set({ preview: value }),
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
      },
      theme: {
        id: "",
        created_at: "",
        updated_at: "",
        form_id: "",
        numeric_blocks: false,
        primary_color: "slate",
      },
      blocks: [],
      blocksReadyOnly: [],
    }),
}));

export default useEditorStore;
