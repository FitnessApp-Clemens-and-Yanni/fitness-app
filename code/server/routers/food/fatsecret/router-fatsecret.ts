import { createTRPCRouter } from "@/trpc.js";
import { serachForFoodPublicQuery } from "./serachForFoodPublicQuery.js";
import { addFoodToMealWithIdPublicMutation } from "./addFoodToMealWithIdPublicMutation.js";

export const FatSecretRouter = createTRPCRouter({
  searchForFood: serachForFoodPublicQuery,
  addFoodToMealWithId: addFoodToMealWithIdPublicMutation,
});
