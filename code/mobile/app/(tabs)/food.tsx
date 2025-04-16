import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/Text";
import {TouchableOpacity, View, Modal, ActivityIndicator} from "react-native";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlusCircle, X } from "lucide-react-native";
import { api } from "@/utils/react";

export default function Index() {

    const [addMealModalVisible, setAddMealModalVisible] = useState(false);

    // Fetch target nutritional values from the API
    const {
        isLoading,
        error,
        data: targetNutritionalValue,
    } = api.food.getTargetNutritionalValues.useQuery();

    if (isLoading || targetNutritionalValue === undefined) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Sorry, an error occured... {error.message}</Text>
            </View>
        );
    }

    // Sample progress data
    const progressData = [
        { value: 80, total: 100, name: "Calories" },
        { value: 45, total: 150, name: "Protein" },
        { value: 120, total: 200, name: "Carbs" },
        { value: 30, total: 50, name: "Fats" },
    ];

    return (
        <View className="flex-1 p-4">
            <View className="flex-1 flex-col justify-between">

                <View className="flex-1 flex-col justify-evenly">

                    <View>
                        <View className="flex flex-row justify-center">
                            <Text>{progressData[0].name} {progressData[0].value}/{targetNutritionalValue.caloriesInKcal}</Text>
                        </View>
                        <Progress
                            value={(progressData[0].value / targetNutritionalValue.caloriesInKcal) * 100}
                            className="w-full h-3"
                        />
                    </View>

                    <Text className="text-lg font-semibold">Nutritional Values</Text>

                    <View className="w-full">
                        <View className="flex flex-row justify-start">
                            <Text>{progressData[1].name} {progressData[1].value}/{targetNutritionalValue.proteinInG}</Text>
                        </View>
                        <Progress
                            value={(progressData[1].value / targetNutritionalValue.proteinInG) * 100}
                        />
                    </View>
                    <View className="w-full">
                        <View className="flex flex-row justify-start">
                            <Text>{progressData[2].name} {progressData[2].value}/{targetNutritionalValue.carbsInG}</Text>
                        </View>
                        <Progress
                            value={(progressData[2].value / targetNutritionalValue.carbsInG) * 100}
                        />
                    </View>
                    <View className="w-full">
                        <View className="flex flex-row justify-start">
                            <Text>{progressData[3].name} {progressData[3].value}/{targetNutritionalValue.fatsInG}</Text>
                        </View>
                        <Progress
                            value={(progressData[3].value / targetNutritionalValue.fatsInG) * 100}
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


            {/* Add Meal Modal */}
            <AddMealModal
                isVisible={addMealModalVisible}
                onClose={() => setAddMealModalVisible(false)}
            />
        </View>
    );
}

function AddMealModal({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
    return (
        <Modal visible={isVisible} transparent={true}>
            <View className="flex-1 justify-center items-center bg-black/40">
                <View className="w-5/6 bg-white rounded-lg shadow p-5">



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
