import { NUTRITIONAL_VALUE_OF_DAY_COLLECTION } from "@/data/meta/models.js";

import { NutritionalValueOfDay } from "@/data/meta/models.js";
import { publicProcedure } from "@/trpc.js";
import z from "zod/v4";

export const getNutritionalValuesOfDayPublicQuery = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      date: z.date(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const collection = ctx.db.collection<NutritionalValueOfDay>(
      NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
    );

    const year = input.date.getFullYear();
    const month = input.date.getMonth() + 1;
    const day = input.date.getDate();

    const dailyNutrition = await collection.findOne({
      userId: input.userId,
      "dayOfEntry.year": year,
      "dayOfEntry.month": month,
      "dayOfEntry.day": day,
    });

    if (!dailyNutrition) {
      return "NoEntries" as const;
    }

    return dailyNutrition as NutritionalValueOfDay;
  });
