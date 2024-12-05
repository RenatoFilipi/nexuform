import { BlockModel } from "@/helpers/models";
import { colorLabel, formStatus } from "@/helpers/types";
import { create } from "zustand";

interface SubmissionProps {
  id: string;
  name: string;
  description: string | null;
  theme: string;
  submitLabel: string;
  blocks: BlockModel[];
  status: formStatus;
  setId: (value: string) => void;
  setName: (value: string) => void;
  setDescription: (value: string | null) => void;
  setStatus: (value: formStatus) => void;
  setTheme: (value: colorLabel) => void;
  setSubmitLabel: (value: string) => void;
  setBlocks: (value: BlockModel[]) => void;
}

const useSubmissionStore = create<SubmissionProps>((set) => ({
  id: "",
  name: "",
  description: null,
  status: "draft",
  theme: "Slate",
  submitLabel: "Submit",
  blocks: [],
  setId: (value) => set({ id: value }),
  setName: (value) => set({ name: value }),
  setDescription: (value) => set({ description: value }),
  setStatus: (value) => set({ status: value }),
  setTheme: (value) => set({ theme: value }),
  setSubmitLabel: (value) => set({ submitLabel: value }),
  setBlocks: (newBlocks) => set(() => ({ blocks: newBlocks })),
}));

export default useSubmissionStore;
