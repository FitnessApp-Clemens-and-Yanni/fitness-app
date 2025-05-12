import {useState} from "react";
import {Progress} from "@/components/ui/progress";
import {Text} from "@/components/ui/Text";
import {
    TouchableOpacity,
    View,
} from "react-native";
import {Card} from "@/components/ui/Card";
import {Pen} from "lucide-react-native";
import {api} from "@/utils/react";
import {UserSelect} from "@/components/UserSelect";
import {ErrorDisplay} from "@/components/ErrorDisplay";
import {AddMealModal} from "@/components/food/AddMealModal";
import {LoadingDisplay} from "@/components/LoadingDisplay";

export default function Index() {
    const [modalState, setModalState] = useState({
        visible: false,
        mealType: "",
    });
    const [currentDate] = useState(new Date());

    const {
        isLoading: isLoadingTargets,
        error: targetError,
        data: targetNutritionalData,
    } = api.food.getTargetNutritionalValues.useQuery();

    const {
        isLoading: isLoadingDailyValues,
        error: dailyError,
        data: dailyNutritionalData,
        refetch: refetchDailyData,
    } = api.food.getNutritionalValuesOfDay.useQuery({date: currentDate});

    const handleModalClose = () => {
        refetchDailyData();
        setModalState({visible: false, mealType: ""});
    };

    if (
        isLoadingTargets === true ||
        targetNutritionalData === undefined ||
        isLoadingDailyValues === true ||
        dailyNutritionalData === undefined
    ) {
        return (
            <LoadingDisplay />
        );
    }

    if (targetError instanceof Error || dailyNutritionalData instanceof Error) {
        let errorMessage = "";
        if (dailyNutritionalData instanceof Error) {
            errorMessage = dailyNutritionalData.message;
        } else {
            errorMessage = targetError?.message || "An unknown error occurred.";
        }

        return (
            <ErrorDisplay message={errorMessage}></ErrorDisplay>
        );
    }

    return (
        <View className="flex-1 p-4">
            <UserSelect/>

            {dailyError && (
                <View className="bg-amber-100 p-2 rounded-md mb-2">
                    <Text className="text-amber-800">No data found for today.</Text>
                </View>
            )}

            <View className="flex-1 flex-col justify-between">
                <View className="flex-1 flex-col justify-evenly">
                    <View>
                        <View className="flex flex-row justify-center">
                            <Text>
                                Calories {dailyNutritionalData.caloriesInKcal.toFixed(1)}{" / "}{targetNutritionalData.caloriesInKcal}
                            </Text>
                        </View>
                        <Progress
                            value={
                                (dailyNutritionalData.caloriesInKcal /
                                    targetNutritionalData.caloriesInKcal) *
                                100
                            }
                            className="w-full h-3"
                        />
                    </View>

                    <Text className="text-lg font-semibold pl-4">Nutritional Values</Text>

                    <View className="w-full">
                        <View className="flex flex-row justify-start">
                            <Text>
                                Protein {dailyNutritionalData.proteinInG.toFixed(1)}{" / "}{targetNutritionalData.proteinInG}
                            </Text>
                        </View>
                        <Progress
                            value={
                                (dailyNutritionalData.proteinInG /
                                    targetNutritionalData.proteinInG) *
                                100
                            }
                        />
                    </View>
                    <View className="w-full">
                        <View className="flex flex-row justify-start">
                            <Text>
                                Carbs {dailyNutritionalData.carbsInG.toFixed(1)}{" / "}{targetNutritionalData.carbsInG}
                            </Text>
                        </View>
                        <Progress
                            value={
                                (dailyNutritionalData.carbsInG /
                                    targetNutritionalData.carbsInG) *
                                100
                            }
                        />
                    </View>
                    <View className="w-full">
                        <View className="flex flex-row justify-start">
                            <Text>
                                Fats {dailyNutritionalData.fatsInG.toFixed(1)}{" / "}{targetNutritionalData.fatsInG}
                            </Text>
                        </View>
                        <Progress
                            value={
                                (dailyNutritionalData.fatsInG / targetNutritionalData.fatsInG) *
                                100
                            }
                        />
                    </View>
                </View>

                <View className="flex-1 flex-col justify-evenly">
                    <Card className="flex flex-row justify-between bg-stone-300">
                        <Text className="p-4">Breakfast</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalState({visible: true, mealType: "Breakfast"});
                            }}
                        >
                            <Pen className="m-4"/>
                        </TouchableOpacity>
                    </Card>
                    <Card className="flex flex-row justify-between bg-stone-300">
                        <Text className="p-4">Lunch</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalState({visible: true, mealType: "Lunch"});
                            }}
                        >
                            <Pen className="m-4"></Pen>
                        </TouchableOpacity>
                    </Card>
                    <Card className="flex flex-row justify-between bg-stone-300">
                        <Text className="p-4">Dinner</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalState({visible: true, mealType: "Dinner"});
                            }}
                        >
                            <Pen className="m-4"></Pen>
                        </TouchableOpacity>
                    </Card>
                    <Card className="flex flex-row justify-between bg-stone-300">
                        <Text className="p-4">Snack</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalState({visible: true, mealType: "Snack"});
                            }}
                        >
                            <Pen className="m-4"></Pen>
                        </TouchableOpacity>
                    </Card>
                </View>
            </View>


            <AddMealModal
                isVisible={modalState.visible}
                mealType={modalState.mealType}
                closeBtnClick={handleModalClose}
            />

        </View>
    );
}