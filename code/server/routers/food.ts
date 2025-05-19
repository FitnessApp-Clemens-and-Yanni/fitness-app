import {
    MealEntry,
    NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
    NutritionalValueOfDay,
    TARGET_NUTRITIONAL_VALUE_COLLECTION,
    TargetNutritionalValue
} from "@/data/meta/models";
import {createTRPCRouter, publicProcedure} from "@/trpc";
import z from "zod";
import {calculateNewNutritionalValuesInDatabase} from "@/utils/nutritionCalculator";


export const FoodRouter = createTRPCRouter({
    getTargetNutritionalValues: publicProcedure.query(async ({ctx}) => {
        const collection = ctx.db.collection<TargetNutritionalValue>(TARGET_NUTRITIONAL_VALUE_COLLECTION);
        const targetValues = await collection.findOne();
        return targetValues as TargetNutritionalValue;
    }),

    getNutritionalValuesOfDay: publicProcedure
        .input(
            z.object({
                date: z.date()
            })
        )
        .query(async ({ctx, input}) => {

            const collection = ctx.db.collection<NutritionalValueOfDay>(NUTRITIONAL_VALUE_OF_DAY_COLLECTION);

            const year = input.date.getFullYear();
            const month = input.date.getMonth() + 1;
            const day = input.date.getDate();

            const dailyNutrition = await collection.findOne({
                "dayOfEntry.year": year,
                "dayOfEntry.month": month,
                "dayOfEntry.day": day
            });

            if (!dailyNutrition) {
                return new Error("No nutritional values found for the specified date.");
            }

            return dailyNutrition as NutritionalValueOfDay;
        }),

    getFoodItemsOfDayByMeal: publicProcedure
        .input(
            z.object({
                date: z.date(),
                mealType: z.string()
            })
        )
        .query(async ({ctx, input}) => {
            const collection = ctx.db.collection<NutritionalValueOfDay>(NUTRITIONAL_VALUE_OF_DAY_COLLECTION);

            const mealTypeMapping: Record<string, string> = {
                "Breakfast": "breakfastMeals",
                "Lunch": "lunchMeals",
                "Dinner": "dinnerMeals",
                "Snack": "snackMeals"
            };

            const mappedMealType = mealTypeMapping[input.mealType];

            const foodItems = (await collection.findOne({
                    "dayOfEntry.year": input.date.getFullYear(),
                    "dayOfEntry.month": input.date.getMonth() + 1,
                    "dayOfEntry.day": input.date.getDate(),
                },
            ));

            if (!foodItems) {
                return new Error("No food items found for the specified meal.");
            }

            return foodItems[mappedMealType as keyof NutritionalValueOfDay] as MealEntry;
        }),

    deleteFoodOfDayByMeal: publicProcedure
        .input(
            z.object({
                date: z.date().default(() => new Date()), // Default to current date
                mealType: z.string(),
                foodName: z.string()
            })
        )
        .mutation(async ({ctx, input}) => {
            const collection = ctx.db.collection<NutritionalValueOfDay>(NUTRITIONAL_VALUE_OF_DAY_COLLECTION);

            const mealTypeMapping: Record<string, string> = {
                "Breakfast": "breakfastMeals",
                "Lunch": "lunchMeals",
                "Dinner": "dinnerMeals",
                "Snack": "snackMeals"
            };

            const mappedMealType = mealTypeMapping[input.mealType] || input.mealType;

            const result = await collection.updateOne(
                {
                    "dayOfEntry.year": input.date.getFullYear(),
                    "dayOfEntry.month": input.date.getMonth() + 1,
                    "dayOfEntry.day": input.date.getDate()
                },
                {
                    $pull: {
                        [`${mappedMealType}.foods`]: {name: input.foodName}
                    }
                }
            );


            await calculateNewNutritionalValuesInDatabase(ctx.db, input.date);

            if (result.modifiedCount === 0) {
                return new Error("Food item not found or could not be deleted.");
            }

            return {success: true, message: `Successfully deleted ${input.foodName}`};
        }),
});