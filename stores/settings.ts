import { EProfile } from "@/utils/entities";
import { create } from "zustand";

interface settings {
  profile: EProfile;
  setProfile: (value: EProfile) => void;
}

const useSettingsStore = create<settings>((set) => ({
  profile: {
    id: "",
    avatar_url: "",
    first_name: "",
    last_name: "",
    updated_at: "",
    username: "",
    website: "",
    role: "member",
  },
  setProfile: (payload) => set({ profile: payload }),
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
      },
    }),
}));

export default useSettingsStore;
