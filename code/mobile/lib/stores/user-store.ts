import { create } from "zustand";

export const POSSIBLE_USERS = ["gugi", "yanni"] as const;
export type PossibleUserId = (typeof POSSIBLE_USERS)[number];

export const useUserStore = create<{
  currentUser: PossibleUserId;
  setCurrentUser: (user: PossibleUserId) => void;
}>()((set) => ({
  currentUser: POSSIBLE_USERS[0],
  setCurrentUser: (user) => set((state) => ({ ...state, currentUser: user })),
}));
