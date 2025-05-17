import {View} from "react-native";
import {Text} from "@/components/ui/Text";
import {NutritionalValueOfDay, TargetNutritionalValue} from "../../../server/data/meta/models";
import {NutritionalValuesProgressBars} from "@/components/food/NutritionalValuesProgressBars";

export function NutritionalDataDisplay(props: {
    dailyNutritionalData: NutritionalValueOfDay,
    targetNutritionalData: TargetNutritionalValue
}) {

    return (
        <View className="flex-1 flex-col justify-evenly">

            <NutritionalValuesProgressBars
                nutritionalValue="Calories"
                nutrientKey="caloriesInKcal"
                dailyNutritionalData={props.dailyNutritionalData}
                targetNutritionalData={props.targetNutritionalData}
                viewTextClasses="flex flex-row justify-center"
                progressClasses="w-full h-3"
            />

            <Text className="text-lg font-semibold pl-4">Nutritional Values</Text>

            <NutritionalValuesProgressBars
                nutritionalValue="Protein"
                nutrientKey="proteinInG"
                dailyNutritionalData={props.dailyNutritionalData}
                targetNutritionalData={props.targetNutritionalData}
                viewTextClasses="flex flex-row justify-start"
            />
            <NutritionalValuesProgressBars
                nutritionalValue="Carbs"
                nutrientKey="carbsInG"
                dailyNutritionalData={props.dailyNutritionalData}
                targetNutritionalData={props.targetNutritionalData}
                viewTextClasses="flex flex-row justify-start"
            />
            <NutritionalValuesProgressBars
                nutritionalValue="Fats"
                nutrientKey="fatsInG"
                dailyNutritionalData={props.dailyNutritionalData}
                targetNutritionalData={props.targetNutritionalData}
                viewTextClasses="flex flex-row justify-start"
            />
        </View>
    )
}