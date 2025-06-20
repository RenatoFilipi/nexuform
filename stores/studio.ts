import { create } from "zustand";

interface studio {}

const useStudioStore = create<studio>((set) => ({}));

export default useStudioStore;
