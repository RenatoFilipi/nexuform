import { create } from "zustand";

interface analytics {}

const useAnalyticsStore = create<analytics>((set) => ({}));

export default useAnalyticsStore;
