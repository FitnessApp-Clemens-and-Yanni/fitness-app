import { View } from "react-native";
import { MealCard } from "@/components/food/MealCard";

export function MealsAddingOptions(props: {
  refetchDailyData: () => void;
  currentDate: Date;
}) {
  return (
    <View className="flex-1 flex-col justify-evenly">
      <MealCard
        currentDate={props.currentDate}
        mealType={"Breakfast"}
        refetchDailyData={props.refetchDailyData}
      />
      <MealCard
        currentDate={props.currentDate}
        mealType={"Lunch"}
        refetchDailyData={props.refetchDailyData}
      />
      <MealCard
        currentDate={props.currentDate}
        mealType={"Dinner"}
        refetchDailyData={props.refetchDailyData}
      />
      <MealCard
        currentDate={props.currentDate}
        mealType={"Snack"}
        refetchDailyData={props.refetchDailyData}
      />
    </View>
  );
}
