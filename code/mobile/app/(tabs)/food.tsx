import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/Text";
import { View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Food is better! :))</Text>
      <Progress value={60} className="w-9/12" />
    </View>
  );
}
