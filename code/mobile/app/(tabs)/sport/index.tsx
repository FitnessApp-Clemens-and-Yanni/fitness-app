import { EditWorkoutModal } from "@comp/sport/EditWorkoutModal";
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
import { Link } from "expo-router";
import {
  WorkoutExercisePutRequest,
  WorkoutPutRequest,
  WorkoutResponse,
} from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Index() {
  const {
    isLoading,
    error,
    data: workoutsData,
  } = api.workouts.getAll.useQuery();

  return (
    <>
      {isLoading || error ? (
        isLoading ? (
          <FlatList
            data={new Array(5).fill(null).map((_, idx) => idx + 1)}
            renderItem={() => (
              <Skeleton className="mt-2 rounded aspect-square p-2 flex flex-col justify-end w-5/12"></Skeleton>
            )}
            className="mt-5 flex-1"
            contentContainerClassName="gap-5"
            columnWrapperClassName="justify-evenly"
            numColumns={2}
          />
        ) : (
          <Text>Sorry, an error occured... {error!.message}</Text>
        )
      ) : (
        <FlatList
          data={workoutsData ?? []}
          renderItem={({ item }) => <SingleWorkout workoutResponse={item} />}
          className="mt-5"
          contentContainerClassName="gap-5"
          columnWrapperClassName="justify-evenly"
          keyExtractor={(item) => item._id}
          numColumns={2}
        />
      )}
    </>
  );
}

function SingleWorkout({
  workoutResponse,
}: {
  workoutResponse: WorkoutResponse;
}) {
  const [workoutModel, setWorkoutModel] = useState<
    WorkoutPutRequest | undefined
  >();

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
              <Link
                href={{
                  pathname: "/sport/workouts",
                  params: {
                    workoutResponse: JSON.stringify(workoutResponse),
                  },
                }}
                asChild
              >
                <Button>
                  <Text>Start</Text>
                </Button>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
