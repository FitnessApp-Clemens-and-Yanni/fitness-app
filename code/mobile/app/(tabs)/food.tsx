import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/Text";
import { TouchableOpacity, View, Modal } from "react-native";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlusCircle, X } from "lucide-react-native";

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

export default function Index() {

    const [addMealModalVisible, setAddMealModalVisible] = useState(false);

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
                            <Text>{progressData[0].name} {progressData[0].value}/{progressData[0].total}</Text>
                        </View>
                        <Progress
                            value={(progressData[0].value / progressData[0].total) * 100}
                            className="w-full h-3"
                        />
                    </View>

                    <Text className="text-lg font-semibold">Nutritional Values</Text>

                    {progressData.slice(1).map((data, index) => (
                        <View key={index} className="w-full">
                            <View className="flex flex-row justify-start">
                                <Text>{data.name} {data.value}/{data.total}</Text>
                            </View>
                            <Progress
                                value={(data.value / data.total) * 100}
                            />
                        </View>
                    ))}

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