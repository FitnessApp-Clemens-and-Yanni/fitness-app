import { publicProcedure } from "@/trpc.js";
import { callFatSecretApi } from "@/utils/fatSecret-api.js";
import { z } from "zod";

export type SearchFoodResult = {
  foods: {
    food: FoodItem[] | FoodItem;
  };
};

export type FoodItem = {
  foodName: string;
  foodDescription: string;
  foodId: string;
};

export const serachForFoodPublicQuery = publicProcedure
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
  });

type FatSecretApiResponse = {
  foods: {
    food: FatSecretApiFoodItem[] | FatSecretApiFoodItem;
  };
};

type FatSecretApiFoodItem = {
  food_name: string;
  food_description: string;
  food_id: string;
};
