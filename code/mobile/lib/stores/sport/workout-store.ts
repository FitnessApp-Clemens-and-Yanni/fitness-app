import { create } from "zustand";

export const useWorkoutStore = create<{
  selectedWorkout: WorkoutPutRequest | undefined;
  setSelectedWorkout: (workout: WorkoutPutRequest | undefined) => void;
  selectedExercise: WorkoutExercisePutRequest | undefined;
  setSelectedExercise: (
    exercise: WorkoutExercisePutRequest | undefined,
  ) => void;
}>()((set) => ({
  selectedWorkout: undefined,
  setSelectedWorkout: (workout) =>
    set((state) => ({ ...state, selectedWorkout: workout })),
  selectedExercise: undefined,
  setSelectedExercise: (exercise) =>
    set((state) => ({ ...state, selectedExercise: exercise })),
}));
