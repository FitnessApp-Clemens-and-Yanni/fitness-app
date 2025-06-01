import { NutritionalValueOfDay } from "@/data/meta/models.js";

import { NUTRITIONAL_VALUE_OF_DAY_COLLECTION } from "@/data/meta/models.js";
import { publicProcedure } from "@/trpc.js";

import z from "zod";

export const createEmptyDayEntryPublicMutation = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      date: z.date(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const collection = ctx.db.collection<NutritionalValueOfDay>(
      NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
    );

    const emptyEntry: NutritionalValueOfDay = {
      userId: input.userId,
      caloriesInKcal: 0,
      proteinInG: 0,
      carbsInG: 0,
      fatsInG: 0,
      dayOfEntry: {
        year: input.date.getFullYear(),
        month: input.date.getMonth() + 1,
        day: input.date.getDate(),
      },
      breakfastMeals: {
        createdAt: Date.now(),
        foods: [],
      },
      lunchMeals: {
        createdAt: Date.now(),
        foods: [],
      },
      dinnerMeals: {
        createdAt: Date.now(),
        foods: [],
      },
      snackMeals: {
        createdAt: Date.now(),
        foods: [],
      },
    };

    await collection.insertOne(emptyEntry);

    return emptyEntry;
  });
