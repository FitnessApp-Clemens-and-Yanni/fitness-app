import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { api } from "@/utils/react";
import { MealType } from "shared/build/zod-schemas/meal-type.js";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@/components/font-awesome-icon";
import { AppColors } from "@/lib/app-colors";
import { useState } from "react";
import { useUserStore } from "@/lib/stores/user-store";
import { SearchFoodResult } from "@server/routers/food/fatsecret/serachForFoodPublicQuery";
import { Card } from "@/components/ui/Card";

export function ApiSearchBarResult(props: {
  searchFoodResultData: SearchFoodResult | undefined;
  mealType: MealType;
  currentDate: Date;
  isLoadingSearchFood: boolean;
  searchFoodError: any;
}) {
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

  return (
    <View className="flex-1">
      {props.isLoadingSearchFood ? (
        Array.from({ length: 3 }).map((_, index) => (
          <ScrollView
            key={`search-card-${index}`}
            className="h-full w-full bg-primary/50 rounded px-5 py-2"
            contentContainerClassName="gap-2"
          >
            <View>
              <Skeleton>
                <Card
                  key={`search-${index}`}
                  className="flex-row justify-between items-center px-5 py-2 gap-5 shadow shadow-gray-700/25"
                >
                  <FontAwesomeIcon
                    name="spinner"
                    color={AppColors.GRAY_700}
                    className="scale-[65%]"
                  />
                </Card>
              </Skeleton>
            </View>
          </ScrollView>
        ))
      ) : props.searchFoodResultData?.foods ? (
        <ScrollView
          className="h-full w-full bg-primary/50 rounded px-5 py-2"
          contentContainerClassName="gap-2"
        >
          {[props.searchFoodResultData.foods.food].flat().map((item, index) => (
            <TouchableOpacity
              key={`search-${index}`}
              onPress={() =>
                addFoodWithIdMutation.mutate({
                  userId: userStore.currentUser,
                  foodId: item.foodId,
                  mealType: props.mealType,
                  date: props.currentDate,
                })
              }
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
                  {item.foodDescription?.match(/Per \S+/)?.[0]}
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
