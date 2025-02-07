import { EProfile, ESubscription } from "@/utils/entities";
import { create } from "zustand";

interface user {
  profile: EProfile;
  subscription: ESubscription;
  formsQty: number;
  submissionsQty: number;
  setProfile: (payload: EProfile) => void;
  setSubscription: (payload: ESubscription) => void;
  setFormsQty: (payload: number) => void;
  setSubmissionsQty: (payload: number) => void;
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
  formsQty: 0,
  submissionsQty: 0,
  setProfile: (payload) => set({ profile: payload }),
  setSubscription: (payload) => set({ subscription: payload }),
  setFormsQty: (payload) => set({ formsQty: payload }),
  setSubmissionsQty: (payload) => set({ submissionsQty: payload }),
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
