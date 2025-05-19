import {ScrollView, TouchableOpacity, View} from "react-native";
import {Text} from "@/components/ui/Text";
import {Pen, PlusCircle} from "lucide-react-native";
import {FoodItem, SearchFoodResult} from "../../../../server/data/meta/models";
import {api} from "@/utils/react";

export function ApiSearchBarResult(props: {
    searchFoodResultData: SearchFoodResult | undefined,
    mealType: string,
    refetchFoodData: () => void,
    currentDate: Date,
    isLoadingSearchFood: boolean,
    searchFoodError: any
}) {
    const addFoodWithIdMutation = api.fatSecret.addFoodToMealWithId.useMutation({
        onSuccess: () => {
            props.refetchFoodData();
        },
    });

    return (
        props.searchFoodResultData?.foods && (
            <ScrollView className="max-h-28 w-full border border-stone-500 mb-2 bg-stone-200 rounded-md">
                {Array.isArray(props.searchFoodResultData.foods.food) ? (
                    props.searchFoodResultData.foods.food.map((item, index) => (
                        <View
                            key={`search-${index}`}
                            className="flex flex-row justify-between items-center bg-stone-300 w-full border-b border-stone-700 p-1"
                        >
                            <Text className="text-sm flex-1">{item.food_name}</Text>
                            <Text className="text-xs text-stone-600 mr-2">
                                {item.food_description?.match(/Per \S+/)?.[0] || ""}
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    addFoodWithIdMutation.mutate({
                                        foodId: item.food_id,
                                        mealType: props.mealType,
                                        date: props.currentDate,
                                    })
                                }
                            >
                                <PlusCircle size={16}/>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <View
                        key={props.searchFoodResultData.foods.food.food_id}
                        className="flex flex-row justify-between items-center bg-stone-300 w-full border-b border-stone-700 p-1"
                    >
                        <Text className="text-sm flex-1">
                            {props.searchFoodResultData.foods.food.food_name}
                        </Text>
                        <Text className="text-xs text-stone-600 mr-2">
                            {props.searchFoodResultData.foods.food.food_description?.match(
                                /Per \S+/
                            )?.[0] || ""}
                        </Text>
                        <TouchableOpacity
                            onPress={() =>
                                {

                                    if (props.searchFoodResultData) {

                                        addFoodWithIdMutation.mutate({
                                            foodId: (props.searchFoodResultData.foods.food as FoodItem).food_id,
                                            mealType: props.mealType,
                                            date: props.currentDate,
                                        })
                                    }
                                }
                            }
                        >
                            <Pen size={16}/>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        )
    );
}