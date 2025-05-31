import { WorkoutPutRequest } from "@/lib/types";
import { create } from "zustand";

export const useWorkoutEditStore = create<{
  workoutBeingEdited: WorkoutPutRequest | undefined;
  setWorkoutBeingEdited: (workout: WorkoutPutRequest | undefined) => void;
}>()((set) => ({
  workoutBeingEdited: undefined,
  setWorkoutBeingEdited: (workout) =>
    set((state) => ({ ...state, workoutBeingEdited: workout })),
}));
