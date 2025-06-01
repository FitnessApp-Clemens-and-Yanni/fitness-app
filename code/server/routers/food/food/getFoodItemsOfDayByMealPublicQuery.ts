import {
  MealEntry,
  NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
} from "@/data/meta/models.js";

import { NutritionalValueOfDay } from "@/data/meta/models.js";
import { publicProcedure } from "@/trpc.js";
import { MEAL_TYPE_SCHEMA } from "shared/build/zod-schemas/meal-type.js";
import z from "zod";

export const getFoodItemsOfDayByMealPublicQuery = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      date: z.date(),
      mealType: MEAL_TYPE_SCHEMA,
    }),
  )
  .query(async ({ ctx, input }) => {
    const collection = ctx.db.collection<NutritionalValueOfDay>(
      NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
    );

    const mealTypeMapping: Record<string, string> = {
      Breakfast: "breakfastMeals",
      Lunch: "lunchMeals",
      Dinner: "dinnerMeals",
      Snack: "snackMeals",
    };

    const mappedMealType = mealTypeMapping[input.mealType];

    if (!mappedMealType) {
      return new Error("Invalid meal type provided.");
    }

    const foodItems = await collection.findOne({
      userId: input.userId,
      "dayOfEntry.year": input.date.getFullYear(),
      "dayOfEntry.month": input.date.getMonth() + 1,
      "dayOfEntry.day": input.date.getDate(),
    });

    if (!foodItems) {
      return new Error("No food items found for the specified meal.");
    }

    return foodItems[
      mappedMealType as keyof NutritionalValueOfDay
    ] as MealEntry;
  });
