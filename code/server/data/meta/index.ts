import { MongoClient } from "mongodb";
import {
  ExerciseSnapshot,
  FINISHED_WORKOUTS_COLLECTION,
  FinishedWorkout,
  SNAPSHOTS_COLLECTION,
  Workout,
  WORKOUTS_COLLECTION,
} from "./models";
import { workouts } from "../defaults/workoutData";
import { snapshots } from "../defaults/snapshotsData";
import { configDotenv } from "dotenv";

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

  if ((await workoutsCollection.countDocuments()) === 0) {
    workoutsCollection.insertMany(workouts);
  }

  if ((await snapshotsCollection.countDocuments()) === 0) {
    snapshotsCollection.insertMany(snapshots);
  }
}
