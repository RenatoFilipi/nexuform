import { EBlock, EForm, ETheme } from "@/utils/entities";
import { TEditorView, TToolView } from "@/utils/types";
import { create } from "zustand";

interface editor {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
  blocksReadyOnly: EBlock[];
  preview: boolean;
  view: TEditorView;
  toolView: TToolView;
  blockView: EBlock;
  setForm: (payload: EForm) => void;
  setTheme: (payload: ETheme) => void;
  setBlocks: (payload: EBlock[]) => void;
  setBlocksReadyOnly: (payload: EBlock[]) => void;
  addBlock: (Payload: EBlock) => void;
  updateBlock: (id: string, payload: EBlock) => void;
  removeBlock: (id: string) => void;
  setPreview: (value: boolean) => void;
  setView: (value: TEditorView) => void;
  setToolView: (value: TToolView) => void;
  setBlockView: (value: EBlock) => void;
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
    submit_label: "Submit",
    public_url: "",
    success_title: "",
    success_description: "",
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
  blocksReadyOnly: [],
  preview: false,
  view: "blocks",
  toolView: "properties",
  blockView: {
    id: "",
    form_id: "",
    created_at: "",
    updated_at: "",
    name: "",
    description: "",
    is_identifier: false,
    max_char: null,
    min_char: null,
    max_date: null,
    max_scale: null,
    min_date: null,
    min_scale: null,
    options: null,
    placeholder: null,
    position: 0,
    rating: null,
    required: false,
    show_char: null,
    type: "",
  },
  setForm: (payload) => set({ form: payload }),
  setTheme: (payload) => set({ theme: payload }),
  setBlocks: (payload) => set({ blocks: payload }),
  setBlocksReadyOnly: (payload) => set({ blocksReadyOnly: payload }),
  addBlock: (payload) => set((state) => ({ blocks: [...state.blocks, payload] })),
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
  setView: (payload) => set({ view: payload }),
  setToolView: (payload) => set({ toolView: payload }),
  setBlockView: (payload) => set({ blockView: payload }),
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
        submit_label: "Submit",
        public_url: "",
        success_title: "",
        success_description: "",
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
      blocksReadyOnly: [],
      view: "blocks",
      preview: false,
      toolView: "properties",
      blockView: {
        id: "",
        form_id: "",
        created_at: "",
        updated_at: "",
        name: "",
        description: "",
        is_identifier: false,
        max_char: null,
        min_char: null,
        max_date: null,
        max_scale: null,
        min_date: null,
        min_scale: null,
        options: null,
        placeholder: null,
        position: 0,
        rating: null,
        required: false,
        show_char: null,
        type: "",
      },
    }),
}));

export default useEditorStore;
