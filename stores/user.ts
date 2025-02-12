import { EProfile, ESubscription } from "@/utils/entities";
import { create } from "zustand";

interface user {
  profile: EProfile;
  subscription: ESubscription;
  formsCount: number;
  submissionsCount: number;
  setProfile: (payload: EProfile) => void;
  setSubscription: (payload: ESubscription) => void;
  setFormsCount: (payload: number) => void;
  setSubmissionsCount: (payload: number) => void;
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
    full_name: "",
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
    profile_id: "",
  },
  formsCount: 0,
  submissionsCount: 0,
  setProfile: (payload) => set({ profile: payload }),
  setSubscription: (payload) => set({ subscription: payload }),
  setFormsCount: (payload) => set({ formsCount: payload }),
  setSubmissionsCount: (payload) => set({ submissionsCount: payload }),
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
        full_name: "",
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
        profile_id: "",
      },
    }),
}));

export default useUserStore;
