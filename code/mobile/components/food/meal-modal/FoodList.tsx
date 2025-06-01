import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { MealEntry } from "@server/data/meta/models";
import { api } from "@/utils/react";
import { FontAwesomeIcon } from "@/components/font-awesome-icon";
import { AppColors } from "@/lib/app-colors";
import { MealType } from "shared/build/zod-schemas/meal-type.js";
import { useUserStore } from "@/lib/stores/user-store";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";

export function FoodList(props: {
  foodData: MealEntry;
  currentDate: Date;
  refetchFoodData: () => void;
  mealType: MealType;
}) {
  const userStore = useUserStore();
  const deleteFoodMutation = api.food.deleteFoodOfDayByMeal.useMutation({
    onSuccess: () => {
      props.refetchFoodData();
    },
    onError: (error) => {
      console.error("Error deleting food:", error.message);
    },
  });

  return (
    <View className="h-32">
      {props.foodData.foods.length === 0 ? (
        <Skeleton className="justify-center items-center h-full rounded w-40 p-1 bg-primary/50">
          <Text className="tracking-wider font-bold">No food items yet</Text>
        </Skeleton>
      ) : (
        <ScrollView
          className="bg-primary/50 rounded w-40 p-1"
          contentContainerClassName="gap-1"
        >
          {props.foodData.foods.map((food, index) => (
            <Card
              key={`${food.name}-${index}`}
              className="flex-row justify-between w-full items-center px-1 gap-1 shadow shadow-gray-700/25"
            >
              <TouchableOpacity
                onPress={() =>
                  deleteFoodMutation.mutate({
                    userId: userStore.currentUser,
                    date: props.currentDate,
                    mealType: props.mealType,
                    foodName: food.name,
                  })
                }
              >
                <FontAwesomeIcon
                  name="trash"
                  color={AppColors.RED_200}
                  className="self-center flex scale-[65%]"
                />
              </TouchableOpacity>

              <Text className="text-xs self-center flex break-words text-pretty">
                {food.name}
              </Text>

              <Text className="text-xs self-center">{food.weightInG}g</Text>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
