import { BlockModel } from "@/helpers/models";
import { colorLabel, formStatus } from "@/helpers/types";
import { create } from "zustand";

interface SubmissionProps {
  id: string;
  name: string;
  description: string | null;
  status: formStatus;
  theme: string;
  submitLabel: string;
  numericBlocks: boolean;
  blocks: BlockModel[];
  setId: (value: string) => void;
  setName: (value: string) => void;
  setDescription: (value: string | null) => void;
  setStatus: (value: formStatus) => void;
  setTheme: (value: colorLabel) => void;
  setSubmitLabel: (value: string) => void;
  setNumericBlock: (value: boolean) => void;
  setBlocks: (value: BlockModel[]) => void;
  reset: () => void;
}

const useSubmissionStore = create<SubmissionProps>((set) => ({
  id: "",
  name: "",
  description: null,
  status: "draft",
  theme: "Slate",
  submitLabel: "Submit",
  numericBlocks: false,
  blocks: [],
  setId: (value) => set({ id: value }),
  setName: (value) => set({ name: value }),
  setDescription: (value) => set({ description: value }),
  setStatus: (value) => set({ status: value }),
  setTheme: (value) => set({ theme: value }),
  setSubmitLabel: (value) => set({ submitLabel: value }),
  setBlocks: (newBlocks) => set(() => ({ blocks: newBlocks })),
  setNumericBlock: (value) => set({ numericBlocks: value }),
  reset: () =>
    set({
      id: "",
      name: "",
      description: "",
      status: "draft",
      theme: "Slate",
      submitLabel: "Submit",
      numericBlocks: false,
      blocks: [],
    }),
}));

export default useSubmissionStore;
