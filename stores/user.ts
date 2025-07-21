import { EProfile } from "@/utils/entities";
import { create } from "zustand";

interface user {
  locale: string;
  email: string;
  profile: EProfile;
  setLocale: (payload: string) => void;
  setEmail: (payload: string) => void;
  setProfile: (payload: EProfile) => void;
}

const useUserStore = create<user>((set) => ({
  email: "",
  locale: "",
  profile: {
    id: "",
    first_name: "",
    last_name: "",
    avatar_url: "",
    updated_at: "",
    username: "",
    website: "",
    role: "member",
    full_name: "",
    free_trial_due_date: null,
    stripe_customer_id: null,
    email: "",
  },
  setEmail: (payload) => set({ email: payload }),
  setLocale: (payload) => set({ locale: payload }),
  setProfile: (payload) => set({ profile: payload }),
}));

export default useUserStore;
