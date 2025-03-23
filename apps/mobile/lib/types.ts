type WorkoutResponse = {
  _id: string;
  name: string;
  sorting: number;
  exercises: WorkoutExerciseResponse[];
};

type WorkoutExerciseResponse = {
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

type Workout = {
  _id: string;
  name: string;
  exercises: WorkoutExercise[];
};

type WorkoutExercise = {
  _id: string;
  name: string;
  numberOfSets: number;
  noteText: string;
  sorting: number;
};
