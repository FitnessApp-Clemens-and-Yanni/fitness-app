import { View } from "react-native";
import { MealCard } from "@comp/food/MealCard";

export function MealsAddingOptions(props: { currentDate: Date }) {
  return (
    <View className="flex-1 flex-col justify-evenly">
      <MealCard currentDate={props.currentDate} mealType={"Breakfast"} />
      <MealCard currentDate={props.currentDate} mealType={"Lunch"} />
      <MealCard currentDate={props.currentDate} mealType={"Dinner"} />
      <MealCard currentDate={props.currentDate} mealType={"Snack"} />
    </View>
  );
}
