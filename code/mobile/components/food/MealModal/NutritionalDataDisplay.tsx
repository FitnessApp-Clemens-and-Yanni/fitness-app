import { View, Text } from "react-native";
import { MealEntry } from "@server/data/meta/models";

export function NutritionalDataDisplay(props: {
  foodData: MealEntry | undefined;
}) {
  return (
    <View className="flex flex-1">
      <View className="flex flex-row justify-between">
        <Text className="text-sm">Calories:</Text>
        <Text className="text-sm">
          {props.foodData
            ? props.foodData.foods
                .reduce((sum, food) => sum + food.caloriesInKcal, 0)
                .toFixed(1)
            : 0}
        </Text>
      </View>
      <View className="flex flex-row justify-between">
        <Text className="text-sm">Protein:</Text>
        <Text className="text-sm">
          {props.foodData
            ? props.foodData.foods
                .reduce((sum, food) => sum + food.proteinInG, 0)
                .toFixed(1)
            : 0}
          g
        </Text>
      </View>
      <View className="flex flex-row justify-between">
        <Text className="text-sm">Carbs:</Text>
        <Text className="text-sm">
          {props.foodData
            ? props.foodData.foods
                .reduce((sum, food) => sum + food.carbsInG, 0)
                .toFixed(1)
            : 0}
          g
        </Text>
      </View>
      <View className="flex flex-row justify-between">
        <Text className="text-sm">Fats:</Text>
        <Text className="text-sm">
          {props.foodData
            ? props.foodData.foods
                .reduce((sum, food) => sum + food.fatsInG, 0)
                .toFixed(1)
            : 0}
          g
        </Text>
      </View>
    </View>
  );
}
