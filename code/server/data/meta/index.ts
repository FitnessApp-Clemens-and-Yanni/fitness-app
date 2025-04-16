import { MongoClient } from "mongodb";
import {
  ExerciseSnapshot,
  FINISHED_WORKOUTS_COLLECTION,
  FinishedWorkout,
  SNAPSHOTS_COLLECTION, TARGET_NUTRITIONAL_VALUE_COLLECTION, TargetNutritionalValue,
  Workout,
  WORKOUTS_COLLECTION,
} from "./models";
import { workouts } from "../defaults/workoutData";
import { snapshots } from "../defaults/snapshotsData";
import { configDotenv } from "dotenv";
import {targetNutritionalValue} from "@/data/defaults/targerNutritionalValueData";

configDotenv({ path: ".env" });
const client = new MongoClient(process.env.DB_CONN_STRING!);

export const db = client.db();
ensureCollectionsInitializedAndPopulated();

async function ensureCollectionsInitializedAndPopulated() {
  const workoutsCollection = await db.createCollection<Workout>(
    WORKOUTS_COLLECTION
  );
  const snapshotsCollection = await db.createCollection<ExerciseSnapshot>(
    SNAPSHOTS_COLLECTION
  );

  await db.createCollection<FinishedWorkout>(FINISHED_WORKOUTS_COLLECTION);

  const targetNutritionalValueCollection = await db.createCollection<TargetNutritionalValue>(
      TARGET_NUTRITIONAL_VALUE_COLLECTION
  );

  if ((await workoutsCollection.countDocuments()) === 0) {
    workoutsCollection.insertMany(workouts);
  }

  if ((await snapshotsCollection.countDocuments()) === 0) {
    snapshotsCollection.insertMany(snapshots);
  }

  if(await targetNutritionalValueCollection.countDocuments() === 0) {
    targetNutritionalValueCollection.insertOne(targetNutritionalValue);
  }
}
