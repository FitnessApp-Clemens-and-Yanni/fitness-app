import { NutritionalValueOfDay } from "@/data/meta/models.js";
import { NUTRITIONAL_VALUE_OF_DAY_COLLECTION } from "@/data/meta/models.js";
import { publicProcedure } from "@/trpc.js";
import { calculateNewNutritionalValuesInDatabase } from "@/utils/nutritional-values-calculation-in-database.js";
import { MEAL_TYPE_SCHEMA } from "shared/build/zod-schemas/meal-type.js";
import z from "zod";

export const deleteFoodOfDayMyMealPublicMutation = publicProcedure
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
  });
