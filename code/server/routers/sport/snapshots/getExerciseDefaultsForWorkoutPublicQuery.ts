import { SNAPSHOTS_COLLECTION } from "@/data/meta/models.js";

import { ExerciseSnapshot } from "@/data/meta/models.js";
import { publicProcedure } from "@/trpc.js";
import { OBJECT_ID_SCHEMA } from "shared/build/zod-schemas/ObjectId.js";
import z from "zod/v4";

export const getExerciseDefaultsForWorkoutPublicQuery = publicProcedure
  .input(
    z.object({
      _id: z.union([OBJECT_ID_SCHEMA, z.null()]),
    }),
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
  });
