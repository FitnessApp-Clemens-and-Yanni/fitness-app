import { create } from "zustand";

export type Set = {
  idx: number;
  weightsInKg: number;
  repetitions: number;
};

export const useExerciseSetStore = create<{
  setsPerExercise: Map<string, Set[]>;
  upsertSetForExercise: (exerciseId: string, setToUpdate: Set) => void;
  reset: () => void;
}>()((set) => ({
  setsPerExercise: new Map(),
  upsertSetForExercise: (exerciseId, newSet) =>
    set((state) => {
      const el = state.setsPerExercise.get(exerciseId);

      const currentSet = el?.find((s) => s.idx === newSet.idx);

      if (currentSet === undefined) {
        state.setsPerExercise.set(exerciseId, [
          ...(state.setsPerExercise.get(exerciseId) ?? []),
          newSet,
        ]);
      } else if (el !== undefined) {
        const idx = el.findIndex((s) => s.idx === newSet.idx);
        el[idx] = newSet;
      }

      return { ...state };
    }),
  reset: () =>
    set((state) => {
      state.setsPerExercise.clear();
      return { ...state };
    }),
}));
