import { useEffect, useState } from "react";
import { api } from "@/utils/react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { X } from "lucide-react-native";
import { Button } from "@ui/Button";
import { SearchFoodResult } from "@server/data/meta/models";
import { FilterFoodButtons } from "@comp/food/MealModal/FilterFoodButtons";
import { ApiSearchBar } from "@comp/food/MealModal/ApiSearchBar";
import { ApiSearchBarResult } from "@comp/food/MealModal/ApiSearchBarResult";
import { NutritionalDataDisplay } from "@comp/food/MealModal/NutritionalDataDisplay";
import { FoodList } from "@comp/food/MealModal/FoodList";

export function AddMealModal(props: {
  isVisible: boolean;
  mealType: string;
  closeBtnClick: () => void;
}) {
  const [currentDate] = useState(new Date());
  const [selectedFoodFilter, setSelectedFoodFilter] = useState("Favorite");
  const [searchTerm, setSearchTerm] = useState("");
  const [foodItemsStateError, setFoodItemsStateError] = useState<Error | null>(
    null,
  );

  useEffect(() => {});

  const {
    isLoading: isLoadingSearchFood,
    error: searchFoodError,
    data: searchFoodResultData,
    refetch: searchFood,
  } = api.fatSecret.getSearchFood.useQuery<SearchFoodResult>(
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
      date: currentDate,
      mealType: props.mealType as "Breakfast" | "Lunch" | "Dinner" | "Snack",
    },
    {
      enabled: props.mealType !== "",
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
    // Check if it's a "No food items found" error
    if (foodData.message.includes("No food items found")) {
      if (foodItemsStateError === null) {
        createEmptyDayMutation.mutate(
          {
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
      // Handle other types of errors
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
            <TouchableOpacity onPress={props.closeBtnClick}>
              <X size={24} />
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
            <Button onPress={props.closeBtnClick}>
              <Text>Ok</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
