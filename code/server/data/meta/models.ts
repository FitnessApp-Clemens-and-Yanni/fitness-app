export const WORKOUTS_COLLECTION = "workouts";

export type Workout = {
  _id: string;
  userId: string;
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
  userId: string;
  workoutId: string;
  workoutName: string;
  totalTimeInMinutes: number;
  exercises: {
    id: string;
    sets: { weightsInKg: number; repetitions: number }[];
  }[];
};

export const TARGET_NUTRITIONAL_VALUE_COLLECTION = "TargetNutritionalValues";

export type TargetNutritionalValue = {
  userId: string;
  caloriesInKcal: number;
  proteinInG: number;
  carbsInG: number;
  fatsInG: number;
};

export const NUTRITIONAL_VALUE_OF_DAY_COLLECTION = "NutritionalValueOfDays";

export type NutritionalValueOfDay = {
  userId: string;
  dayOfEntry: DateOnly;
  caloriesInKcal: number;
  proteinInG: number;
  carbsInG: number;
  fatsInG: number;

  breakfastMeals: MealEntry;
  lunchMeals: MealEntry;
  dinnerMeals: MealEntry;
  snackMeals: MealEntry;
};

export const MEAL_ENTRIES_COLLECTION = "MealEntries";

export type MealEntry = {
  createdAt: number;
  foods: {
    name: string;
    weightInG: number;

    caloriesInKcal: number;
    proteinInG: number;
    carbsInG: number;
    fatsInG: number;
  }[];
};

type DateOnly = {
  year: number;
  month: number;
  day: number;
};

export type FoodItem = {
  food_name: string;
  food_description: string;
  food_id: string;
};

export type SearchFoodResult = {
  foods: {
    food: FoodItem[] | FoodItem;
  };
};
