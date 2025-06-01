import { createTRPCRouter } from "@/trpc.js";
import { getAllPublicQuery } from "./getAllPublicQuery.js";
import { setWorkoutPublicMutation } from "./setWorkoutPublicMutation.js";
import { finishWorkoutPublicMutation } from "./finishWorkoutPublicMutation.js";

export const WorkoutsRouter = createTRPCRouter({
  getAll: getAllPublicQuery,
  setWorkout: setWorkoutPublicMutation,
  finishWorkout: finishWorkoutPublicMutation,
});
