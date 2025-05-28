import { createTRPCRouter, publicProcedure } from "@/trpc";
import z from "zod";
import {
  NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
  NutritionalValueOfDay,
} from "@/data/meta/models";
import { callFatSecretApi, getMealTypeField } from "@/utils/fatSecreteApi";
import { calculateNewNutritionalValuesInDatabase } from "@/utils/nutritionCalculator";

export const FatSecretRouter = createTRPCRouter({
  getSearchFood: publicProcedure
    .input(
      z.object({
        search: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        return await callFatSecretApi(
          "https://platform.fatsecret.com/rest/foods/search/v1",
          { search_expression: input.search },
        );
      } catch (error) {
        console.error("Error searching food items:", error);
        throw new Error(
          `Failed to fetch food data: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }),

  addFoodToMealWithId: publicProcedure
    .input(
      z.object({
        foodId: z.string(),
        mealType: z.string(),
        date: z.date().default(() => new Date()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const collection = ctx.db.collection<NutritionalValueOfDay>(
          NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
        );
        const mappedMealType = getMealTypeField(input.mealType);

        interface FoodApiResponse {
          food: {
            food_name: string;
            servings: {
              serving:
                | Array<{
                    serving_description: string;
                    metric_serving_amount: string;
                    metric_serving_unit: string;
                    calories: string;
                    protein: string;
                    carbohydrate: string;
                    fat: string;
                  }>
                | {
                    serving_description: string;
                    metric_serving_amount: string;
                    metric_serving_unit: string;
                    calories: string;
                    protein: string;
                    carbohydrate: string;
                    fat: string;
                  };
            };
          };
        }

        const data = (await callFatSecretApi(
          "https://platform.fatsecret.com/rest/food/v1",
          { food_id: input.foodId },
        )) as FoodApiResponse;

        let serving = null;
        if (Array.isArray(data.food.servings.serving)) {
          serving = data.food.servings.serving.find(
            (s: any) =>
              s.serving_description === "100 g" ||
              (s.metric_serving_amount === "100.000" &&
                s.metric_serving_unit === "g"),
          );
        } else if (
          data.food.servings.serving.serving_description === "100 g" ||
          (data.food.servings.serving.metric_serving_amount === "100.000" &&
            data.food.servings.serving.metric_serving_unit === "g")
        ) {
          serving = data.food.servings.serving;
        }

        if (!serving) {
          throw new Error("No serving found for 100g.");
        }

        const newFood = {
          name: data.food.food_name,
          weightInG: 100,
          caloriesInKcal: parseInt(serving.calories),
          proteinInG: parseFloat(serving.protein),
          carbsInG: parseFloat(serving.carbohydrate),
          fatsInG: parseFloat(serving.fat),
        };

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

        await calculateNewNutritionalValuesInDatabase(ctx.db, input.date);

        if (result.modifiedCount === 0) {
          throw new Error("Could not add food item.");
        }

        return {
          success: true,
          message: `Successfully added ${data.food.food_name}`,
        };
      } catch (error) {
        console.error("Error adding food:", error);
        throw new Error(
          `Failed to add food: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }),
});
