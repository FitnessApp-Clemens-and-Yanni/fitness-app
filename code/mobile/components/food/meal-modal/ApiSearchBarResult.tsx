import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { api } from "@/utils/react";
import { MealType } from "shared/build/zod-schemas/meal-type.js";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@/components/font-awesome-icon";
import { AppColors } from "@/lib/app-colors";
import { useState } from "react";
import { useUserStore } from "@/lib/stores/user-store";
import { FoodItem, SearchFoodResult } from "@server/routers/food/fatsecret/serachForFoodPublicQuery";
import { Card } from "@/components/ui/Card";
import { WeightInput } from "components/food/meal-modal/WeightInput";
import { Alert } from "@comp/Alert";

export function ApiSearchBarResult(props: {
  searchFoodResultData: SearchFoodResult | undefined;
  mealType: MealType;
  currentDate: Date;
  isLoadingSearchFood: boolean;
  searchFoodError: any;
}) {
  const [pickedWeight, setPickedWeight] = useState<string>("100");
  const [isPickedWeightPositive, setIsPickedWeightPositive] = useState<boolean>(true);
  const [addFoodError, setAddFoodError] = useState<string | null>(null);
  const userStore = useUserStore();
  const apiUtils = api.useUtils();

  const addFoodWithIdMutation = api.fatSecret.addFoodToMealWithId.useMutation({
    onSuccess: (response) => {
      if (!response.success) {
        setAddFoodError(response.message);
        return;
      }
      setAddFoodError(null);
      apiUtils.food.getFoodItemsOfDayByMeal.invalidate();
    },
    onError: (error) => {
      setAddFoodError(error.message);
      console.error("Error adding food:", error.message);
    },
  });

  function handelOnFoodPress(item: FoodItem) {

    if (+pickedWeight <= 0) {
      setIsPickedWeightPositive(false);
      return;
    }

    setIsPickedWeightPositive(true);

    addFoodWithIdMutation.mutate({
      userId: userStore.currentUser,
      foodId: item.foodId,
      weight: pickedWeight ? pickedWeight : "100",
      mealType: props.mealType,
      date: props.currentDate,
    })
  }

  return (
      <View className="flex-1">
        {props.isLoadingSearchFood ? (
          <ScrollView
            className="h-full bg-primary/50 rounded px-5 py-2"
            contentContainerClassName="gap-2"
          >
            {new Array(10).fill(null).map((_, index) => (
              <Skeleton
                key={`search-card-${index}`}
                className="flex-row justify-between items-center px-5 py-2 gap-5 shadow shadow-gray-700/25"
              >
                <FontAwesomeIcon
                  name="spinner"
                  color={AppColors.GRAY_700}
                  className="scale-[65%]"
                />
              </Skeleton>
            ))}
          </ScrollView>
        ) : props.searchFoodResultData?.foods ? (
          <ScrollView
            className="h-full bg-primary/50 rounded px-5 py-2"
            contentContainerClassName="gap-2"
          >

            { !isPickedWeightPositive ?
              <Text className="color-red-500 font-extrabold">Your picked weight must be positive</Text>
              : null
            }
            <WeightInput
              pickedWeight={pickedWeight}
              setPickedWeight={setPickedWeight}
            />

            {[props.searchFoodResultData.foods.food].flat().map((item, index) => (
              <TouchableOpacity
                key={`search-${index}`}
                onPress={() => handelOnFoodPress(item)}
              >
                <Card className="flex-row justify-between items-center px-5 py-2 gap-5 shadow shadow-gray-700/25">
                  <FontAwesomeIcon
                    name="plus"
                    color={AppColors.GRAY_700}
                    className="scale-[65%]"
                  />
                  <Text className="text-sm flex-1 text-pretty">
                    {item.foodName}
                  </Text>
                  <Text className="text-xs text-stone-600 text-pretty">
                    {item.foodDescription.match(/^Per\s+(\d+\s*\w+).*/)?.[1]}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <></>
        )}

        {addFoodError ? (
          <View className="p-2 bg-red-100 -mt-2">
            <Text className="text-red-600 text-sm">{addFoodError}</Text>
          </View>
        ) : (
          <></>
        )}
      </View>
  );
}
