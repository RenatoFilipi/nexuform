import { EProfile, ESubscription } from "@/utils/entities";
import { create } from "zustand";

interface user {
  profile: EProfile;
  subscription: ESubscription;
  setProfile: (payload: EProfile) => void;
  setSubscription: (payload: ESubscription) => void;
}

const useUserStore = create<user>((set) => ({
  profile: {
    id: "",
    first_name: "",
    last_name: "",
    avatar_url: "",
    updated_at: "",
    username: "",
    website: "",
    role: "member",
  },
  subscription: {
    id: "",
    created_at: "",
    updated_at: "",
    billing_interval: "",
    next_billing_date: "",
    plan: "",
    start_date: "",
    status: "",
    user_id: "",
  },
  setProfile: (payload) => set({ profile: payload }),
  setSubscription: (payload) => set({ subscription: payload }),
  reset: () =>
    set({
      profile: {
        id: "",
        avatar_url: "",
        first_name: "",
        last_name: "",
        updated_at: "",
        username: "",
        website: "",
        role: "member",
      },
      subscription: {
        id: "",
        created_at: "",
        updated_at: "",
        billing_interval: "",
        next_billing_date: "",
        plan: "",
        start_date: "",
        status: "",
        user_id: "",
      },
    }),
}));

export default useUserStore;
