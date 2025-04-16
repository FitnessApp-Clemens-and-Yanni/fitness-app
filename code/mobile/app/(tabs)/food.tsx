import {useState} from "react";
import {Progress} from "@/components/ui/progress";
import {Text} from "@/components/ui/Text";
import {TouchableOpacity, View, Modal, ActivityIndicator} from "react-native";
import {Card} from "@/components/ui/Card";
import {Button} from "@/components/ui/Button";
import {PlusCircle, X} from "lucide-react-native";
import {api} from "@/utils/react";

export default function Index() {
    const [addMealModalVisible, setAddMealModalVisible] = useState(false);
    const [currentDate] = useState(new Date());


    const {
        isLoading: isLoadingTargets,
        error: targetError,
        data: targetNutritionalData,
    } = api.food.getTargetNutritionalValues.useQuery();

    // Fetch CURRENT day's nutritional values
    const {
        isLoading: isLoadingDailyValues,
        error: dailyError,
        data: dailyNutritionalData,
    } = api.food.getNutritionalValuesOfDay.useQuery(
        {
            date: currentDate,
        }
    );

    if (isLoadingTargets || isLoadingDailyValues || targetNutritionalData === undefined || dailyNutritionalData === undefined) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator/>
            </View>
        );
    }

    if (targetError || dailyError) {
        const errorMessage = targetError?.message || dailyError?.message;

        return (
            <View className="flex-1 justify-center items-center">
                <Text>Sorry, an error occurred... {errorMessage}</Text>
            </View>
        );
    }

    if (dailyNutritionalData instanceof Error || targetNutritionalData instanceof Error) {
        const errorMessage = dailyNutritionalData instanceof Error ? dailyNutritionalData.message : targetNutritionalData
                                                        instanceof Error ? targetNutritionalData.message : "Unknown error";
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Sorry, an error occurred... {errorMessage}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-4">
            <View className="flex-1 flex-col justify-between">

                <View className="flex-1 flex-col justify-evenly">

                    <View>
                        <View className="flex flex-row justify-center">
                            <Text>Calories {dailyNutritionalData.caloriesInKcal}/{targetNutritionalData.caloriesInKcal}</Text>
                        </View>
                        <Progress
                            value={(dailyNutritionalData.caloriesInKcal / targetNutritionalData.caloriesInKcal) * 100}
                            className="w-full h-3"
                        />
                    </View>

                    <Text className="text-lg font-semibold">Nutritional Values</Text>

                    <View className="w-full">
                        <View className="flex flex-row justify-start">
                            <Text>Protein {dailyNutritionalData.proteinInG}/{targetNutritionalData.proteinInG}</Text>
                        </View>
                        <Progress
                            value={(dailyNutritionalData.proteinInG / targetNutritionalData.proteinInG) * 100}
                        />
                    </View>
                    <View className="w-full">
                        <View className="flex flex-row justify-start">
                            <Text>Carbs {dailyNutritionalData.carbsInG}/{targetNutritionalData.carbsInG}</Text>
                        </View>
                        <Progress
                            value={(dailyNutritionalData.carbsInG / targetNutritionalData.carbsInG) * 100}
                        />
                    </View>
                    <View className="w-full">
                        <View className="flex flex-row justify-start">
                            <Text>Fats {dailyNutritionalData.fatsInG}/{targetNutritionalData.fatsInG}</Text>
                        </View>
                        <Progress
                            value={(dailyNutritionalData.fatsInG / targetNutritionalData.fatsInG) * 100}
                        />
                    </View>

                </View>


                <View className="flex-1 flex-col justify-evenly">
                    <Card className="flex flex-row justify-between bg-stone-300">
                        <Text className="p-4">Breakfast</Text>
                        <TouchableOpacity onPress={() => {
                            setAddMealModalVisible(true);
                        }}>
                            <PlusCircle className="m-4"></PlusCircle>
                        </TouchableOpacity>
                    </Card>
                    <Card className="flex flex-row justify-between bg-stone-300">
                        <Text className="p-4">Lunch</Text>
                        <TouchableOpacity onPress={() => {
                            setAddMealModalVisible(true);
                        }}>
                            <PlusCircle className="m-4"></PlusCircle>
                        </TouchableOpacity>
                    </Card>
                    <Card className="flex flex-row justify-between bg-stone-300">
                        <Text className="p-4">Dinner</Text>
                        <TouchableOpacity onPress={() => {
                            setAddMealModalVisible(true);
                        }}>
                            <PlusCircle className="m-4"></PlusCircle>
                        </TouchableOpacity>
                    </Card>
                    <Card className="flex flex-row justify-between bg-stone-300">
                        <Text className="p-4">Snack</Text>
                        <TouchableOpacity onPress={() => {
                            setAddMealModalVisible(true);
                        }}>
                            <PlusCircle className="m-4"></PlusCircle>
                        </TouchableOpacity>
                    </Card>
                </View>

            </View>


            <AddMealModal
                isVisible={addMealModalVisible}
                onClose={() => setAddMealModalVisible(false)}
            />


        </View>
    );
}

function AddMealModal({isVisible, onClose}: { isVisible: boolean; onClose: () => void }) {
    return (
        <Modal visible={isVisible} transparent={true}>
            <View className="flex-1 justify-center items-center bg-black/40">
                <View className="w-5/6 bg-white rounded-lg shadow p-5">

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-semibold">ASJDFKLÖASDJKFLÖK</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24}/>
                        </TouchableOpacity>
                    </View>

                    <View className="h-40 justify-center items-center">
                        <Text className="text-gray-500">Food selection will go here</Text>
                    </View>

                    <View className="flex-row justify-end mt-4">
                        <Button onPress={onClose}>
                            <Text>Close</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
