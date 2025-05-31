import { createTRPCRouter, publicProcedure } from "@/trpc.js";
import z from "zod";
import {
  NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
  NutritionalValueOfDay,
} from "@/data/meta/models.js";
import { callFatSecretApi, getMealTypeField } from "@/utils/fatSecret-api.js";
import { calculateNewNutritionalValuesInDatabase } from "@/utils/nutritionCalculator.js";
import { MEAL_TYPE_SCHEMA } from "@/shared/zod-schemas/meal-type.js";

export const FatSecretRouter = createTRPCRouter({
  searchForFood: publicProcedure
    .input(
      z.object({
        search: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const data = (await callFatSecretApi(
        "https://platform.fatsecret.com/rest/foods/search/v1",
        { search_expression: input.search },
      )) as FatSecretApiResponse;

      // Transform snake_case to camelCase
      const transformedData: SearchFoodResult = {
        foods: {
          food: Array.isArray(data.foods.food)
            ? data.foods.food.map((item) => ({
                foodName: item.food_name,
                foodDescription: item.food_description,
                foodId: item.food_id,
              }))
            : {
                foodName: data.foods.food.food_name,
                foodDescription: data.foods.food.food_description,
                foodId: data.foods.food.food_id,
              },
        },
      };

      return transformedData;
    }),

  addFoodToMealWithId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        foodId: z.string(),
        mealType: MEAL_TYPE_SCHEMA,
        date: z.date().default(() => new Date()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const collection = ctx.db.collection<NutritionalValueOfDay>(
        NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
      );
      const mappedMealType = getMealTypeField(input.mealType);

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
          userId: input.userId,
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

      await calculateNewNutritionalValuesInDatabase(
        ctx.db,
        input.date,
        input.userId,
      );

      if (result.modifiedCount === 0) {
        throw new Error("Could not add food item.");
      }

      return {
        success: true,
        message: `Successfully added ${data.food.food_name}`,
      };
    }),
});

export type FoodItem = {
  foodName: string;
  foodDescription: string;
  foodId: string;
};

export type SearchFoodResult = {
  foods: {
    food: FoodItem[] | FoodItem;
  };
};

type FoodApiResponse = {
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
};

type FatSecretApiFoodItem = {
  food_name: string;
  food_description: string;
  food_id: string;
};

type FatSecretApiResponse = {
  foods: {
    food: FatSecretApiFoodItem[] | FatSecretApiFoodItem;
  };
};
