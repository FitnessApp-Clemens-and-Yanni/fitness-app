import { useState } from "react";
import { api } from "@/utils/react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Button } from "@ui/Button";
import { FilterFoodButtons } from "@/components/food/meal-modal/FilterFoodButtons";
import { ApiSearchBar } from "@/components/food/meal-modal/ApiSearchBar";
import { ApiSearchBarResult } from "@/components/food/meal-modal/ApiSearchBarResult";
import { NutritionalDataDisplay } from "@/components/food/meal-modal/NutritionalDataDisplay";
import { FoodList } from "@/components/food/meal-modal/FoodList";
import { FontAwesomeIcon } from "@/components/font-awesome-icon";
import { AppColors } from "@/lib/app-colors";
import { MealType } from "shared/build/zod-schemas/meal-type.js";
import { FoodFilteringOption } from "shared/build/zod-schemas/food-filtering-options.js";
import { useUserStore } from "@/lib/stores/user-store";

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
  const [selectedFoodFilter, setSelectedFoodFilter] =
    useState<FoodFilteringOption>("Favorite");
  const [searchTerm, setSearchTerm] = useState("");
  const [foodItemsStateError, setFoodItemsStateError] = useState<Error | null>(
    null,
  );

  const userStore = useUserStore();

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
    refetch: refetchFoodData,
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

  if (isLoadingFoodItems || foodData === undefined) {
    return (
      <Modal visible={props.isVisible} transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="w-5/6 bg-white rounded-lg shadow p-5">
            <ActivityIndicator />
          </View>
        </View>
      </Modal>
    );
  }

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
              refetchFoodData();
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
        <View className="h-3/4 w-5/6 bg-white rounded-lg shadow gap-4 p-5">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold">{props.mealType}</Text>
            <TouchableOpacity onPress={() => props.setIsVisible(false)}>
              <FontAwesomeIcon name="times" color={AppColors.BLACK} />
            </TouchableOpacity>
          </View>
          {!(foodItemsStateError instanceof Error) && (
            <View className="flex flex-row h-32 gap-2">
              <NutritionalDataDisplay foodData={foodData} />

              <FoodList
                foodData={foodData}
                mealType={props.mealType}
                currentDate={currentDate}
                refetchFoodData={refetchFoodData}
              />
            </View>
          )}
          <FilterFoodButtons
            setSelectedFoodFilter={setSelectedFoodFilter}
            selectedFoodFilter={selectedFoodFilter}
          />
          <ApiSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchFood={searchFood}
          />
          <ApiSearchBarResult
            searchFoodResultData={searchFoodResultData}
            mealType={props.mealType}
            refetchFoodData={refetchFoodData}
            currentDate={currentDate}
            isLoadingSearchFood={isLoadingSearchFood}
            searchFoodError={searchFoodError}
          />
          <ScrollView className="bg-stone-500 h-40 w-full border border-stone-700">
            <Text>Not implemented yet</Text>
          </ScrollView>
          <View className="flex-row justify-end">
            <Button onPress={() => props.setIsVisible(false)}>
              <Text>Ok</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
