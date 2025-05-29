import { useEffect, useState } from "react";
import { View } from "react-native";
import { api } from "@/utils/react";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { NutritionalDataDisplay } from "@/components/food/NutritionalDataDisplay";
import { MealsAddingOptions } from "@/components/food/MealsAddingOptions";
import { DateDisplay } from "@/components/DateDisplay";

export default function Index() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    refetchDailyData();
  }, [currentDate]);

  const {
    isLoading: isLoadingTargets,
    error: targetError,
    data: targetNutritionalData,
  } = api.food.getTargetNutritionalValues.useQuery();

  const {
    isLoading: isLoadingDailyValues,
    data: dailyNutritionalData,
    refetch: refetchDailyData,
  } = api.food.getNutritionalValuesOfDay.useQuery({ date: currentDate });

  if (
    isLoadingTargets === true ||
    targetNutritionalData === undefined ||
    isLoadingDailyValues === true ||
    dailyNutritionalData === undefined
  ) {
    return <LoadingDisplay />;
  }

  if (targetError instanceof Error || dailyNutritionalData instanceof Error) {
    let errorMessage = "";
    if (dailyNutritionalData instanceof Error) {
      errorMessage = dailyNutritionalData.message;
    } else {
      errorMessage = targetError?.message || "An unknown error occurred.";
    }

    return <ErrorDisplay message={errorMessage}></ErrorDisplay>;
  }

  return (
    <View className="flex-1 p-4">
      <View className="flex-1 flex-col justify-between">
        <DateDisplay
          selectedDate={currentDate}
          setSelectedDate={setCurrentDate}
        />

        <NutritionalDataDisplay
          dailyNutritionalData={dailyNutritionalData}
          targetNutritionalData={targetNutritionalData}
        />

        <MealsAddingOptions
          currentDate={currentDate}
          refetchDailyData={refetchDailyData}
        />
      </View>
    </View>
  );
}
