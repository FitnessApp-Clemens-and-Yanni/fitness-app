import { View, Text } from "react-native";
import { Input } from "@ui/input";

export function WeightInput(props: {
  pickedWeight: string;
  setPickedWeight: (weight: string) => void;
}) {
  return (
    <View className="flex flex-row gap-1">
      <Text>Weight:</Text>
      <Input
        onChangeText={props.setPickedWeight}
        value={props.pickedWeight}
        placeholder={"100g"}
      />
    </View>
  );
}
