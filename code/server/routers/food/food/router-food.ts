import { createTRPCRouter } from "@/trpc.js";
import { getTargetNutritionalValuesPublicQuery } from "./getTargetNutritionalValuesPublicQuery.js";
import { getNutritionalValuesOfDayPublicQuery } from "./getNutritionalValuesOfDayPublicQuery.js";
import { getFoodItemsOfDayByMealPublicQuery } from "./getFoodItemsOfDayByMealPublicQuery.js";
import { deleteFoodOfDayMyMealPublicMutation } from "./deleteFoodOfDayMyMealPublicMutation.js";
import { createEmptyDayEntryPublicMutation } from "./createEmptyDayEntryPublicMutation.js";

export const FoodRouter = createTRPCRouter({
  getTargetNutritionalValues: getTargetNutritionalValuesPublicQuery,
  getNutritionalValuesOfDay: getNutritionalValuesOfDayPublicQuery,
  getFoodItemsOfDayByMeal: getFoodItemsOfDayByMealPublicQuery,
  deleteFoodOfDayByMeal: deleteFoodOfDayMyMealPublicMutation,
  createEmptyDayEntry: createEmptyDayEntryPublicMutation,
});
