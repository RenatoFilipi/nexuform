import { BlockModel } from "@/utils/models";
import { colorLabel, formStatus } from "@/utils/types";
import { create } from "zustand";

interface EditorProps {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  theme: string;
  submitLabel: string;
  blocks: BlockModel[];
  status: formStatus;
  numericBlocks: boolean;
  setId: (value: string) => void;
  setOwnerId: (value: string) => void;
  setName: (value: string) => void;
  setDescription: (value: string | null) => void;
  setTheme: (value: colorLabel) => void;
  setSubmitLabel: (value: string) => void;
  setBlocks: (value: BlockModel[]) => void;
  addBlock: (value: BlockModel) => void;
  updateBlock: (id: string, value: BlockModel) => void;
  removeBlock: (id: string) => void;
  setStatus: (value: formStatus) => void;
  setNumericBlock: (value: boolean) => void;
  reset: () => void;
}

const useEditorStore = create<EditorProps>((set) => ({
  id: "",
  ownerId: "",
  name: "",
  description: null,
  theme: "Slate",
  submitLabel: "Submit",
  blocks: [],
  status: "draft",
  numericBlocks: false,
  setId: (value) => set({ id: value }),
  setOwnerId: (value) => set({ ownerId: value }),
  setName: (value) => set({ name: value }),
  setDescription: (value) => set({ description: value }),
  setTheme: (value) => set({ theme: value }),
  setSubmitLabel: (value) => set({ submitLabel: value }),
  setBlocks: (newBlocks) => set(() => ({ blocks: newBlocks })),
  addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
  updateBlock: (id, updatedBlock) =>
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? updatedBlock : block
      ),
    })),
  removeBlock: (id) =>
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
    })),
  setStatus: (value) => set({ status: value }),
  setNumericBlock: (value) => set({ numericBlocks: value }),
  reset: () =>
    set({
      id: "",
      ownerId: "",
      name: "",
      description: null,
      theme: "Slate",
      submitLabel: "Submit",
      blocks: [],
      status: "draft",
      numericBlocks: false,
    }),
}));

export default useEditorStore;
