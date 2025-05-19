import {View} from "react-native";
import {MealCard} from "@/components/food/MealCard";

export function MealsAddingOptions(props: { refetchDailyData: () => void }) {


    return (
        <View className="flex-1 flex-col justify-evenly">
            <MealCard mealType={"Breakfast"} refetchDailyData={props.refetchDailyData}/>
            <MealCard mealType={"Lunch"} refetchDailyData={props.refetchDailyData}/>
            <MealCard mealType={"Dinner"} refetchDailyData={props.refetchDailyData}/>
            <MealCard mealType={"Snack"} refetchDailyData={props.refetchDailyData}/>
        </View>
    )
}