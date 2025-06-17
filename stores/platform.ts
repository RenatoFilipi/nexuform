import { EOrganization, ESubscription } from "@/utils/entities";
import { create } from "zustand";

interface platform {
  organizations: EOrganization[];
  subscriptions: ESubscription[];
  setOrganizations: (p: EOrganization[]) => void;
  setSubscriptions: (p: ESubscription[]) => void;
}

const useOrganizationsStore = create<platform>((set) => ({
  organizations: [],
  subscriptions: [],
  setOrganizations: (p) => set({ organizations: p }),
  setSubscriptions: (p) => set({ subscriptions: p }),
}));

export default useOrganizationsStore;
