import { EForm, EProfile, ESubscription } from "@/utils/entities";
import { create } from "zustand";

interface user {
  profile: EProfile;
  subscription: ESubscription;
  formsCount: number;
  submissionsCount: number;
  email: string;
  locale: string;
  forms: EForm[];
  setProfile: (payload: EProfile) => void;
  setSubscription: (payload: ESubscription) => void;
  setFormsCount: (payload: number) => void;
  setSubmissionsCount: (payload: number) => void;
  setEmail: (payload: string) => void;
  setLocale: (payload: string) => void;
  setForms: (payload: EForm[]) => void;
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
    free_trial_due_date: null,
    stripe_customer_id: null,
  },
  subscription: {
    id: "",
    created_at: "",
    updated_at: "",
    billing_interval: "",
    due_date: "",
    plan: "",
    start_date: "",
    status: "",
    profile_id: "",
    stripe_subscription_id: null,
  },
  formsCount: 0,
  submissionsCount: 0,
  email: "",
  locale: "",
  forms: [],
  setProfile: (payload) => set({ profile: payload }),
  setSubscription: (payload) => set({ subscription: payload }),
  setFormsCount: (payload) => set({ formsCount: payload }),
  setSubmissionsCount: (payload) => set({ submissionsCount: payload }),
  setEmail: (payload) => set({ email: payload }),
  setLocale: (payload) => set({ locale: payload }),
  setForms: (payload) => set({ forms: payload }),
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
        free_trial_due_date: null,
        stripe_customer_id: null,
      },
      subscription: {
        id: "",
        created_at: "",
        updated_at: "",
        billing_interval: "",
        due_date: "",
        plan: "",
        start_date: "",
        status: "",
        profile_id: "",
        stripe_subscription_id: null,
      },
      formsCount: 0,
      submissionsCount: 0,
      email: "",
    }),
}));

export default useUserStore;
