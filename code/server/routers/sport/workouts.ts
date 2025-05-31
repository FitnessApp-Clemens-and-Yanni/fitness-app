import {
  ExerciseSnapshot,
  FINISHED_WORKOUTS_COLLECTION,
  FinishedWorkout,
  SNAPSHOTS_COLLECTION,
  Workout,
  WORKOUTS_COLLECTION,
} from "@/data/meta/models.js";
import { createTRPCRouter, publicProcedure } from "@/trpc.js";
import z from "zod";

import { OBJECT_ID_SCHEMA } from "@shared/zod-schemas/ObjectId.js";

export const WorkoutsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const collection = ctx.db.collection<Workout>(WORKOUTS_COLLECTION);
      const workouts = await collection
        .find({ userId: input.userId })
        .sort("sorting")
        .toArray();
      return workouts as Workout[];
    }),

  setWorkout: publicProcedure
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
    }),

  finishWorkout: publicProcedure
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
    }),
});
