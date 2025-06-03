import {
  MealEntry,
  NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
  NutritionalValueOfDay,
} from "@/data/meta/models.js";
import { Db } from "mongodb";

export async function calculateNewNutritionalValuesInDatabase(
  db: Db,
  date: Date,
  userId: string,
) {
  const collection = db.collection<NutritionalValueOfDay>(
    NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
  );

  const updatedDocument = await collection.findOne({
    userId,
    "dayOfEntry.year": date.getFullYear(),
    "dayOfEntry.month": date.getMonth() + 1,
    "dayOfEntry.day": date.getDate(),
  });

  if (!updatedDocument) return;

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;

  const mealTypes = [
    "breakfastMeals",
    "lunchMeals",
    "dinnerMeals",
    "snackMeals",
  ];
  for (const mealType of mealTypes) {
    const meal = updatedDocument[
      mealType as keyof NutritionalValueOfDay
    ] as MealEntry;
    if (meal && meal.foods) {
      for (const food of meal.foods) {
        totalCalories += food.caloriesInKcal;
        totalProtein += food.proteinInG;
        totalCarbs += food.carbsInG;
        totalFats += food.fatsInG;
      }
    }
  }

  await collection.updateOne(
    {
      userId,
      "dayOfEntry.year": date.getFullYear(),
      "dayOfEntry.month": date.getMonth() + 1,
      "dayOfEntry.day": date.getDate(),
    },
    {
      $set: {
        caloriesInKcal: totalCalories,
        proteinInG: totalProtein,
        carbsInG: totalCarbs,
        fatsInG: totalFats,
      },
    },
  );
}
