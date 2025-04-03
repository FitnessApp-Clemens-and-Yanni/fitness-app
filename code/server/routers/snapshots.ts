import { createTRPCRouter, publicProcedure } from "@/trpc";
import z from "zod";

import { OBJECT_ID_SCHEMA } from "../../shared/build/zod-schemas/ObjectId";
import { ExerciseSnapshot, SNAPSHOTS_COLLECTION } from "@/data/meta/models";

export const SnapshotsRouter = createTRPCRouter({
  getExerciseDefaultsForWorkout: publicProcedure
    .input(
      z.object({
        _id: z.union([OBJECT_ID_SCHEMA, z.null()]),
      })
    )
    .query(async ({ input, ctx }) => {
      const collection =
        ctx.db.collection<ExerciseSnapshot>(SNAPSHOTS_COLLECTION);

      if (input._id === null) {
        return [];
      }

      const snapshot = await collection.findOne({ exerciseId: input._id });
      return snapshot === null
        ? []
        : [{ ...snapshot, _id: snapshot._id.toString() }];
    }),
});
