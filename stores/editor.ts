import { BlockProps } from "@/models/form";
import { create } from "zustand";

interface FormStoreProps {
  id: string;
  setId: (value: string) => void;
  ownerId: string;
  setOwnerId: (value: string) => void;
  title: string;
  setTitle: (value: string) => void;
  description: string | null;
  setDescription: (value: string | null) => void;
  primaryColor: string;
  setPrimaryColor: (value: string) => void;
  background: string;
  setBackground: (value: string) => void;
  foreground: string;
  setForeground: (value: string) => void;
  submitLabel: string;
  setSubmitLabel: (value: string) => void;
  blocks: BlockProps[];
  addBlock: (value: BlockProps) => void;
  updateBlock: (id: string, value: BlockProps) => void;
  removeBlock: (id: string) => void;
}

const useEditorStore = create<FormStoreProps>((set) => ({
  id: "",
  setId: (value) => set({ id: value }),
  ownerId: "",
  setOwnerId: (value) => set({ ownerId: value }),
  title: "",
  setTitle: (value) => set({ title: value }),
  description: null,
  setDescription: (value) => set({ description: value }),
  primaryColor: "",
  setPrimaryColor: (value) => set({ primaryColor: value }),
  background: "",
  setBackground: (value) => set({ background: value }),
  foreground: "",
  setForeground: (value) => set({ foreground: value }),
  submitLabel: "",
  setSubmitLabel: (value) => set({ submitLabel: value }),
  blocks: [],
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
}));

export default useEditorStore;
