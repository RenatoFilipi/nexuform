import { colorLabel, formStatus } from "@/helpers/types";
import { BlockProps } from "@/models/form";
import { create } from "zustand";

interface FormStoreProps {
  id: string;
  setId: (value: string) => void;
  ownerId: string;
  setOwnerId: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  description: string | null;
  setDescription: (value: string | null) => void;
  primaryColor: string;
  setPrimaryColor: (value: colorLabel) => void;
  submitLabel: string;
  setSubmitLabel: (value: string) => void;
  blocks: BlockProps[];
  setBlocks: (value: BlockProps[]) => void;
  addBlock: (value: BlockProps) => void;
  updateBlock: (id: string, value: BlockProps) => void;
  removeBlock: (id: string) => void;
  status: formStatus;
  setStatus: (value: formStatus) => void;
}

const useEditorStore = create<FormStoreProps>((set) => ({
  id: "",
  setId: (value) => set({ id: value }),
  ownerId: "",
  setOwnerId: (value) => set({ ownerId: value }),
  name: "",
  setName: (value) => set({ name: value }),
  description: null,
  setDescription: (value) => set({ description: value }),
  primaryColor: "Slate",
  setPrimaryColor: (value) => set({ primaryColor: value }),
  submitLabel: "Submit",
  setSubmitLabel: (value) => set({ submitLabel: value }),
  blocks: [],
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
  status: "draft",
  setStatus: (value) => set({ status: value }),
}));

export default useEditorStore;
