import { create } from "zustand";

interface user {
  id: string;
  email: string;
  setId: (id: string) => void;
  setEmail: (email: string) => void;
  reset: () => void;
}

const useUserStore = create<user>((set) => ({
  id: "",
  email: "",
  setId: (id) => set({ id }),
  setEmail: (email) => set({ email }),
  reset: () => set({ id: "", email: "" }),
}));

export default useUserStore;
