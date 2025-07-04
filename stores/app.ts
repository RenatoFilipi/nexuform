import { paginationFrom, paginationTo } from "@/utils/constants";
import {
  EBlock,
  EForm,
  EOrganization,
  ESubmission,
  ESubmissionLog,
  ESubscription,
  ETeamMemberProfile,
  EViewLog,
} from "@/utils/entities";
import { getDateRangeFromToday } from "@/utils/functions";
import { IPagination } from "@/utils/interfaces";
import { create } from "zustand";

interface IProps {
  // arrays
  organizations: EOrganization[];
  subscriptions: ESubscription[];
  teamMemberProfiles: ETeamMemberProfile[];
  forms: EForm[];
  submissionLogs: ESubmissionLog[];
  viewLogs: EViewLog[];
  blocks: EBlock[];
  submissions: ESubmission[];

  setOrganizations: (p: EOrganization[]) => void;
  setSubscriptions: (p: ESubscription[]) => void;
  setTeamMemberProfiles: (p: ETeamMemberProfile[]) => void;
  setForms: (p: EForm[]) => void;
  setSubmissionLogs: (p: ESubmissionLog[]) => void;
  setViewLogs: (p: EViewLog[]) => void;
  setBlocks: (p: EBlock[]) => void;
  setSubmissions: (p: ESubmission[]) => void;

  // unit
  form: EForm;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  setForm: (p: EForm) => void;
  setOrganization: (p: EOrganization) => void;
  setSubscription: (p: ESubscription) => void;
  setTeamMemberProfile: (p: ETeamMemberProfile) => void;

  // utils
  from: Date;
  to: Date;
  submissionPagination: IPagination;
  setFrom: (p: Date) => void;
  setTo: (p: Date) => void;
  setSubmissionPagination: (p: IPagination) => void;
}

const dates = getDateRangeFromToday(7);

const useAppStore = create<IProps>((set) => ({
  // arrays
  forms: [],
  organizations: [],
  subscriptions: [],
  teamMemberProfiles: [],
  submissionLogs: [],
  viewLogs: [],
  blocks: [],
  submissions: [],
  setForms: (p) => set({ forms: p }),
  setOrganizations: (p) => set({ organizations: p }),
  setSubscriptions: (p) => set({ subscriptions: p }),
  setTeamMemberProfiles: (p) => set({ teamMemberProfiles: p }),
  setSubmissionLogs: (p) => set({ submissionLogs: p }),
  setViewLogs: (p) => set({ viewLogs: p }),
  setBlocks: (p) => set({ blocks: p }),
  setSubmissions: (p) => set({ submissions: p }),

  // unit
  form: {
    id: "",
    created_at: "",
    updated_at: "",
    name: "",
    description: null,
    owner_id: "",
    status: "",
    submit_label: "Submit",
    public_id: "",
    success_title: "",
    success_description: "",
    org_id: "",
  },
  organization: {
    created_at: "",
    id: "",
    name: "",
    owner_id: "",
    public_id: "",
    status: "",
    updated_at: "",
    created_at_signup: false,
  },
  subscription: {
    created_at: "",
    updated_at: "",
    id: "",
    org_id: "",
    profile_id: "",
    plan: "",
    amount: 0,
    billing_interval: "",
    due_date: "",
    forms: 0,
    start_date: "",
    status: "",
    stripe_subscription_id: null,
    submissions: 0,
  },
  teamMemberProfile: {
    created_at: "",
    updated_at: "",
    id: "",
    name: "",
    org_id: "",
    profile_id: "",
    permissions: [],
    role: "",
    last_name: "",
    email: "",
  },
  setForm: (p) => set({ form: p }),
  setOrganization: (p) => set({ organization: p }),
  setSubscription: (p) => set({ subscription: p }),
  setTeamMemberProfile: (p) => set({ teamMemberProfile: p }),

  // utils
  from: dates.startDate,
  to: dates.endDate,
  submissionPagination: { from: paginationFrom, to: paginationTo },
  setFrom: (p) => set({ from: p }),
  setTo: (p) => set({ to: p }),
  setSubmissionPagination: (p) => set({ submissionPagination: p }),
}));

export default useAppStore;
