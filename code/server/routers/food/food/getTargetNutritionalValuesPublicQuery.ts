import { TARGET_NUTRITIONAL_VALUE_COLLECTION } from "@/data/meta/models.js";
import { TargetNutritionalValue } from "@/data/meta/models.js";
import { publicProcedure } from "@/trpc.js";
import z from "zod/v4";

export const getTargetNutritionalValuesPublicQuery = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx, input }) => {
    const collection = ctx.db.collection<TargetNutritionalValue>(
      TARGET_NUTRITIONAL_VALUE_COLLECTION,
    );
    const targetValues = await collection.findOne({ userId: input.userId });
    return targetValues as TargetNutritionalValue;
  });
