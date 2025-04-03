export const WORKOUTS_COLLECTION = "workouts";

export type Workout = {
  _id: string;
  name: string;
  sorting: number;
  exercises: WorkoutExercise[];
};

export type WorkoutExercise = {
  _id: string;
  name: string;
  equipmentInfo: string;
  involvedMuscles: string[];
  showcaseImage: string;
  isUserExercise: boolean;
  numberOfSets: number;
  noteText: string;
  sorting: number;
};

export const SNAPSHOTS_COLLECTION = "exerciseSnapshots";

export type ExerciseSnapshot = {
  exerciseId: string;
  userId: null;
  exerciseDefaults: {
    sets: { weightsInKg: number; repetitions: number }[];
  };
};

export const FINISHED_WORKOUTS_COLLECTION = "finishedWorkouts";

export type FinishedWorkout = {
  workoutId: string;
  workoutName: string;
  totalTimeInMinutes: number;
  exercises: {
    id: string;
    sets: { weightsInKg: number; repetitions: number }[];
  }[];
};
