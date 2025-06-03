import { Workout, WORKOUTS_COLLECTION } from "@/data/meta/models.js";
import { publicProcedure } from "@/trpc.js";

import z from "zod/v4";

export const setWorkoutPublicMutation = publicProcedure
  .input(
    z.object({
      _id: z.string(),
      userId: z.string(),
      name: z.string(),
      exercises: z.array(
        z.object({
          _id: z.string(),
          sorting: z.number(),
          numberOfSets: z.number(),
          noteText: z.string(),
        }),
      ),
    }),
  )
  .mutation(async ({ input: workout, ctx }) => {
    const collection = ctx.db.collection<Workout>(WORKOUTS_COLLECTION);

    const dbWorkout = await collection.findOne({ _id: workout._id });

    if (dbWorkout === null) {
      return new Error("The workout that you tried to edit does not exist.");
    }

    const newWorkout = {
      ...workout,
      sorting: dbWorkout.sorting,
      exercises: workout.exercises
        .map((e) => ({
          newE: e,
          oldE: dbWorkout.exercises.find((ex) => ex._id === e._id),
        }))
        .map(({ newE, oldE }) => ({
          ...newE,
          name: oldE!.name,
          equipmentInfo: oldE!.equipmentInfo,
          involvedMuscles: oldE!.involvedMuscles,
          showcaseImage: oldE!.showcaseImage,
          isUserExercise: oldE!.isUserExercise,
        })),
    };

    const res = await collection.updateOne(
      { _id: workout._id },
      { $set: { ...newWorkout } },
    );

    if (res.matchedCount === 0) {
      return new Error(
        "Sorry, the workout could not be updated in the database.",
      );
    }

    return newWorkout;
  });
