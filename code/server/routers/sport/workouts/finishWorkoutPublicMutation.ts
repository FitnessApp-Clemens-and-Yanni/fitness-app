import {
  FINISHED_WORKOUTS_COLLECTION,
  SNAPSHOTS_COLLECTION,
} from "@/data/meta/models.js";
import { FinishedWorkout } from "@/data/meta/models.js";
import { ExerciseSnapshot } from "@/data/meta/models.js";
import { publicProcedure } from "@/trpc.js";
import { OBJECT_ID_SCHEMA } from "shared/build/zod-schemas/ObjectId.js";
import z from "zod/v4";

export const finishWorkoutPublicMutation = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      workoutId: OBJECT_ID_SCHEMA,
      workoutName: z.string(),
      exercises: z.array(
        z.object({
          id: OBJECT_ID_SCHEMA,
          sets: z.array(
            z.object({
              weightsInKg: z.number(),
              repetitions: z.number(),
            }),
          ),
        }),
      ),
      totalTimeInMinutes: z.number(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    // I am adding the journal entry first because we would rather have a journal entry without a snapshot entry than otherwise
    const finishedWorkoutsCollection = ctx.db.collection<FinishedWorkout>(
      FINISHED_WORKOUTS_COLLECTION,
    );
    await finishedWorkoutsCollection.insertOne(input);

    //
    const snapshotsCollection =
      ctx.db.collection<ExerciseSnapshot>(SNAPSHOTS_COLLECTION);

    for (const exercise of input.exercises) {
      const res = await snapshotsCollection.updateOne(
        { exerciseId: exercise.id },
        { $set: { exerciseDefaults: { sets: exercise.sets } } },
      );

      if (res.matchedCount === 0) {
        return new Error(
          "Sorry, one of the exercises could not be updated in the snapshots collection on the database.",
        );
      }
    }
  });
