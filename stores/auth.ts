import { create } from "zustand";

interface auth {
  id: string;
  email: string;
  setId: (id: string) => void;
  setEmail: (email: string) => void;
  reset: () => void;
}

const useAuthStore = create<auth>((set) => ({
  id: "",
  email: "",
  setId: (id) => set({ id }),
  setEmail: (email) => set({ email }),
  reset: () => set({ id: "", email: "" }),
}));

export default useAuthStore;
