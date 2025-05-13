import { MongoClient } from "mongodb";
import {
  ExerciseSnapshot,
  FINISHED_WORKOUTS_COLLECTION,
  FinishedWorkout,
  NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
  NutritionalValueOfDay,
  SNAPSHOTS_COLLECTION,
  TARGET_NUTRITIONAL_VALUE_COLLECTION,
  TargetNutritionalValue,
  Workout,
  WORKOUTS_COLLECTION,
} from "./models.js";
import { workouts } from "@/data/defaults/workoutData.js";
import { snapshots } from "@/data/defaults/snapshotsData.js";
import { configDotenv } from "dotenv";
import { targetNutritionalValue } from "@/data/defaults/targetNutritionalValueData.js";

configDotenv({ path: ".env" });
const client = new MongoClient(
  (process.env.IS_DEV ?? "no") === "yes"
    ? "mongodb://localhost:27017"
    : "mongodb://database:27017",
);

export const db = client.db();
ensureCollectionsInitializedAndPopulated();

async function ensureCollectionsInitializedAndPopulated() {
  const workoutsCollection = await db.createCollection<Workout>(
    WORKOUTS_COLLECTION,
  );
  const snapshotsCollection = await db.createCollection<ExerciseSnapshot>(
    SNAPSHOTS_COLLECTION,
  );

  await db.createCollection<FinishedWorkout>(FINISHED_WORKOUTS_COLLECTION);

  const targetNutritionalValueCollection =
    await db.createCollection<TargetNutritionalValue>(
      TARGET_NUTRITIONAL_VALUE_COLLECTION,
    );

  const nutritionalValueOfDayCollection =
    await db.createCollection<NutritionalValueOfDay>(
      NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
    );

  if ((await workoutsCollection.countDocuments()) === 0) {
    workoutsCollection.insertMany(workouts);
  }

  if ((await snapshotsCollection.countDocuments()) === 0) {
    snapshotsCollection.insertMany(snapshots);
  }

  if ((await targetNutritionalValueCollection.countDocuments()) === 0) {
    targetNutritionalValueCollection.insertMany(targetNutritionalValue);
  }
}
