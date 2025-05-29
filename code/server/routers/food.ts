import {
  MealEntry,
  NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
  NutritionalValueOfDay,
  TARGET_NUTRITIONAL_VALUE_COLLECTION,
  TargetNutritionalValue,
} from "@/data/meta/models.js";
import { createTRPCRouter, publicProcedure } from "@/trpc.js";
import z from "zod";

export const FoodRouter = createTRPCRouter({
  getTargetNutritionalValues: publicProcedure.query(async ({ ctx }) => {
    const collection = ctx.db.collection<TargetNutritionalValue>(
      TARGET_NUTRITIONAL_VALUE_COLLECTION,
    );
    const targetValues = await collection.findOne();
    return targetValues as TargetNutritionalValue;
  }),

  getNutritionalValuesOfDay: publicProcedure
    .input(
      z.object({
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
        "dayOfEntry.year": year,
        "dayOfEntry.month": month,
        "dayOfEntry.day": day,
      });

      if (!dailyNutrition) {
        return new Error("No nutritional values found for the specified date.");
      }

      return dailyNutrition as NutritionalValueOfDay;
    }),

  getFoodItemsByMeal: publicProcedure
    .input(
      z.object({
        date: z.date(),
        mealType: z.string(),
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

      const mappedMealType = mealTypeMapping[input.mealType] || input.mealType;

      const foodItems = await collection.findOne({
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

  deleteFood: publicProcedure
    .input(
      z.object({
        date: z.date().default(() => new Date()), // Default to current date
        mealType: z.string(),
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

      const mappedMealType = mealTypeMapping[input.mealType] || input.mealType;

      const result = await collection.updateOne(
        {
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

      CalculateNewNutritionalValues();

      if (result.modifiedCount === 0) {
        return new Error("Food item not found or could not be deleted.");
      }

      async function CalculateNewNutritionalValues() {
        // Fetch the updated document after deletion
        const updatedDocument = await collection.findOne({
          "dayOfEntry.year": input.date.getFullYear(),
          "dayOfEntry.month": input.date.getMonth() + 1,
          "dayOfEntry.day": input.date.getDate(),
        });

        if (!updatedDocument) return;

        // Initialize totals
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;

        // Calculate totals from all meals
        const mealTypes = [
          "breakfastMeals",
          "lunchMeals",
          "dinnerMeals",
          "snackMeals",
        ];
        for (const mealType of mealTypes) {
          const meal = updatedDocument[
            mealType as keyof NutritionalValueOfDay
          ] as MealEntry;
          if (meal && meal.foods) {
            for (const food of meal.foods) {
              totalCalories += food.caloriesInKcal;
              totalProtein += food.proteinInG;
              totalCarbs += food.carbsInG;
              totalFats += food.fatsInG;
            }
          }
        }

        // Update the document with new totals
        await collection.updateOne(
          {
            "dayOfEntry.year": input.date.getFullYear(),
            "dayOfEntry.month": input.date.getMonth() + 1,
            "dayOfEntry.day": input.date.getDate(),
          },
          {
            $set: {
              caloriesInKcal: totalCalories,
              proteinInG: totalProtein,
              carbsInG: totalCarbs,
              fatsInG: totalFats,
            },
          },
        );
      }

      return {
        success: true,
        message: `Successfully deleted ${input.foodName}`,
      };
    }),

  addFood: publicProcedure
    .input(
      z.object({
        date: z.date().default(() => new Date()),
        mealType: z.string(),
        foodName: z.string(),
        weightInG: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const collection = ctx.db.collection<NutritionalValueOfDay>(
        NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
      );

      // Map the meal type to the corresponding field name in the database
      const mealTypeMapping: Record<string, string> = {
        Breakfast: "breakfastMeals",
        Lunch: "lunchMeals",
        Dinner: "dinnerMeals",
        Snack: "snackMeals",
      };

      const mappedMealType = mealTypeMapping[input.mealType] || input.mealType;

      // Fetch nutritional info for the food (simplified - in a real app you'd fetch this from a food database)
      // For now, I'm using placeholder values for calories, protein, carbs, and fats
      const caloriesPerGram = 2; // Example value
      const proteinPerGram = 0.1; // Example value
      const carbsPerGram = 0.2; // Example value
      const fatsPerGram = 0.05; // Example value

      const newFood = {
        name: input.foodName,
        weightInG: input.weightInG,
        caloriesInKcal: caloriesPerGram * input.weightInG,
        proteinInG: proteinPerGram * input.weightInG,
        carbsInG: carbsPerGram * input.weightInG,
        fatsInG: fatsPerGram * input.weightInG,
      };

      // Add the food to the specified meal
      const result = await collection.updateOne(
        {
          "dayOfEntry.year": input.date.getFullYear(),
          "dayOfEntry.month": input.date.getMonth() + 1,
          "dayOfEntry.day": input.date.getDate(),
        },
        {
          $push: {
            [`${mappedMealType}.foods`]: newFood,
          },
        },
      );

      await calculateNewNutritionalValues();

      if (result.modifiedCount === 0) {
        return new Error("Could not add food item.");
      }

      async function calculateNewNutritionalValues() {
        // Fetch the updated document after addition
        const updatedDocument = await collection.findOne({
          "dayOfEntry.year": input.date.getFullYear(),
          "dayOfEntry.month": input.date.getMonth() + 1,
          "dayOfEntry.day": input.date.getDate(),
        });

        if (!updatedDocument) return;

        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;

        const mealTypes = [
          "breakfastMeals",
          "lunchMeals",
          "dinnerMeals",
          "snackMeals",
        ];
        for (const mealType of mealTypes) {
          const meal = updatedDocument[
            mealType as keyof NutritionalValueOfDay
          ] as MealEntry;
          if (meal && meal.foods) {
            for (const food of meal.foods) {
              totalCalories += food.caloriesInKcal;
              totalProtein += food.proteinInG;
              totalCarbs += food.carbsInG;
              totalFats += food.fatsInG;
            }
          }
        }

        await collection.updateOne(
          {
            "dayOfEntry.year": input.date.getFullYear(),
            "dayOfEntry.month": input.date.getMonth() + 1,
            "dayOfEntry.day": input.date.getDate(),
          },
          {
            $set: {
              caloriesInKcal: totalCalories,
              proteinInG: totalProtein,
              carbsInG: totalCarbs,
              fatsInG: totalFats,
            },
          },
        );
      }

      return {
        success: true,
        message: `Successfully added ${input.foodName}`,
      };
    }),
});
