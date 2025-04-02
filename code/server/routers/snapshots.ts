import { snapshots } from "@/data/snapshotsData";

import { createTRPCRouter, publicProcedure } from "@/trpc";
import z from "zod";

import { OBJECT_ID_SCHEMA } from "../../shared/types/zod-schemas/ObjectId";

export const SnapshotsRouter = createTRPCRouter({
  getExerciseDefaultsForWorkout: publicProcedure
    .input(
      z.object({
        _id: z.union([OBJECT_ID_SCHEMA, z.null()]),
      })
    )
    .query(async ({ input }) => {
      if (input._id === null) {
        return [];
      }
      const idx = snapshots.findIndex((x) => x.exerciseId === input._id);
      return idx === -1 ? [] : [snapshots[idx]];
    }),
});
