import { EBlock, EForm, ETheme } from "@/utils/entities";
import { TEditorView, TToolView } from "@/utils/types";
import { create } from "zustand";

interface editor {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
  originalBlocks: EBlock[];
  preview: boolean;
  editorView: TEditorView;
  toolView: TToolView;
  blockView: EBlock;
  setForm: (p: EForm) => void;
  setTheme: (p: ETheme) => void;
  setBlocks: (p: EBlock[]) => void;
  setOriginalBlocks: (p: EBlock[]) => void;
  addBlock: (p: EBlock) => void;
  updateBlock: (id: string, p: EBlock) => void;
  removeBlock: (id: string) => void;
  setPreview: (p: boolean) => void;
  setEditorView: (p: TEditorView) => void;
  setToolView: (p: TToolView) => void;
  setBlockView: (p: EBlock) => void;
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
  preview: false,
  editorView: "blocks",
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
  setForm: (p) => set({ form: p }),
  setTheme: (p) => set({ theme: p }),
  setBlocks: (p) => set({ blocks: p }),
  setOriginalBlocks: (p) => set({ originalBlocks: p }),
  addBlock: (p) => set((state) => ({ blocks: [...state.blocks, p] })),
  updateBlock: (id, p) => {
    set((state) => ({
      blocks: state.blocks.map((block) => (block.id === id ? p : block)),
    }));
  },
  removeBlock: (id) => {
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
    }));
  },
  setPreview: (p) => set({ preview: p }),
  setEditorView: (p) => set({ editorView: p }),
  setToolView: (p) => set({ toolView: p }),
  setBlockView: (p) => set({ blockView: p }),
  reset: () =>
    set({
      preview: false,
      editorView: "blocks",
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
