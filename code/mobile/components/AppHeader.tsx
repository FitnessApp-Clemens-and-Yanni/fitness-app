import { Text } from "react-native";
import { View } from "react-native";
import { UserSelect } from "@comp/UserSelect";

export function AppHeader() {
  return (
    <View className="min-h-10 shadow-sm shadow-gray-200 justify-between px-4 flex-row py-1">
      <View className="justify-center">
        <Text className="text-xl font-extrabold italic">The Fitness App</Text>
      </View>

      <View className="w-1/3">
        <UserSelect />
      </View>
    </View>
  );
}
