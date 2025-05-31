import {
  MealEntry,
  NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
  NutritionalValueOfDay,
  TARGET_NUTRITIONAL_VALUE_COLLECTION,
  TargetNutritionalValue,
} from "@/data/meta/models.js";
import { createTRPCRouter, publicProcedure } from "@/trpc.js";
import z from "zod";
import { calculateNewNutritionalValuesInDatabase } from "@/utils/nutritionCalculator.js";
import { MEAL_TYPE_SCHEMA } from "@/shared/zod-schemas/meal-type.js";

export const FoodRouter = createTRPCRouter({
  getTargetNutritionalValues: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const collection = ctx.db.collection<TargetNutritionalValue>(
        TARGET_NUTRITIONAL_VALUE_COLLECTION,
      );
      const targetValues = await collection.findOne({ userId: input.userId });
      return targetValues as TargetNutritionalValue;
    }),

  getNutritionalValuesOfDay: publicProcedure
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
    }),

  getFoodItemsOfDayByMeal: publicProcedure
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
    }),

  deleteFoodOfDayByMeal: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        date: z.date().default(() => new Date()),
        mealType: MEAL_TYPE_SCHEMA,
        foodName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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
        throw new Error("Invalid meal type provided.");
      }

      const result = await collection.updateOne(
        {
          userId: input.userId,
          "dayOfEntry.year": input.date.getFullYear(),
          "dayOfEntry.month": input.date.getMonth() + 1,
          "dayOfEntry.day": input.date.getDate(),
        },
        {
          $pull: {
            [`${mappedMealType}.foods`]: { name: input.foodName },
          },
        },
      );

      await calculateNewNutritionalValuesInDatabase(
        ctx.db,
        input.date,
        input.userId,
      );

      if (result.modifiedCount === 0) {
        return new Error("Food item not found or could not be deleted.");
      }

      return {
        success: true,
        message: `Successfully deleted ${input.foodName}`,
      };
    }),

  createEmptyDayEntry: publicProcedure
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
    }),
});
