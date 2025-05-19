import { useState } from "react";
import { Text } from "@/components/ui/Text";
import {
    View,
} from "react-native";
import { api } from "@/utils/react";
import { UserSelect } from "@/components/UserSelect";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { NutritionalDataDisplay } from "@/components/food/NutritionalDataDisplay";
import {MealsAddingOptions} from "@/components/food/MealsAddingOptions";

export default function Index() {

    const [currentDate] = useState(new Date());

    const {
        isLoading: isLoadingTargets,
        error: targetError,
        data: targetNutritionalData,
    } = api.food.getTargetNutritionalValues.useQuery();

    const {
        isLoading: isLoadingDailyValues,
        error: dailyError,
        data: dailyNutritionalData,
        refetch: refetchDailyData,
    } = api.food.getNutritionalValuesOfDay.useQuery({date: currentDate});


    if (
        isLoadingTargets === true ||
        targetNutritionalData === undefined ||
        isLoadingDailyValues === true ||
        dailyNutritionalData === undefined
    ) {
        return (
            <LoadingDisplay />
        );
    }

    if (targetError instanceof Error || dailyNutritionalData instanceof Error) {
        let errorMessage = "";
        if (dailyNutritionalData instanceof Error) {
            errorMessage = dailyNutritionalData.message;
        } else {
            errorMessage = targetError?.message || "An unknown error occurred.";
        }

        return (
            <ErrorDisplay message={errorMessage}></ErrorDisplay>
        );
    }

    return (
        <View className="flex-1 p-4">

            <UserSelect/>

            {dailyError && (
                <View className="bg-amber-100 p-2 rounded-md mb-2">
                    <Text className="text-amber-800">No data found for today.</Text>
                </View>
            )}

            <View className="flex-1 flex-col justify-between">

                <NutritionalDataDisplay dailyNutritionalData={dailyNutritionalData}
                                        targetNutritionalData={targetNutritionalData}/>

                <MealsAddingOptions refetchDailyData={refetchDailyData} />
            </View>
        </View>
    );
}