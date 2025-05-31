import { useEffect, useState } from "react";
import { View } from "react-native";
import { api } from "@/utils/react";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { NutritionalDataDisplay } from "@/components/food/NutritionalDataDisplay";
import { MealsAddingOptions } from "@/components/food/MealsAddingOptions";
import { DateDisplay } from "@/components/DateDisplay";
import { useUserStore } from "@/lib/stores/user-store";

export default function Index() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const userStore = useUserStore();
  const [userAtBeginning] = useState(userStore.currentUser);
  const apiUtils = api.useUtils();

  useEffect(() => {
    apiUtils.food.getNutritionalValuesOfDay.invalidate();
  }, [currentDate]);

  const {
    isLoading: isLoadingTargets,
    error: targetError,
    data: targetNutritionalData,
  } = api.food.getTargetNutritionalValues.useQuery({
    userId: userStore.currentUser,
  });

  useEffect(() => {
    if (userStore.currentUser != userAtBeginning) {
      apiUtils.food.getTargetNutritionalValues.invalidate();
      apiUtils.food.getNutritionalValuesOfDay.invalidate();
    }
  }, [userStore.currentUser]);

  const { isLoading: isLoadingDailyValues, data: dailyNutritionalData } =
    api.food.getNutritionalValuesOfDay.useQuery({
      userId: userStore.currentUser,
      date: currentDate,
    });

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

        <MealsAddingOptions currentDate={currentDate} />
      </View>
    </View>
  );
}
