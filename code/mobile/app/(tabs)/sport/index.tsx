import { EditWorkoutModal } from "@comp/sport/EditWorkoutModal";
import { StartWorkoutModal } from "@comp/sport/StartWorkoutModal";
import { Button } from "@ui/Button";
import { api } from "@/utils/react";
import { Pen } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

export default function Index() {
  const {
    isLoading,
    error,
    data: workoutsData,
  } = api.workouts.getAll.useQuery();

  if (isLoading) {
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

  return (
    <FlatList
      data={workoutsData ?? []}
      renderItem={({ item }) => <Workout workoutResponse={item} />}
      className="mt-5"
      contentContainerClassName="gap-5"
      columnWrapperClassName="justify-evenly"
      keyExtractor={(item) => item._id}
      numColumns={2}
    />
  );
}

function Workout({ workoutResponse }: { workoutResponse: WorkoutResponse }) {
  const [workoutModel, setWorkoutModel] = useState<
    WorkoutPutRequest | undefined
  >();

  const [selectedWorkout, setSelectedWorkout] = useState<
    WorkoutPutRequest | undefined
  >();
  const [selectedExercise, setSelectedExercise] = useState<
    WorkoutExercisePutRequest | undefined
  >();

  const startWorkout = () => {
    setSelectedWorkout({
      _id: workoutResponse._id,
      name: workoutResponse.name,
      exercises: workoutResponse.exercises.map((exercise) => ({
        _id: exercise._id,
        name: exercise.name,
        noteText: exercise.noteText,
        sorting: exercise.sorting,
        numberOfSets: exercise.numberOfSets,
      })),
    });
  };

  const startUpdatingWorkout = () => {
    setWorkoutModel({
      _id: workoutResponse._id,
      name: workoutResponse.name,
      exercises: workoutResponse.exercises.map((exercise) => ({
        _id: exercise._id,
        name: exercise.name,
        noteText: exercise.noteText,
        sorting: exercise.sorting,
        numberOfSets: exercise.numberOfSets,
      })),
    });
  };

  const setExerciseSetCount = (
    text: string,
    exercise: WorkoutExercisePutRequest,
  ) => {
    if (text === "") {
      const idx = workoutModel!.exercises.indexOf(exercise);
      setWorkoutModel({
        ...workoutModel!,
        exercises: workoutModel!.exercises.with(idx, {
          ...workoutModel!.exercises[idx],
          numberOfSets: 0,
        }),
      });
      return;
    }

    if (!/^\d{1,2}$/.test(text)) {
      return;
    }

    const idx = workoutModel!.exercises.indexOf(exercise);
    setWorkoutModel({
      ...workoutModel!,
      exercises: workoutModel!.exercises.with(idx, {
        ...workoutModel!.exercises[idx],
        numberOfSets: +text,
      }),
    });
  };

  return (
    <>
      <EditWorkoutModal
        workoutModel={workoutModel}
        setWorkoutModel={setWorkoutModel}
        setExerciseSetCount={setExerciseSetCount}
      />

      <StartWorkoutModal
        workoutResponse={workoutResponse}
        selectedExercise={selectedExercise}
        selectedWorkout={selectedWorkout}
        setSelectedExercise={setSelectedExercise}
        setSelectedWorkout={setSelectedWorkout}
      />

      <View className="mt-2 w-5/12 ring-2 ring-primary bg-neutral-300 rounded aspect-square p-2 flex flex-col justify-end">
        <Text className="flex-1 text-xl p-3">{workoutResponse.name}</Text>
        <View className="flex-[3] flex flex-col justify-end items-between">
          <View className="flex-1 flex flex-row items-end">
            <TouchableOpacity
              onPress={startUpdatingWorkout}
              className="flex-[2] flex flex-row justify-center items-center h-10"
            >
              <Pen />
            </TouchableOpacity>
            <View className="flex-[5] flex flex-row justify-end items-center">
              <Button onPress={startWorkout}>
                <Text>Start</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
