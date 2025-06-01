import { z } from "zod/v4";

export const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;
export const MEAL_TYPE_SCHEMA = z.enum(MEAL_TYPES);
export type MealType = (typeof MEAL_TYPES)[number];
