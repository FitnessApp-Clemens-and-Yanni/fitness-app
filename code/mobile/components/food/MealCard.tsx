import {Text} from "@/components/ui/Text";
import {TouchableOpacity} from "react-native";
import {Pen} from "lucide-react-native";
import {Card} from "@/components/ui/Card";
import {AddMealModal} from "@/components/food/MealModal/AddMealModal";
import {useState} from "react";

export function MealCard(props: {
    mealType: string,
    refetchDailyData: () => void,
}){

    const [modalState, setModalState] = useState({
        visible: false,
        mealType: "",
    });

    const handleModalClose = () => {
        props.refetchDailyData();
        setModalState({visible: false, mealType: ""});
    };

    return (
        <Card className="flex flex-row justify-between bg-stone-300">
            <Text className="p-4">{props.mealType}</Text>
            <TouchableOpacity
                onPress={() => {
                    setModalState({visible: true, mealType: props.mealType});
                }}
            >
                <Pen className="m-4"/>
            </TouchableOpacity>

            <AddMealModal
                isVisible={modalState.visible}
                mealType={modalState.mealType}
                closeBtnClick={handleModalClose}
            />
        </Card>
    )
}