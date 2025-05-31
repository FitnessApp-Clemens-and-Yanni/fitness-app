import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { MealEntry } from "@server/data/meta/models";
import { api } from "@/utils/react";
import { FontAwesomeIcon } from "@/components/font-awesome-icon";
import { AppColors } from "@/lib/app-colors";
import { MealType } from "@server/shared/zod-schemas/meal-type";

export function FoodList(props: {
  foodData: MealEntry;
  currentDate: Date;
  refetchFoodData: () => void;
  mealType: MealType;
}) {
  const deleteFoodMutation = api.food.deleteFoodOfDayByMeal.useMutation({
    onSuccess: () => {
      props.refetchFoodData();
    },
    onError: (error) => {
      console.error("Error deleting food:", error.message);
    },
  });

  return (
    <View>
      <ScrollView className="bg-stone-500 h-20 w-40 border border-stone-700">
        {props.foodData.foods.length === 0 ? (
          <View className="flex justify-center items-center h-full">
            <Text className="text-xs">No foods yet</Text>
          </View>
        ) : (
          props.foodData.foods.map((food, index) => (
            <View
              key={`${food.name}-${index}`}
              className="flex flex-row justify-between bg-stone-300 w-full border-b border-stone-700 p-1"
            >
              <View className="flex flex-row justify-between gap-1">
                <TouchableOpacity
                  onPress={() =>
                    deleteFoodMutation.mutate({
                      date: props.currentDate,
                      mealType: props.mealType,
                      foodName: food.name,
                    })
                  }
                >
                  <FontAwesomeIcon
                    name="trash"
                    color={AppColors.RED}
                    className="self-center flex scale-75"
                  />
                </TouchableOpacity>

                <Text className="text-xs self-center flex">{food.name}</Text>
              </View>

              <Text className="text-xs self-center">{food.weightInG}g</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
