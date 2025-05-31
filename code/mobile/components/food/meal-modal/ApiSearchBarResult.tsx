import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { api } from "@/utils/react";
import { MealType } from "@server/shared/zod-schemas/meal-type";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@/components/font-awesome-icon";
import { AppColors } from "@/lib/app-colors";
import { useState } from "react";
import { FoodItem, SearchFoodResult } from "@server/routers/food/fatsecret";
import { useUserStore } from "@/lib/stores/user-store";

export function ApiSearchBarResult(props: {
  searchFoodResultData: SearchFoodResult | undefined;
  mealType: MealType;
  refetchFoodData: () => void;
  currentDate: Date;
  isLoadingSearchFood: boolean;
  searchFoodError: any;
}) {
  const [addFoodError, setAddFoodError] = useState<string | null>(null);
  const userStore = useUserStore();

  const addFoodWithIdMutation = api.fatSecret.addFoodToMealWithId.useMutation({
    onSuccess: (response) => {
      if (!response.success) {
        setAddFoodError(response.message);
        return;
      }
      setAddFoodError(null);
      props.refetchFoodData();
    },
    onError: (error) => {
      setAddFoodError(error.message);
      console.error("Error adding food:", error.message);
    },
  });

  if (props.isLoadingSearchFood) {
    return (
      <Skeleton>
        <ScrollView className="max-h-28 w-full border border-stone-500 mb-2 bg-stone-200 rounded-md">
          {Array.from({ length: 5 }).map((_, index) => (
            <View
              key={`skeleton-${index}`}
              className="flex flex-row justify-between items-center bg-stone-300 w-full border-b border-stone-700 p-1"
            >
              <Skeleton className="flex-1 h-4" />
              <Skeleton className="w-16 h-4 mr-2" />
              <Skeleton className="w-6 h-6" />
            </View>
          ))}
        </ScrollView>
      </Skeleton>
    );
  }

  return (
    <View>
      {addFoodError && (
        <View className="p-2 bg-red-100 border border-red-300 rounded-md mb-2">
          <Text className="text-red-600 text-sm">{addFoodError}</Text>
        </View>
      )}
      {props.searchFoodResultData?.foods ? (
        <ScrollView className="max-h-28 w-full border border-stone-500 mb-2 bg-stone-200 rounded-md">
          {Array.isArray(props.searchFoodResultData.foods.food) ? (
            props.searchFoodResultData.foods.food.map((item, index) => (
              <View
                key={`search-${index}`}
                className="flex flex-row justify-between items-center bg-stone-300 w-full border-b border-stone-700 p-1"
              >
                <Text className="text-sm flex-1">{item.foodName}</Text>
                <Text className="text-xs text-stone-600 mr-2">
                  {item.foodDescription?.match(/Per \S+/)?.[0]}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    addFoodWithIdMutation.mutate({
                      userId: userStore.currentUser,
                      foodId: item.foodId,
                      mealType: props.mealType,
                      date: props.currentDate,
                    })
                  }
                >
                  <FontAwesomeIcon
                    name="plus"
                    color={AppColors.GRAY_800}
                    className="scale-[65%]"
                  />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View
              key={props.searchFoodResultData.foods.food.foodId}
              className="flex flex-row justify-between items-center bg-stone-300 w-full border-b border-stone-700 p-1"
            >
              <Text className="text-sm flex-1">
                {props.searchFoodResultData.foods.food.foodName}
              </Text>
              <Text className="text-xs text-stone-600 mr-2">
                {
                  props.searchFoodResultData.foods.food.foodDescription?.match(
                    /Per \S+/,
                  )?.[0]
                }
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (props.searchFoodResultData) {
                    addFoodWithIdMutation.mutate({
                      userId: userStore.currentUser,
                      foodId: (
                        props.searchFoodResultData.foods.food as FoodItem
                      ).foodId,
                      mealType: props.mealType,
                      date: props.currentDate,
                    });
                  }
                }}
              >
                <FontAwesomeIcon
                  name="plus"
                  color={AppColors.GRAY_800}
                  className="scale-[65%]"
                />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      ) : (
        <></>
      )}
    </View>
  );
}
