import { View, Text } from "react-native";
import {
  NutritionalValueOfDay,
  TargetNutritionalValue,
} from "@server/data/meta/models";
// TODO: put these in shared!! The client should never have access to the server! The only exception is the AppRouter and
// that's just an implementation detail of tRPC
import { NutritionalValuesProgressBar } from "@comp/food/NutritionalValuesProgressBars";

export function NutritionalDataDisplay(props: {
  dailyNutritionalData: NutritionalValueOfDay | "NoEntries";
  targetNutritionalData: TargetNutritionalValue;
}) {
  return (
    <View className="flex-1 flex-col justify-evenly">
      <NutritionalValuesProgressBar
        nutritionalValue="Calories"
        nutrientKey="caloriesInKcal"
        dailyNutritionalData={props.dailyNutritionalData}
        targetNutritionalData={props.targetNutritionalData}
        viewTextClassName="flex flex-row justify-center"
        progressClassName="w-full h-3"
        roundingDigit={0}
      />

      <Text className="text-lg font-semibold pl-4">Nutritional Values</Text>

      <NutritionalValuesProgressBar
        nutritionalValue="Protein"
        nutrientKey="proteinInG"
        dailyNutritionalData={props.dailyNutritionalData}
        targetNutritionalData={props.targetNutritionalData}
        viewTextClassName="flex flex-row justify-start"
      />
      <NutritionalValuesProgressBar
        nutritionalValue="Carbs"
        nutrientKey="carbsInG"
        dailyNutritionalData={props.dailyNutritionalData}
        targetNutritionalData={props.targetNutritionalData}
        viewTextClassName="flex flex-row justify-start"
      />
      <NutritionalValuesProgressBar
        nutritionalValue="Fats"
        nutrientKey="fatsInG"
        dailyNutritionalData={props.dailyNutritionalData}
        targetNutritionalData={props.targetNutritionalData}
        viewTextClassName="flex flex-row justify-start"
      />
    </View>
  );
}
