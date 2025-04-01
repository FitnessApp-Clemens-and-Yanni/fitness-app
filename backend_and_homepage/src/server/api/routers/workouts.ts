import { z } from "zod";
import { workouts } from "~/app/api/plans/workouts/workoutData";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const WorkoutsRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return workouts;
  }),

  setWorkout: publicProcedure
    .input(
      z.object({
        _id: z.string(),
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
    .mutation(async ({ input: workout }) => {
      const idx = workouts.findIndex((w) => w._id === workout._id);
      const newWorkout = {
        ...workout,
        sorting: workouts[idx]!.sorting,
        exercises: workout.exercises
          .map((e) => ({
            newE: e,
            oldE: workouts[idx]?.exercises.find((ex) => ex._id === e._id),
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

      workouts[idx] = newWorkout;

      return newWorkout;
    }),
});
