import {useState} from "react";
import {api} from "@/utils/react";
import {ActivityIndicator, Modal, ScrollView, TouchableOpacity, View} from "react-native";
import {Text} from "@/components/ui/Text";
import {X} from "lucide-react-native";
import {Button} from "@/components/ui/Button";
import {SearchFoodResult } from "../../../../server/data/meta/models";
import {FilterFoodButtons} from "@/components/food/MealModal/FilterFoodButtons";
import {ApiFoodSearchBar} from "@/components/food/MealModal/ApiFoodSearchBar";
import {ApiFoodSearchBarResult} from "@/components/food/MealModal/ApiFoodSearchBarResult";
import {NutritionalDataDisplay} from "@/components/food/MealModal/NutritionalDataDisplay";
import {FoodList} from "@/components/food/MealModal/FoodList";

export function AddMealModal(props: {
                          isVisible: boolean,
                          mealType: string,
                          closeBtnClick: () => void,
                             })
{

    const [currentDate] = useState(new Date());
    const [selectedFoodFilter, setSelectedFoodFilter] = useState("Favorite");
    const [searchTerm, setSearchTerm] = useState("");


    const {
        isLoading: isLoadingSearchFood,
        error: searchFoodError,
        data: searchFoodResultData,
        refetch: searchFood,
    } = api.fatSecret.getSearchFood.useQuery<SearchFoodResult>(
        {search: searchTerm},
        {enabled: false}
    );

    const {
        isLoading: isLoadingFoodItems,
        error: foodItemsError,
        data: foodData,
        refetch: refetchFoodData,
    } = api.food.getFoodItemsByMeal.useQuery(
        {
            date: currentDate,
            mealType: props.mealType as "Breakfast" | "Lunch" | "Dinner" | "Snack",
        },
        {
            enabled: props.mealType !== "",
        }
    );

    if (isLoadingFoodItems || foodData === undefined) {
        return (
            <Modal visible={props.isVisible} transparent={true}>
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="w-5/6 bg-white rounded-lg shadow p-5">
                        <ActivityIndicator/>
                    </View>
                </View>
            </Modal>
        );
    }

    if (foodItemsError instanceof Error || foodData instanceof Error) {
        let errorMessage = "";
        if (foodData instanceof Error) {
            errorMessage = foodData.message;
        } else {
            errorMessage = foodItemsError?.message || "An unknown error occurred.";
        }

        return (
            <Modal visible={props.isVisible} transparent={true}>
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="w-5/6 bg-white rounded-lg shadow p-5">
                        <Text>Sorry, an error occurred... {errorMessage}</Text>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={props.isVisible} transparent={true}>
            <View className="flex-1 justify-center items-center bg-black/40">
                <View className="h-3/4 w-5/6 bg-white rounded-lg shadow gap-4 p-5">

                    <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-semibold">{props.mealType}</Text>
                        <TouchableOpacity onPress={props.closeBtnClick}>
                            <X size={24}/>
                        </TouchableOpacity>
                    </View>

                    <View className="flex flex-row h-32 gap-2">
                        <NutritionalDataDisplay foodData={foodData}/>
                        <FoodList foodData={foodData} mealType={props.mealType} currentDate={currentDate} refetchFoodData={refetchFoodData}/>
                    </View>

                    <FilterFoodButtons setSelectedFoodFilter={setSelectedFoodFilter} selectedFoodFilter={selectedFoodFilter} />

                    <ApiFoodSearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        searchFood={searchFood}
                    />
                    <ApiFoodSearchBarResult searchFoodResultData={searchFoodResultData as SearchFoodResult} mealType={props.mealType} refetchFoodData={refetchFoodData} currentDate={currentDate} />


                    <ScrollView className="bg-stone-500 h-40 w-full border border-stone-700">
                        <Text>Not implemented yet</Text>
                    </ScrollView>


                    <View className="flex-row justify-end">
                        <Button onPress={props.closeBtnClick}>
                            <Text>Ok</Text>
                        </Button>
                    </View>

                </View>
            </View>
        </Modal>
    );
}
