import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "@ui/Card";
import { api } from "@/utils/react";
import {
  WorkoutExercisePutRequest,
  WorkoutPutRequest,
} from "@/lib/tabs/sport/types";
import { useUserStore } from "@/lib/stores/user-store";
import { FontAwesomeIcon } from "../font-awesome-icon";
import { AppColors } from "@/lib/app-colors";
import { useWorkoutEditStore } from "@/lib/stores/sport/workout-edit-store";

export function EditWorkoutModal() {
  const workoutEditStore = useWorkoutEditStore();

  const apiUtils = api.useUtils();
  const userStore = useUserStore();

  const mutation = api.workouts.setWorkout.useMutation({
    onSuccess: (data) => {
      apiUtils.workouts.getAll.setData(
        { userId: userStore.currentUser },
        (oldWorkouts) => {
          if (oldWorkouts === undefined) {
            return [];
          }

          if (data instanceof Error) {
            console.error(data.message);
            return [];
          }
          return oldWorkouts.map((wo) => (wo._id === data._id ? data : wo));
        },
      );
    },
  });

  return (
    <Modal
      transparent={true}
      visible={workoutEditStore.workoutBeingEdited !== undefined}
    >
      <View className="flex-1 py-7 px-5">
        <View className="flex-1 bg-gray-200/95 ring-1 ring-primary">
          <View className="flex flex-row justify-between bg-primary/90 p-5">
            <Text className="text-2xl font-bold text-white">
              {workoutEditStore.workoutBeingEdited?.name}
            </Text>
            <TouchableOpacity
              onPress={() => workoutEditStore.setWorkoutBeingEdited(undefined)}
              className="rounded-full aspect-square"
            >
              <FontAwesomeIcon name="times" color={AppColors.WHITE} />
            </TouchableOpacity>
          </View>
          <ScrollView className="p-5 flex-1">
            {workoutEditStore.workoutBeingEdited?.exercises
              .toSorted((e) => e.sorting)
              .map((exercise) => (
                <EditWorkoutExercise exercise={exercise} key={exercise._id} />
              ))}
          </ScrollView>
          <View className="flex-row justify-end gap-5 p-5">
            <TouchableOpacity className="rounded-full aspect-square bg-primary px-2 pl-[0.57rem] justify-center">
              <FontAwesomeIcon
                name="plus"
                color={AppColors.WHITE}
                className="text-center"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-full aspect-square bg-primary px-2 pl-[0.57rem] justify-center"
              onPress={() => {
                mutation.mutate({
                  userId: userStore.currentUser,
                  ...workoutEditStore.workoutBeingEdited!,
                });
                workoutEditStore.setWorkoutBeingEdited(undefined);
              }}
            >
              <FontAwesomeIcon
                name="save"
                color={AppColors.WHITE}
                className="scale-95"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function EditWorkoutExercise(props: { exercise: WorkoutExercisePutRequest }) {
  const { workoutBeingEdited, setWorkoutBeingEdited } = useWorkoutEditStore();

  const setExerciseFESets = (
    text: string,
    exercise: WorkoutExercisePutRequest,
  ) => {
    if (!/^\d{0,2}$/.test(text)) {
      return;
    }

    const idx = workoutBeingEdited!.exercises.indexOf(exercise);
    setWorkoutBeingEdited({
      ...workoutBeingEdited!,
      exercises: workoutBeingEdited!.exercises.with(idx, {
        ...workoutBeingEdited!.exercises[idx],
        numberOfSets: text === "" ? 0 : +text,
      }),
    });
  };

  return (
    <Card className="flex-row py-5 gap-5 mb-2 pr-5 items-center">
      <FontAwesomeIcon
        name="grip-vertical"
        color={AppColors.GRAY_700}
        className="ml-2"
      />
      <View className="flex-1 flex-row items-center">
        <Text>{props.exercise.name}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Text>Sets:</Text>
        <TextInput
          className="w-7 ring-1 ring-primary rounded py-2 text-center"
          value={props.exercise.numberOfSets.toString()}
          onChangeText={(text) => setExerciseFESets(text, props.exercise)}
        />
      </View>
    </Card>
  );
}
