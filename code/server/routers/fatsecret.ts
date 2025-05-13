import {createTRPCRouter, publicProcedure} from "@/trpc.js";
import z, {unknown} from "zod";
import crypto from "crypto";
import OAuth from "oauth-1.0a";
import {
    MealEntry,
    NUTRITIONAL_VALUE_OF_DAY_COLLECTION,
    NutritionalValueOfDay,
} from "@/data/meta/models.js";

export const FatSecretRouter = createTRPCRouter({
    getSearchFood: publicProcedure
        .input(
            z.object({
                search: z.string(),
            })
        )
        .query(async ({input, ctx}) => {
            try {
                const oauth_consumer_key = process.env.FATSECRET_CONSUMER_KEY!;
                const consumerSecret = process.env.FATSECRET_CONSUMER_SECRET!;

                const oauth_nonce_length = 16;
                const oauth_signature_method = "HMAC-SHA1";

                const oauth = new OAuth({
                    consumer: {
                        key: oauth_consumer_key,
                        secret: consumerSecret,
                    },
                    signature_method: oauth_signature_method,
                    hash_function(baseString, key) {
                        return crypto
                            .createHmac('sha1', key)
                            .update(baseString)
                            .digest('base64');
                    },
                });

                const oauth_nonce = crypto.randomBytes(oauth_nonce_length).toString('hex');
                const oauth_timestamp = Math.floor(Date.now() / 1000);

                const urlParams = {
                    // oauth
                    oauth_consumer_key,
                    oauth_signature_method,
                    oauth_timestamp,
                    oauth_nonce,
                    oauth_version: '1.0',
                    // own
                    format: "json",
                    search_expression: input.search,
                }

                const url = new URL(`https://platform.fatsecret.com/rest/foods/search/v1`);

                for (const [key, value] of Object.entries(urlParams)) {
                    url.searchParams.set(key, value.toString());
                }

                const requestData = {
                    method: "GET",
                    url: url.href,
                };

                const authed = oauth.authorize(requestData);

                url.searchParams.set("oauth_signature", authed.oauth_signature);

                const res = await fetch(url.href, {
                    method: requestData.method,
                })

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`API request failed: ${res.status}, ${errorText}`);
                }

                type ErrorData = { error: { code: number, message: string } }
                const data: unknown | ErrorData = await res.json();

                if (typeof data === "object" && (data as ErrorData).error) {
                    const errorData = data as ErrorData;
                    throw new Error(`API error: ${errorData.error.code}, ${errorData.error.message}`);
                }

                return data;

            } catch (error) {
                console.error('Error searching food items:', error);
                throw new Error(`Failed to fetch food data: ${error instanceof Error ? error.message : String(error)}`);
            }
        }),

    addFoodWithId: publicProcedure
        .input(
            z.object({
                foodId: z.string(),
                mealType: z.string(),
                date: z.date().default(() => new Date())
                //weight
            })
        )
        .mutation(async ({ctx, input}) => {
            try {
                const collection = ctx.db.collection<NutritionalValueOfDay>(NUTRITIONAL_VALUE_OF_DAY_COLLECTION);

                const mealTypeMapping: Record<string, string> = {
                    "Breakfast": "breakfastMeals",
                    "Lunch": "lunchMeals",
                    "Dinner": "dinnerMeals",
                    "Snack": "snackMeals"
                };

                const mappedMealType = mealTypeMapping[input.mealType] || input.mealType;

                const oauth_consumer_key = process.env.FATSECRET_CONSUMER_KEY!;
                const consumerSecret = process.env.FATSECRET_CONSUMER_SECRET!;

                const oauth_nonce_length = 16;
                const oauth_signature_method = "HMAC-SHA1";

                const oauth = new OAuth({
                    consumer: {
                        key: oauth_consumer_key,
                        secret: consumerSecret,
                    },
                    signature_method: oauth_signature_method,
                    hash_function(baseString, key) {
                        return crypto
                            .createHmac('sha1', key)
                            .update(baseString)
                            .digest('base64');
                    },
                });

                const oauth_nonce = crypto.randomBytes(oauth_nonce_length).toString('hex');
                const oauth_timestamp = Math.floor(Date.now() / 1000);

                const urlParams = {
                    oauth_consumer_key,
                    oauth_signature_method,
                    oauth_timestamp,
                    oauth_nonce,
                    oauth_version: '1.0',
                    format: "json",
                    food_id: input.foodId,
                    method: "food.get.v4"
                }

                const url = new URL(`https://platform.fatsecret.com/rest/food/v1`);

                for (const [key, value] of Object.entries(urlParams)) {
                    url.searchParams.set(key, value.toString());
                }

                const requestData = {
                    method: "GET",
                    url: url.href,
                };

                const authed = oauth.authorize(requestData);
                url.searchParams.set("oauth_signature", authed.oauth_signature);

                const res = await fetch(url.href, {
                    method: requestData.method,
                });

                if (!res.ok) {
                    throw new Error(`API request failed: ${res.status}`);
                }

                const data = await res.json();

                if (data.error) {
                    throw new Error(`API error: ${data.error.message}`);
                }

                let serving = null;
                if (Array.isArray(data.food.servings.serving)) {
                    serving = data.food.servings.serving.find((s: any) =>
                        s.serving_description === "100 g" ||
                        (s.metric_serving_amount === "100.000" && s.metric_serving_unit === "g")
                    );
                } else if (data.food.servings.serving.serving_description === "100 g" ||
                    (data.food.servings.serving.metric_serving_amount === "100.000" &&
                        data.food.servings.serving.metric_serving_unit === "g")) {
                    serving = data.food.servings.serving;
                }

                if (!serving) {
                    serving = Array.isArray(data.food.servings.serving)
                        ? data.food.servings.serving[0]
                        : data.food.servings.serving;
                }

                const newFood = {
                    name: data.food.food_name,
                    weightInG: 100,
                    caloriesInKcal: parseInt(serving.calories || "0"),
                    proteinInG: parseFloat(serving.protein || "0"),
                    carbsInG: parseFloat(serving.carbohydrate || "0"),
                    fatsInG: parseFloat(serving.fat || "0")
                };

                const result = await collection.updateOne(
                    {
                        "dayOfEntry.year": input.date.getFullYear(),
                        "dayOfEntry.month": input.date.getMonth() + 1,
                        "dayOfEntry.day": input.date.getDate()
                    },
                    {
                        $push: {
                            [`${mappedMealType}.foods`]: newFood
                        }
                    }
                );

                await calculateNewNutritionalValues();

                if (result.modifiedCount === 0) {
                    throw new Error("Could not add food item.");
                }

                async function calculateNewNutritionalValues() {
                    const updatedDocument = await collection.findOne({
                        "dayOfEntry.year": input.date.getFullYear(),
                        "dayOfEntry.month": input.date.getMonth() + 1,
                        "dayOfEntry.day": input.date.getDate()
                    });

                    if (!updatedDocument) return;

                    let totalCalories = 0;
                    let totalProtein = 0;
                    let totalCarbs = 0;
                    let totalFats = 0;

                    const mealTypes = ["breakfastMeals", "lunchMeals", "dinnerMeals", "snackMeals"];
                    for (const mealType of mealTypes) {
                        const meal = updatedDocument[mealType as keyof NutritionalValueOfDay] as MealEntry;
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
                            "dayOfEntry.year": input.date.getFullYear(),
                            "dayOfEntry.month": input.date.getMonth() + 1,
                            "dayOfEntry.day": input.date.getDate()
                        },
                        {
                            $set: {
                                caloriesInKcal: totalCalories,
                                proteinInG: totalProtein,
                                carbsInG: totalCarbs,
                                fatsInG: totalFats
                            }
                        }
                    );
                }

                return { success: true, message: `Successfully added ${data.food.food_name}` };
            } catch (error) {
                console.error('Error adding food:', error);
                throw new Error(`Failed to add food: ${error instanceof Error ? error.message : String(error)}`);
            }
        }),
});