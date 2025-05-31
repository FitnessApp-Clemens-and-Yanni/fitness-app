export const FOOD_FILTERING_OPTIONS = ["Often", "Favorite", "Last"] as const;
export type FoodFilteringOption = (typeof FOOD_FILTERING_OPTIONS)[number];
