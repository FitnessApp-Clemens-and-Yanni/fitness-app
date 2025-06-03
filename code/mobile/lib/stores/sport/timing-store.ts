import { create } from "zustand";

export const useWorkoutTimingStore = create<{
  startTimestamp: number | undefined;
  setStartTimestamp: (val: number | undefined) => void;
  currentTimestamp: number | undefined;
  setCurrentTimestamp: (val: number | undefined) => void;
  stopTimes: () => void;
}>()((set) => ({
  startTimestamp: undefined,
  setStartTimestamp: (timestamp) =>
    set((state) => ({ ...state, startTimestamp: timestamp })),
  currentTimestamp: undefined,
  setCurrentTimestamp: (timestamp) =>
    set((state) => ({ ...state, currentTimestamp: timestamp })),
  stopTimes: () =>
    set((state) => ({
      ...state,
      startTimestamp: undefined,
      currentTimestamp: undefined,
    })),
}));
