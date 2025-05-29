import { TouchableOpacity, View, Text } from "react-native";

export function FilterFoodButtons(props: {
  setSelectedFoodFilter: (filter: string) => void;
  selectedFoodFilter: string;
}) {
  return (
    <View className="bg-stone-400 border border-stone-500 rounded-md p-1 w-3/4 self-center">
      <View className="flex flex-row justify-around">
        {["Often", "Favorite", "Last"].map((option, index) => (
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
