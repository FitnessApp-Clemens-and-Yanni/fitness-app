import {Card} from "@/components/ui/Card";
import {Text} from "@/components/ui/Text";
import {TouchableOpacity, View} from "react-native";
import {Pen} from "lucide-react-native";
import {useState} from "react";
import {AddMealModal} from "@/components/food/MealModal/AddMealModal";
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