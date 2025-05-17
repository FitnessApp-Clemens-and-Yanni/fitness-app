import {ScrollView, TouchableOpacity, View} from "react-native";
import {Trash2} from "lucide-react-native";
import {Text} from "@/components/ui/Text";
import {MealEntry} from "../../../../server/data/meta/models";
import {api} from "@/utils/react";

export function FoodList(props:{foodData: MealEntry, currentDate: Date, refetchFoodData: () => void, mealType: string}) {

    const deleteFoodMutation = api.food.deleteFood.useMutation({
        onSuccess: () => {
            props.refetchFoodData();
        },
    });


    return (
        <View>
            <ScrollView className="bg-stone-500 h-20 w-40 border border-stone-700">
                {props.foodData.foods.map((food, index) => (
                    <View
                        key={`${food.name}-${index}`}
                        className="flex flex-row justify-between bg-stone-300 w-full border-b border-stone-700 p-1"
                    >
                        <View className="flex flex-row justify-between gap-1">
                            <TouchableOpacity
                                onPress={() =>
                                    deleteFoodMutation.mutate({
                                        date: props.currentDate,
                                        mealType: props.mealType,
                                        foodName: food.name,
                                    })
                                }
                            >
                                <Trash2 className="inline self-center flex"/>
                            </TouchableOpacity>
                            <Text className="text-xs self-center flex">
                                {food.name}
                            </Text>
                        </View>
                        <Text className="text-xs self-center">
                            {food.weightInG}g
                        </Text>
                    </View>
                ))}
                {props.foodData.foods.length === 0 && (
                    <View className="flex justify-center items-center h-full">
                        <Text className="text-stone-600 text-xs">No foods yet</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}