import { View, Text } from "react-native";
import { Progress } from "@ui/progress";
import {
  NutritionalValueOfDay,
  TargetNutritionalValue,
} from "@server/data/meta/models";

type NutrientKey = "caloriesInKcal" | "proteinInG" | "carbsInG" | "fatsInG";

export function NutritionalValuesProgressBar(props: {
  nutritionalValue: string;
  nutrientKey: NutrientKey;
  dailyNutritionalData: NutritionalValueOfDay | "NoEntries";
  targetNutritionalData: TargetNutritionalValue;
  viewTextClassName?: string;
  progressClassName?: string;
  roundingDigit?: number;
}) {
  const currentValue =
    props.dailyNutritionalData === "NoEntries"
      ? 0
      : props.dailyNutritionalData[props.nutrientKey];
  const targetValue = props.targetNutritionalData[props.nutrientKey];
  const progressValue = (currentValue / targetValue) * 100;

  return (
    <View className="w-full">
      <View className={props.viewTextClassName}>
        <Text>
          {props.nutritionalValue}{" "}
          {currentValue.toFixed(props.roundingDigit ?? 1)}
          {" / "}
          {targetValue}
        </Text>
      </View>
      <Progress value={progressValue} className={props.progressClassName} />
    </View>
  );
}
