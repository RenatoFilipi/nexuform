import { EOrganization, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { create } from "zustand";

interface platform {
  organizations: EOrganization[];
  subscriptions: ESubscription[];
  teamMemberProfiles: ETeamMemberProfile[];
  setOrganizations: (p: EOrganization[]) => void;
  setSubscriptions: (p: ESubscription[]) => void;
  setTeamMemberProfiles: (p: ETeamMemberProfile[]) => void;
}

const usePlatformStore = create<platform>((set) => ({
  organizations: [],
  subscriptions: [],
  teamMemberProfiles: [],
  setOrganizations: (p) => set({ organizations: p }),
  setSubscriptions: (p) => set({ subscriptions: p }),
  setTeamMemberProfiles: (p) => set({ teamMemberProfiles: p }),
}));

export default usePlatformStore;
