import { EditWorkoutModal } from "@/components/EditWorkoutModal";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { H1, H2, H3, H4 } from "@/components/ui/Typography";
import { getWorkouts } from "@/lib/getWorkouts";
import { generateUUID } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, Pen } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

export default function Index() {
  const {
    isLoading,
    error,
    data: workoutsData,
  } = useQuery({
    queryKey: ["workouts"],
    queryFn: getWorkouts,
  });

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
      data={workoutsData}
      renderItem={({ item }) => (
        <Workout workoutResponse={item} workoutsData={workoutsData} />
      )}
      className="mt-5"
      contentContainerClassName="gap-5"
      columnWrapperClassName="justify-evenly"
      keyExtractor={(item) => item._id}
      numColumns={2}
    />
  );
}

function Workout({
  workoutResponse,
  workoutsData: workoutsResponse,
}: {
  workoutResponse: WorkoutResponse;
  workoutsData: WorkoutResponse[] | undefined;
}) {
  const [workoutModel, setWorkoutModel] = useState<Workout | undefined>();

  const [selectedWorkout, setSelectedWorkout] = useState<Workout | undefined>();
  const [selectedExercise, setSelectedExercise] = useState<
    WorkoutExercise | undefined
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

  const setExerciseSetCount = (text: string, exercise: WorkoutExercise) => {
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

      <Modal
        visible={selectedWorkout !== undefined}
        className="text-white flex-1"
      >
        <H1 className="m-5">{selectedWorkout?.name}</H1>

        <ScrollView horizontal={true} className="flex-1 py-5 px-4">
          {selectedWorkout?.exercises.map((exercise) => (
            <Card key={exercise._id} className="aspect-square mr-5">
              <TouchableOpacity
                className="p-2 aspect-square"
                onPress={() => setSelectedExercise(exercise)}
              >
                <Text className="text-[.75em]">{exercise.name}</Text>
              </TouchableOpacity>
            </Card>
          ))}
        </ScrollView>
        <View className="flex-[8]">
          <ScrollView className="flex-1 p-5">
            {selectedExercise === undefined ? (
              <H3>Select an exercise!</H3>
            ) : (
              <View className="gap-5">
                <H2 className="m-2">{selectedExercise?.name}</H2>
                <View className="flex-1 flex-row justify-evenly">
                  <Card className="py-3 px-2 justify-center">
                    <Text>kg</Text>
                  </Card>
                  <Card className="py-3 px-2 justify-center">
                    <Text>reps</Text>
                  </Card>
                  <Card className="py-3 px-2 justify-center">
                    <Text>vol</Text>
                  </Card>
                  <View className="px-7"></View>
                </View>
                <ScrollView>
                  {new Array(selectedExercise?.numberOfSets)
                    .fill(null)
                    .map((_) => (
                      <Card className="mb-1" key={generateUUID()}>
                        <View className="flex-1 flex-row justify-evenly items-center py-2">
                          <Text className="text-md">95</Text>
                          <Text className="text-md">9</Text>
                          <Text className="text-md">1710</Text>
                          <TouchableOpacity>
                            <Check />
                          </TouchableOpacity>
                        </View>
                      </Card>
                    ))}
                </ScrollView>
                <View className="flex-1"></View>
                <H4>Previous records</H4>
                <ScrollView>
                  {new Array(selectedExercise?.numberOfSets)
                    .fill(null)
                    .map((_) => (
                      <Card className="mb-1 bg-gray-200" key={generateUUID()}>
                        <View className="flex-1 flex-row justify-evenly items-center py-2">
                          <Text className="text-md">95</Text>
                          <Text className="text-md">9</Text>
                          <Text className="text-md">1710</Text>
                        </View>
                      </Card>
                    ))}
                </ScrollView>
              </View>
            )}
          </ScrollView>
          <View className="flex-row justify-between p-5 items-center">
            <TouchableOpacity onPress={() => setSelectedWorkout(undefined)}>
              <Text>Go Back</Text>
            </TouchableOpacity>
            <Button>
              <Text>Start Workout</Text>
            </Button>
          </View>
        </View>
      </Modal>

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
