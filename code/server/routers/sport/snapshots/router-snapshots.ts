import { createTRPCRouter } from "@/trpc.js";
import { getExerciseDefaultsForWorkoutPublicQuery } from "./getExerciseDefaultsForWorkoutPublicQuery.js";

export const SnapshotsRouter = createTRPCRouter({
  getExerciseDefaultsForWorkout: getExerciseDefaultsForWorkoutPublicQuery,
});
