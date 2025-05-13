import { MongoClient, ServerApiVersion } from "mongodb";
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
const client = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING!!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db();
    return db;
  } catch (error) {
    await client.close();
    throw error;
  }
}

export const db = await run();

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
