import { NutritionalValueOfDay } from "@/data/meta/models.js";
import { callFatSecretApi } from "@/utils/fatSecret-api.js";

import { NUTRITIONAL_VALUE_OF_DAY_COLLECTION } from "@/data/meta/models.js";
import { publicProcedure } from "@/trpc.js";
import { getMealTypeField } from "@/utils/fatSecret-api.js";
import { MEAL_TYPE_SCHEMA } from "shared/build/zod-schemas/meal-type.js";
import z from "zod/v4";
import { calculateNewNutritionalValuesInDatabase } from "@/utils/nutritional-values-calculation-in-database.js";

export const addFoodToMealWithIdPublicMutation = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      weight: z.string(),
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

    console.log(data.food.servings.serving);

    let newFood: {
      name: string;
      weightInG: number;
      caloriesInKcal: number;
      proteinInG: number;
      carbsInG: number;
      fatsInG: number;
    } = {
      name: "",
      weightInG: 0,
      caloriesInKcal: 0,
      proteinInG: 0,
      carbsInG: 0,
      fatsInG: 0,
    };

    if (Array.isArray(data.food.servings.serving)) {
      serving = data.food.servings.serving.find(
        (s: any) =>
          s.serving_description === "100 g" ||
          (s.metric_serving_amount === "100.000" &&
            s.metric_serving_unit === "g"),
      );

      const weightInG = +input.weight;
      const weightFactor = weightInG / 100;

      if (serving) {
        newFood = {
          name: data.food.food_name,
          weightInG: +input.weight,
          caloriesInKcal: +serving.calories * weightFactor,
          proteinInG: +serving.protein * weightFactor,
          carbsInG: +serving.carbohydrate * weightFactor,
          fatsInG: +serving.fat * weightFactor,
        };
      }
    } else if (
      data.food.servings.serving.serving_description === "100 g" ||
      (data.food.servings.serving.metric_serving_amount === "100.000" &&
        data.food.servings.serving.metric_serving_unit === "g")
    ) {
      serving = data.food.servings.serving;

      const weightInG = +input.weight;
      const weightFactor = weightInG / 100;

      newFood = {
        name: data.food.food_name,
        weightInG: +input.weight,
        caloriesInKcal: +serving.calories * weightFactor,
        proteinInG: +serving.protein * weightFactor,
        carbsInG: +serving.carbohydrate * weightFactor,
        fatsInG: +serving.fat * weightFactor,
      };
    } else {
      serving = data.food.servings.serving;

      newFood = {
        name: data.food.food_name,
        weightInG: -1,
        caloriesInKcal: +serving.calories,
        proteinInG: +serving.protein,
        carbsInG: +serving.carbohydrate,
        fatsInG: +serving.fat,
      };
    }

    if (!serving) {
      throw new Error("No servings found!");
    }

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
  });

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
