import { EForm, EOrganization, ESubmissionLog, ESubscription, ETeamMemberProfile, EViewLog } from "@/utils/entities";
import { getDateRangeFromToday } from "@/utils/functions";
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
  setOrganizations: (p: EOrganization[]) => void;
  setSubscriptions: (p: ESubscription[]) => void;
  setTeamMemberProfiles: (p: ETeamMemberProfile[]) => void;
  setForms: (p: EForm[]) => void;
  setSubmissionLogs: (p: ESubmissionLog[]) => void;
  setViewLogs: (p: EViewLog[]) => void;
  setFrom: (p: Date) => void;
  setTo: (p: Date) => void;
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
  setOrganizations: (p) => set({ organizations: p }),
  setSubscriptions: (p) => set({ subscriptions: p }),
  setTeamMemberProfiles: (p) => set({ teamMemberProfiles: p }),
  setForms: (p) => set({ forms: p }),
  setSubmissionLogs: (p) => set({ submissionLogs: p }),
  setViewLogs: (p) => set({ viewLogs: p }),
  setFrom: (p) => set({ from: p }),
  setTo: (p) => set({ to: p }),
}));

export default usePlatformStore;
