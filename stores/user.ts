import { EForm, EOrganization, EProfile, ESubmissionLog, ESubscription, EViewLog } from "@/utils/entities";
import { IInvoiceSummary } from "@/utils/interfaces";
import { create } from "zustand";

interface user {
  profile: EProfile;
  subscription: ESubscription;
  formsCount: number;
  email: string;
  locale: string;
  forms: EForm[];
  submissionLogs: ESubmissionLog[];
  viewLogs: EViewLog[];
  organizations: EOrganization[];
  invoices: IInvoiceSummary[];
  setProfile: (payload: EProfile) => void;
  setSubscription: (payload: ESubscription) => void;
  setFormsCount: (payload: number) => void;
  setEmail: (payload: string) => void;
  setLocale: (payload: string) => void;
  setForms: (payload: EForm[]) => void;
  setSubmissionLogs: (paylaod: ESubmissionLog[]) => void;
  setViewLogs: (paylaod: EViewLog[]) => void;
  setOrganizations: (payload: EOrganization[]) => void;
  setInvoices: (payload: IInvoiceSummary[]) => void;
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
    email: "",
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
    forms: 0,
    submissions: 0,
    org_id: "",
    amount: 0,
  },
  formsCount: 0,
  email: "",
  locale: "",
  forms: [],
  submissionLogs: [],
  viewLogs: [],
  organizations: [],
  invoices: [],
  setProfile: (payload) => set({ profile: payload }),
  setSubscription: (payload) => set({ subscription: payload }),
  setFormsCount: (payload) => set({ formsCount: payload }),
  setEmail: (payload) => set({ email: payload }),
  setLocale: (payload) => set({ locale: payload }),
  setForms: (payload) => set({ forms: payload }),
  setSubmissionLogs: (payload) => set({ submissionLogs: payload }),
  setViewLogs: (payload) => set({ viewLogs: payload }),
  setOrganizations: (payload) => set({ organizations: payload }),
  setInvoices: (payload) => set({ invoices: payload }),
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
        email: "",
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
        forms: 0,
        submissions: 0,
        org_id: "",
        amount: 0,
      },
      organizations: [],
      formsCount: 0,
      email: "",
      submissionLogs: [],
      viewLogs: [],
    }),
}));

export default useUserStore;
