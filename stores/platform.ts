import { EForm, EOrganization, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { create } from "zustand";

interface platform {
  organizations: EOrganization[];
  subscriptions: ESubscription[];
  teamMemberProfiles: ETeamMemberProfile[];
  forms: EForm[];
  setOrganizations: (p: EOrganization[]) => void;
  setSubscriptions: (p: ESubscription[]) => void;
  setTeamMemberProfiles: (p: ETeamMemberProfile[]) => void;
  setForms: (p: EForm[]) => void;
}

const usePlatformStore = create<platform>((set) => ({
  organizations: [],
  subscriptions: [],
  teamMemberProfiles: [],
  forms: [],
  setOrganizations: (p) => set({ organizations: p }),
  setSubscriptions: (p) => set({ subscriptions: p }),
  setTeamMemberProfiles: (p) => set({ teamMemberProfiles: p }),
  setForms: (p) => set({ forms: p }),
}));

export default usePlatformStore;
