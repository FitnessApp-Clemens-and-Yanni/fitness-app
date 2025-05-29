import { create } from "zustand";

type Set = {
  exerciseId: string;
  setIndex: number;
  weightsInKg: number;
  repetitions: number;
};

export const useFinishedSetsStore = create<{
  finishedSets: Set[];
  addFinishedSet: (newSet: Set) => void;
  removeFinishedSet: (exerciseId: string, setIndex: number) => void;
  updateSetIfExists: (updatedSet: Set) => void;
  reset: () => void;
}>()((set) => ({
  finishedSets: [],

  addFinishedSet: (newSet) =>
    set((state) => ({ finishedSets: [...state.finishedSets, newSet] })),

  reset: () => set((state) => ({ finishedSets: [] })),

  removeFinishedSet: (exerciseId, setIndex) =>
    set((state) => ({
      finishedSets: state.finishedSets.filter(
        (x) => x.exerciseId !== exerciseId && x.setIndex !== setIndex,
      ),
    })),

  updateSetIfExists: (updatedSet) =>
    set((state) => {
      const oldSetIdx = state.finishedSets.findIndex(
        (s) =>
          s.exerciseId === updatedSet.exerciseId &&
          s.setIndex === updatedSet.setIndex,
      );

      if (oldSetIdx === -1) {
        return { ...state };
      }

      state.finishedSets[oldSetIdx] = updatedSet;

      return { ...state };
    }),
}));
