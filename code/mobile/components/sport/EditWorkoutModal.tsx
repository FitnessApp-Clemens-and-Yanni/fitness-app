import { GripVertical, Plus, X } from "lucide-react-native";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "@ui/Card";
import { Button } from "@ui/Button";
import { api } from "@/utils/react";

export function EditWorkoutModal({
  workoutModel,
  setWorkoutModel,
  setExerciseSetCount,
}: {
  workoutModel: WorkoutPutRequest | undefined;
  setWorkoutModel: React.Dispatch<
    React.SetStateAction<WorkoutPutRequest | undefined>
  >;
  setExerciseSetCount: (
    text: string,
    exercise: WorkoutExercisePutRequest,
  ) => void;
}) {
  const apiUtils = api.useUtils();

  const mutation = api.workouts.setWorkout.useMutation({
    onSuccess: (data) => {
      apiUtils.workouts.getAll.setData((() => {})(), (oldWorkouts) => {
        if (oldWorkouts === undefined) {
          return [];
        }

        if (data instanceof Error) {
          console.error(data.message);
          return [];
        }
        return oldWorkouts.map((wo) => (wo._id === data._id ? data : wo));
      });

      apiUtils.workouts.getAll.invalidate();
    },
  });

  return (
    <Modal transparent={true} visible={workoutModel !== undefined}>
      <View className="flex-1 py-7 px-5">
        <View className="flex-1 bg-gray-200/95 ring-1 ring-primary">
          <View className="flex flex-row justify-between bg-primary/90 p-5">
            <Text className="text-2xl font-thin">{workoutModel?.name}</Text>
            <TouchableOpacity onPress={() => setWorkoutModel(undefined)}>
              <X />
            </TouchableOpacity>
          </View>
          <ScrollView className="p-5 flex-1">
            {workoutModel?.exercises
              .toSorted((e) => e.sorting)
              .map((exercise) => (
                <Card
                  className="flex-row py-5 gap-5 mb-2 pr-5 items-center"
                  key={exercise._id}
                >
                  <GripVertical />
                  <View className="flex-1 flex-row items-center">
                    <Text>{exercise.name}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text>Sets:</Text>
                    <TextInput
                      className="w-7 ring-1 ring-primary rounded py-2 text-center"
                      value={exercise.numberOfSets.toString()}
                      onChangeText={(text) =>
                        setExerciseSetCount(text, exercise)
                      }
                    />
                  </View>
                </Card>
              ))}
          </ScrollView>
          <View className="flex-row justify-end gap-5 p-5">
            <Button>
              <Plus />
            </Button>
            <Button
              onPress={() => {
                mutation.mutate({
                  _id: workoutModel!._id,
                  userId: "gugi",
                  name: workoutModel!.name,
                  ...workoutModel,
                  exercises: workoutModel!.exercises,
                });
                setWorkoutModel(undefined);
              }}
            >
              <Text>Save</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
