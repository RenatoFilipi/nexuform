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

interface platform {
  organizations: EOrganization[];
  subscriptions: ESubscription[];
  teamMemberProfiles: ETeamMemberProfile[];
  forms: EForm[];
  submissionLogs: ESubmissionLog[];
  viewLogs: EViewLog[];
  from: Date;
  to: Date;
  blocks: EBlock[];
  submissions: ESubmission[];
  submissionPagination: IPagination;
  setOrganizations: (p: EOrganization[]) => void;
  setSubscriptions: (p: ESubscription[]) => void;
  setTeamMemberProfiles: (p: ETeamMemberProfile[]) => void;
  setForms: (p: EForm[]) => void;
  setSubmissionLogs: (p: ESubmissionLog[]) => void;
  setViewLogs: (p: EViewLog[]) => void;
  setFrom: (p: Date) => void;
  setTo: (p: Date) => void;
  setBlocks: (p: EBlock[]) => void;
  setSubmissions: (p: ESubmission[]) => void;
  setSubmissionPagination: (p: IPagination) => void;
}

const dates = getDateRangeFromToday(7);

const usePlatformStore = create<platform>((set) => ({
  organizations: [],
  subscriptions: [],
  teamMemberProfiles: [],
  forms: [],
  submissionLogs: [],
  viewLogs: [],
  from: dates.startDate,
  to: dates.endDate,
  blocks: [],
  submissions: [],
  submissionPagination: { from: paginationFrom, to: paginationTo },
  setOrganizations: (p) => set({ organizations: p }),
  setSubscriptions: (p) => set({ subscriptions: p }),
  setTeamMemberProfiles: (p) => set({ teamMemberProfiles: p }),
  setForms: (p) => set({ forms: p }),
  setSubmissionLogs: (p) => set({ submissionLogs: p }),
  setViewLogs: (p) => set({ viewLogs: p }),
  setFrom: (p) => set({ from: p }),
  setTo: (p) => set({ to: p }),
  setBlocks: (p) => set({ blocks: p }),
  setSubmissions: (p) => set({ submissions: p }),
  setSubmissionPagination: (p) => set({ submissionPagination: p }),
}));

export default usePlatformStore;
