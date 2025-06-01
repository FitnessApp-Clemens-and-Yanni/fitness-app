import { TouchableOpacity, View, Text } from "react-native";
import {
  FOOD_FILTERING_OPTIONS,
  FoodFilteringOption,
} from "shared/build/zod-schemas/food-filtering-options.js";

export function FilterFoodButtons(props: {
  setSelectedFoodFilter: (filter: FoodFilteringOption) => void;
  selectedFoodFilter: FoodFilteringOption;
}) {
  return (
    <View className="bg-stone-400 border border-stone-500 rounded-md p-1 w-3/4 self-center">
      <View className="flex flex-row justify-around">
        {FOOD_FILTERING_OPTIONS.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => props.setSelectedFoodFilter(option)}
          >
            <Text
              className={
                props.selectedFoodFilter === option
                  ? "font-medium underline"
                  : "text-stone-600"
              }
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
