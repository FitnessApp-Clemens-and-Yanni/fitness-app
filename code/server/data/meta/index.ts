import { MongoClient } from "mongodb";
import {
  ExerciseSnapshot,
  SNAPSHOTS_COLLECTION,
  Workout,
  WORKOUTS_COLLECTION,
} from "./models";
import { workouts } from "../defaults/workoutData";
import { snapshots } from "../defaults/snapshotsData";

const client = new MongoClient("mongodb://database-fitness-app-mongodb:27017");

export const db = client.db();
ensureCollectionsInitializedAndPopulated();

async function ensureCollectionsInitializedAndPopulated() {
  const workoutsCollection = await db.createCollection<Workout>(
    WORKOUTS_COLLECTION
  );
  const snapshotsCollection = await db.createCollection<ExerciseSnapshot>(
    SNAPSHOTS_COLLECTION
  );

  if ((await workoutsCollection.countDocuments()) === 0) {
    workoutsCollection.insertMany(workouts);
  }

  if ((await snapshotsCollection.countDocuments()) === 0) {
    snapshotsCollection.insertMany(snapshots);
  }
}
