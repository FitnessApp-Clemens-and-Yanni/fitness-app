import { TouchableOpacity, Text } from "react-native";
import { Eye, Pen } from "lucide-react-native";
import { Card } from "@ui/Card";
import { AddMealModal } from "@comp/food/MealModal/AddMealModal";
import { Alert } from "@comp/Alert";
import { useState } from "react";

export function MealCard(props: {
  mealType: string;
  refetchDailyData: () => void;
  currentDate?: Date;
}) {
  const [modalState, setModalState] = useState({
    visible: false,
    mealType: "",
  });

  const [alertOpen, setAlertOpen] = useState(false);

  const date = new Date();

  const handleModalClose = () => {
    props.refetchDailyData();
    setModalState({ visible: false, mealType: "" });
  };

  const handleMealPress = () => {
    if (
      props.currentDate &&
      date.toDateString() !== props.currentDate.toDateString()
    ) {
      setAlertOpen(true);
    } else {
      setModalState({ visible: true, mealType: props.mealType });
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <Card className="flex flex-row justify-between bg-stone-300">
      <Text className="p-4 content-center">{props.mealType}</Text>
      <TouchableOpacity onPress={handleMealPress}>
        {date.toDateString() === props.currentDate?.toDateString() ? (
          <Pen className="m-4" />
        ) : (
          <Eye className="m-4" />
        )}
      </TouchableOpacity>

      <Alert
        isOpen={alertOpen}
        onOpenChange={handleAlertClose}
        title="Past Date Warning"
        message="You can't add a meal for a past date"
        trigger={<></>}
      />

      <AddMealModal
        isVisible={modalState.visible}
        mealType={modalState.mealType}
        closeBtnClick={handleModalClose}
      />
    </Card>
  );
}
