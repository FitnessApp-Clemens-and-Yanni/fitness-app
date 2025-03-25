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

type WorkoutPutRequest = {
  _id: string;
  name: string;
  exercises: WorkoutExercisePutRequest[];
};

type WorkoutExercisePutRequest = {
  _id: string;
  name: string;
  numberOfSets: number;
  noteText: string;
  sorting: number;
};

type ExerciseSnapshot = {
  exerciseId: string;
  userId: null;
  exerciseDefaults: {
    sets: { weightsInKg: number; repetitions: number }[];
  };
};
