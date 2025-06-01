import { WORKOUTS_COLLECTION } from "@/data/meta/models.js";

import { Workout } from "@/data/meta/models.js";
import { publicProcedure } from "@/trpc.js";
import z from "zod";

export const getAllPublicQuery = publicProcedure
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
  });
