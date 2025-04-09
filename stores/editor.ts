import { EBlock, EForm, ETheme } from "@/utils/entities";
import { TEditorView } from "@/utils/types";
import { create } from "zustand";

interface editor {
  form: EForm;
  theme: ETheme;
  blocks: EBlock[];
  blocksReadyOnly: EBlock[];
  preview: boolean;
  view: TEditorView;
  setForm: (payload: EForm) => void;
  setTheme: (payload: ETheme) => void;
  setBlocks: (payload: EBlock[]) => void;
  setBlocksReadyOnly: (payload: EBlock[]) => void;
  addBlock: (Payload: EBlock) => void;
  updateBlock: (id: string, payload: EBlock) => void;
  removeBlock: (id: string) => void;
  setPreview: (value: boolean) => void;
  setView: (value: TEditorView) => void;
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
    public_url: "",
    new_submission_notification: false,
    nebulaform_branding: true,
    success_title: "",
    success_description: "",
    email_notifications: false,
    email_notifications_to: [],
  },
  theme: {
    id: "",
    created_at: "",
    updated_at: "",
    form_id: "",
    numeric_blocks: false,
    primary_color: "slate",
    width: "centered",
    nebulaform_branding: true,
    uppercase_block_name: false,
    custom_primary_color: "713AED",
  },
  blocks: [],
  blocksReadyOnly: [],
  preview: false,
  view: "blocks",
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
  setView: (payload) => set({ view: payload }),
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
        new_submission_notification: false,
        nebulaform_branding: true,
        success_title: "",
        success_description: "",
        email_notifications: false,
        email_notifications_to: [],
      },
      theme: {
        id: "",
        created_at: "",
        updated_at: "",
        form_id: "",
        numeric_blocks: false,
        primary_color: "slate",
        width: "centered",
        nebulaform_branding: true,
        uppercase_block_name: false,
        custom_primary_color: "713AED",
      },
      blocks: [],
      blocksReadyOnly: [],
      view: "blocks",
      preview: false,
    }),
}));

export default useEditorStore;
