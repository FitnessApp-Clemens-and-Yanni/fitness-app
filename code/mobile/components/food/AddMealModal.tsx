import {useState} from "react";
import {api} from "@/utils/react";
import {ActivityIndicator, Modal, ScrollView, TouchableOpacity, View} from "react-native";
import {Text} from "@/components/ui/Text";
import {Pen, PlusCircle, ScanBarcode, Search, Trash2, X} from "lucide-react-native";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/Button";

type FoodItem = {
    food_name: string;
    food_description: string;
    food_id: string;
};

type SearchFoodResult = {
    foods: {
        food: FoodItem[] | FoodItem;
    };
};

export function AddMealModal({
                          isVisible,
                          mealType,
                          closeBtnClick,
                      }: {
    isVisible: boolean;
    mealType: string;
    closeBtnClick: () => void;
}) {
    const [currentDate] = useState(new Date());
    const [selectedFoodFilter, setSelectedFoodFilter] = useState("Favorite");

    const [searchTerm, setSearchTerm] = useState("");

    const deleteFoodMutation = api.food.deleteFood.useMutation({
        onSuccess: () => {
            refetchFoodData();
        },
    });

    const addFoodWithIdMutation = api.fatSecret.addFoodWithId.useMutation({
        onSuccess: () => {
            refetchFoodData();
        },
    });

    const {
        isLoading: isLoadingSearchFood,
        error: searchFoodError,
        data: searchFoodResultData,
        refetch: searchFood,
    } = api.fatSecret.getSearchFood.useQuery<SearchFoodResult>(
        {search: searchTerm},
        {enabled: false}
    );

    // Warum hole ich mir das nochmal, wenn ich es eh alles oben schonmal geholt habe????

    const {
        isLoading: isLoadingFoodItems,
        error: foodItemsError,
        data: foodData,
        refetch: refetchFoodData,
    } = api.food.getFoodItemsByMeal.useQuery(
        {
            date: currentDate,
            mealType: mealType as "Breakfast" | "Lunch" | "Dinner" | "Snack",
        },
        {
            enabled: mealType !== "",
        }
    );

    if (isLoadingFoodItems || foodData === undefined) {
        return (
            <Modal visible={isVisible} transparent={true}>
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="w-5/6 bg-white rounded-lg shadow p-5">
                        <ActivityIndicator/>
                    </View>
                </View>
            </Modal>
        );
    }

    if (foodItemsError || foodData instanceof Error) {
        let errorMessage = "";
        if (foodData instanceof Error) {
            errorMessage = foodData.message;
        } else {
            errorMessage = foodItemsError?.message || "An unknown error occurred.";
        }

        return (
            <Modal visible={isVisible} transparent={true}>
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="w-5/6 bg-white rounded-lg shadow p-5">
                        <Text>Sorry, an error occurred... {errorMessage}</Text>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={isVisible} transparent={true}>
            <View className="flex-1 justify-center items-center bg-black/40">
                <View className="h-3/4 w-5/6 bg-white rounded-lg shadow gap-4 p-5">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-semibold">{mealType}</Text>
                        <TouchableOpacity onPress={closeBtnClick}>
                            <X size={24}/>
                        </TouchableOpacity>
                    </View>

                    <View className="flex flex-row h-32 gap-2">
                        <View className="flex flex-1">
                            <View className="flex flex-row justify-between">
                                <Text className="text-sm">Calories:</Text>
                                <Text className="text-sm">
                                    {foodData.foods.reduce(
                                        (sum, food) => sum + food.caloriesInKcal,
                                        0
                                    )}
                                </Text>
                            </View>
                            <View className="flex flex-row justify-between">
                                <Text className="text-sm">Protein:</Text>
                                <Text className="text-sm">
                                    {foodData.foods.reduce(
                                        (sum, food) => sum + food.proteinInG,
                                        0
                                    )}
                                    g
                                </Text>
                            </View>
                            <View className="flex flex-row justify-between">
                                <Text className="text-sm">Carbs:</Text>
                                <Text className="text-sm">
                                    {foodData.foods.reduce((sum, food) => sum + food.carbsInG, 0)}
                                    g
                                </Text>
                            </View>
                            <View className="flex flex-row justify-between">
                                <Text className="text-sm">Fats:</Text>
                                <Text className="text-sm">
                                    {foodData.foods.reduce((sum, food) => sum + food.fatsInG, 0)}g
                                </Text>
                            </View>
                        </View>
                        <View>
                            <ScrollView className="bg-stone-500 h-20 w-40 border border-stone-700">
                                {foodData.foods.map((food, index) => (
                                    <View
                                        key={`${food.name}-${index}`}
                                        className="flex flex-row justify-between bg-stone-300 w-full border-b border-stone-700 p-1"
                                    >
                                        <View className="flex flex-row justify-between gap-1">
                                            <TouchableOpacity
                                                onPress={() =>
                                                    deleteFoodMutation.mutate({
                                                        date: currentDate,
                                                        mealType: mealType,
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
                                {foodData.foods.length === 0 && (
                                    <View className="flex justify-center items-center h-full">
                                        <Text className="text-stone-600 text-xs">No foods yet</Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    </View>

                    <View className="flex flex-col">
                        <View className="flex flex-row items-center gap-1 mb-2">
                            <View
                                className="flex flex-row items-center justify-between flex-1 bg-stone-300 border border-stone-500 rounded-md">
                                <Input
                                    className="bg-transparent border-none"
                                    placeholder={"Search"}
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                ></Input>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (searchTerm.length > 0) {
                                            searchFood();
                                        }
                                    }}
                                    className="px-2"
                                >
                                    <Search size={20} color="#78716c"/>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity>
                                <ScanBarcode size={40}/>
                            </TouchableOpacity>
                        </View>

                        {searchFoodResultData?.foods && (
                            <ScrollView
                                className="max-h-28 w-full border border-stone-500 mb-2 bg-stone-200 rounded-md">
                                {Array.isArray(searchFoodResultData.foods.food) ? (
                                    searchFoodResultData.foods.food.map((item, index) => (
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
                                                        mealType: mealType,
                                                        date: currentDate,
                                                    })
                                                }
                                            >
                                                <PlusCircle size={16}/>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                ) : (
                                    <View
                                        key={searchFoodResultData.foods.food.food_id}
                                        className="flex flex-row justify-between items-center bg-stone-300 w-full border-b border-stone-700 p-1"
                                    >
                                        <Text className="text-sm flex-1">
                                            {searchFoodResultData.foods.food.food_name}
                                        </Text>
                                        <Text className="text-xs text-stone-600 mr-2">
                                            {searchFoodResultData.foods.food.food_description?.match(
                                                /Per \S+/
                                            )?.[0] || ""}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() =>
                                                addFoodWithIdMutation.mutate({
                                                    foodId: (searchFoodResultData.foods.food as FoodItem)
                                                        .food_id,
                                                    mealType: mealType,
                                                    date: currentDate,
                                                })
                                            }
                                        >
                                            <Pen size={16}/>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </ScrollView>
                        )}
                    </View>

                    <View className="bg-stone-400 border border-stone-500 rounded-md p-1 w-3/4 self-center">
                        <View className="flex flex-row justify-around">
                            {["Often", "Favorite", "Last"].map((option, index) => (
                                <View key={`${option}-${index}`}>
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedFoodFilter(option)}
                                    >
                                        <Text
                                            className={
                                                selectedFoodFilter === option
                                                    ? "font-medium underline"
                                                    : "text-stone-600"
                                            }
                                        >
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>

                    <ScrollView className="bg-stone-500 h-40 w-full border border-stone-700">
                        <Text>Not implemented yet</Text>
                    </ScrollView>

                    <View className="flex-row justify-end">
                        <Button onPress={closeBtnClick}>
                            <Text>Ok</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
