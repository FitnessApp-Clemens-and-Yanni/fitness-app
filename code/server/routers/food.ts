import {
    TARGET_NUTRITIONAL_VALUE_COLLECTION,
    TargetNutritionalValue
} from "@/data/meta/models";
import { createTRPCRouter, publicProcedure } from "@/trpc";

export const FoodRouter = createTRPCRouter({
    getTargetNutritionalValues: publicProcedure.query(async ({ ctx }) => {
        const collection = ctx.db.collection<TargetNutritionalValue>(TARGET_NUTRITIONAL_VALUE_COLLECTION);
        const targetValues = await collection.findOne();
        return targetValues as TargetNutritionalValue;
    }),
});