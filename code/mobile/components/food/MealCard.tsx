import { TouchableOpacity, Text } from "react-native";
import { Card } from "@ui/Card";
import { MealAddingModal } from "@comp/food/meal-modal";
import { Alert } from "@comp/Alert";
import { useEffect, useState } from "react";
import { MealType } from "shared/build/zod-schemas/meal-type.js";
import { api } from "@/utils/react";
import { FontAwesomeIcon } from "@comp/font-awesome-icon";
import { AppColors } from "@/lib/app-colors";
import { useUserStore } from "@/lib/stores/user-store";
import { NutritionalValueOfDay } from "@server/data/meta/models";

export function MealCard(props: { mealType: MealType; currentDate?: Date }) {
  const apiUtils = api.useUtils();
  const userStore = useUserStore();

  const [isVisible, setIsVisible] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const { isLoading: isLoadingDailyValues, data: dailyNutritionalData } =
    api.food.getNutritionalValuesOfDay.useQuery({
      userId: userStore.currentUser,
      date: props.currentDate!,
    });

  (dailyNutritionalData as NutritionalValueOfDay).breakfastMeals.foods
    .map((x) => x.caloriesInKcal)
    .reduce((a, b) => a + b);

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
      <Card className="flex flex-row items-center bg-stone-300">
        <Text className="p-4 content-center flex-1">{props.mealType}</Text>
        <Text>
          {!isLoadingDailyValues && dailyNutritionalData
            ? getCaloriesFromNutritionalValueOfDay(
                dailyNutritionalData,
                props.mealType,
              )
            : "?"}
          {" calories"}
        </Text>
        <TouchableOpacity onPress={handleMealPress}>
          <FontAwesomeIcon
            name={
              date.toDateString() === props.currentDate?.toDateString()
                ? "pen"
                : "eye"
            }
            color={AppColors.GRAY_800}
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

function getCaloriesFromNutritionalValueOfDay(
  val: NutritionalValueOfDay | "NoEntries",
  mealType: MealType,
) {
  if (val === "NoEntries") {
    return 0;
  }

  const meals =
    mealType === "Breakfast"
      ? val.breakfastMeals
      : mealType === "Lunch"
        ? val.lunchMeals
        : mealType === "Dinner"
          ? val.dinnerMeals
          : val.snackMeals;

  return meals.foods.reduce((acc, cur) => acc + cur.caloriesInKcal, 0);
}
