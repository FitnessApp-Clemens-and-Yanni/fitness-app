import { TouchableOpacity, Text } from "react-native";
import { Card } from "@ui/Card";
import { MealAddingModal } from "@/components/food/meal-modal";
import { Alert } from "@comp/Alert";
import { useEffect, useState } from "react";
import { MealType } from "@server/shared/zod-schemas/meal-type";
import { api } from "@/utils/react";
import { FontAwesomeIcon } from "../font-awesome-icon";
import { AppColors } from "@/lib/app-colors";

export function MealCard(props: { mealType: MealType; currentDate?: Date }) {
  const apiUtils = api.useUtils();

  const [isVisible, setIsVisible] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const date = new Date();

  useEffect(() => {
    if (!isVisible) {
      apiUtils.food.getNutritionalValuesOfDay.invalidate();
    }
  }, [isVisible]);

  const handleMealPress = () => {
    if (
      props.currentDate &&
      date.toDateString() !== props.currentDate.toDateString()
    ) {
      setAlertOpen(true);
    } else {
      setIsVisible(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <>
      <Card className="flex flex-row justify-between bg-stone-300">
        <Text className="p-4 content-center">{props.mealType}</Text>
        <TouchableOpacity onPress={handleMealPress}>
          <FontAwesomeIcon
            name={
              date.toDateString() === props.currentDate?.toDateString()
                ? "pen"
                : "eye"
            }
            color={AppColors.GREY_800}
            className="m-4 scale-[80%]"
          />
        </TouchableOpacity>
      </Card>

      <Alert
        isOpen={alertOpen}
        onOpenChange={handleAlertClose}
        title="Past Date Warning"
        message="You can't add a meal for a past date"
        trigger={<></>}
      />
      <MealAddingModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        mealType={props.mealType}
      />
    </>
  );
}
