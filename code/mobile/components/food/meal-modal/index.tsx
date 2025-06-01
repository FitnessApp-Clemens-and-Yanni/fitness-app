import { useState } from "react";
import { api } from "@/utils/react";
import {
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { ApiSearchBar } from "@comp/food/meal-modal/ApiSearchBar";
import { ApiSearchBarResult } from "@comp/food/meal-modal/ApiSearchBarResult";
import { NutritionalDataDisplay } from "@comp/food/meal-modal/NutritionalDataDisplay";
import { FoodList } from "@comp/food/meal-modal/FoodList";
import { FontAwesomeIcon } from "@comp/font-awesome-icon";
import { AppColors } from "@/lib/app-colors";
import { MealType } from "shared/build/zod-schemas/meal-type.js";
import { useUserStore } from "@/lib/stores/user-store";
import { Skeleton } from "@ui/skeleton";

export type FoodItem = {
  food_name: string;
  food_description: string;
  food_id: string;
};

export type SearchFoodResult = {
  foods: {
    food: FoodItem[] | FoodItem;
  };
};

export function MealAddingModal(props: {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  mealType: MealType;
}) {
  const [currentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [foodItemsStateError, setFoodItemsStateError] = useState<Error | null>(
    null,
  );

  const userStore = useUserStore();
  const apiUtils = api.useUtils();

  const {
    isLoading: isLoadingSearchFood,
    error: searchFoodError,
    data: searchFoodResultData,
    refetch: searchFood,
  } = api.fatSecret.searchForFood.useQuery(
    { search: searchTerm },
    { enabled: false },
  );

  const createEmptyDayMutation = api.food.createEmptyDayEntry.useMutation();

  const {
    isLoading: isLoadingFoodItems,
    error: foodItemsError,
    data: foodData,
  } = api.food.getFoodItemsOfDayByMeal.useQuery(
    {
      userId: userStore.currentUser,
      date: currentDate,
      mealType: props.mealType,
    },
    {
      enabled: props.isVisible,
    },
  );

  if (foodData instanceof Error) {
    if (foodData.message.includes("No food items found")) {
      if (foodItemsStateError === null) {
        createEmptyDayMutation.mutate(
          {
            userId: userStore.currentUser,
            date: currentDate,
          },
          {
            onSuccess: () => {
              setFoodItemsStateError(null);
              apiUtils.food.getFoodItemsOfDayByMeal.invalidate();
            },
          },
        );
        setFoodItemsStateError(foodData);
      }
      return (
        <Modal visible={props.isVisible} transparent={true}>
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="w-5/6 bg-white rounded-lg shadow p-5">
              <Text>Creating new meal entry...</Text>
              <ActivityIndicator />
            </View>
          </View>
        </Modal>
      );
    } else {
      return (
        <Modal visible={props.isVisible} transparent={true}>
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="w-5/6 bg-white rounded-lg shadow p-5">
              <Text>Sorry, an error occurred... {foodData.message}</Text>
            </View>
          </View>
        </Modal>
      );
    }
  }

  if (foodItemsError instanceof Error) {
    return (
      <Modal visible={props.isVisible} transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="w-5/6 bg-white rounded-lg shadow p-5">
            <Text>Sorry, an error occurred... {foodItemsError.message}</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={props.isVisible} transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="h-[88%] w-[88%] bg-white rounded-lg shadow gap-7 pt-5">
          <View className="flex-row justify-between items-center px-5">
            <Text className="text-lg font-semibold">{props.mealType}</Text>
            <TouchableOpacity onPress={() => props.setIsVisible(false)}>
              <FontAwesomeIcon
                name="times"
                color={AppColors.BLACK}
                className="scale-75"
              />
            </TouchableOpacity>
          </View>
          {isLoadingFoodItems || foodData === undefined ? (
            <Skeleton className="h-32" />
          ) : !(foodItemsStateError instanceof Error) ? (
            <View className="flex flex-row gap-2 px-5">
              <NutritionalDataDisplay foodData={foodData} />

              <FoodList
                foodData={foodData}
                mealType={props.mealType}
                currentDate={currentDate}
              />
            </View>
          ) : (
            <></>
          )}
          <ApiSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchFood={searchFood}
          />

          <ApiSearchBarResult
            searchFoodResultData={searchFoodResultData}
            mealType={props.mealType}
            currentDate={currentDate}
            isLoadingSearchFood={isLoadingSearchFood}
            searchFoodError={searchFoodError}
          />

          <Skeleton className="h-20 justify-center w-full px-5">
            <Text className="text-center font-extralight italic tracking-wider text-gray-800 break-words text-pretty px-5">
              Favourites foods feature coming soon...
            </Text>
          </Skeleton>

          {/* <FilterFoodButtons
            setSelectedFoodFilter={setSelectedFoodFilter}
            selectedFoodFilter={selectedFoodFilter}
          />

          <ScrollView className="bg-primary/25 h-40 w-full rounded p-5">
            <Text>This feature is coming soon...</Text>
          </ScrollView> */}
        </View>
      </View>
    </Modal>
  );
}
