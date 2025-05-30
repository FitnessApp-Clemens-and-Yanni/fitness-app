import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { H1, H3 } from "@ui/Typography";
import { Card } from "@ui/Card";
import { Button } from "@ui/Button";
import { ArrowBigLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { TimeDisplay } from "@comp/TimeDisplay";
import { EditSetModal } from "@comp/sport/EditSetModal";
import { useExerciseSetStore } from "@/lib/stores/sport/fe-sets-store";
import { useFinishedSetsStore } from "@/lib/stores/sport/finished-fe-sets-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useWorkoutStore } from "@/lib/stores/sport/workout-store";
import { useWorkoutTimingStore } from "@/lib/stores/sport/timing-store";
import { useEditModalStore } from "@/lib/stores/sport/fe-set-edit-store";
import { WorkoutResponse } from "@/lib/types";
import { SetsView } from "@/components/sport/sets-view/SetsView";

export default function WorkoutsPage() {
  const { selectedWorkout, setSelectedWorkout, selectedExercise } =
    useWorkoutStore();

  const workoutResponse: WorkoutResponse = JSON.parse(
    useLocalSearchParams<{ workoutResponse: string }>().workoutResponse,
  );

  const router = useRouter();

  useEffect(() => {
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
  }, []);

  const finishedSetStore = useFinishedSetsStore();

  const { editModalValues, setEditModalValues } = useEditModalStore();

  const frontendSetsStore = useExerciseSetStore();

  return selectedExercise !== undefined && editModalValues !== undefined ? (
    <EditSetModal
      isModalVisible={editModalValues !== undefined}
      hideModal={() => setEditModalValues(undefined)}
      currentWeightsInKg={editModalValues.weightsInKg}
      setCurrentSet={(weights, reps) => {
        frontendSetsStore.upsertSetForExercise(selectedExercise._id, {
          idx: editModalValues.idx,
          repetitions: reps,
          weightsInKg: weights,
        });
        finishedSetStore.updateSetIfExists({
          exerciseId: selectedExercise._id,
          setIndex: editModalValues.idx,
          weightsInKg: weights,
          repetitions: reps,
        });
      }}
      currentRepetitions={editModalValues.repetitions}
    />
  ) : (
    <View className="flex-1">
      <H1 className="m-5">{selectedWorkout?.name}</H1>

      <ExercisesScrollView />

      <View className="flex-[8]">
        <ScrollView className="flex-1 p-5">
          {selectedExercise === undefined ? (
            <H3>Select an exercise...</H3>
          ) : (
            <SetsView />
          )}
        </ScrollView>

        <WorkoutsFooterNavigation
          onSuccess={() => router.navigate("/sport/success")}
          workoutResponse={workoutResponse}
        />
      </View>
    </View>
  );
}

function ExercisesScrollView() {
  const { selectedWorkout, setSelectedExercise } = useWorkoutStore();

  return (
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
  );
}

function WorkoutsFooterNavigation(props: {
  workoutResponse: WorkoutResponse;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const { setSelectedExercise, setSelectedWorkout } = useWorkoutStore();
  const exerciseSetStore = useExerciseSetStore();
  const finishedSetStore = useFinishedSetsStore();
  const {
    startTimestamp,
    setStartTimestamp,
    currentTimestamp,
    setCurrentTimestamp,
  } = useWorkoutTimingStore();

  const [timingInterval, setTimingInterval] = useState<
    NodeJS.Timeout | undefined
  >();

  return (
    <View className="flex-row justify-between p-5 items-center">
      {startTimestamp !== undefined ? (
        <TimeDisplay
          timeInMinutes={(currentTimestamp! - startTimestamp) / 60_000}
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            exerciseSetStore.reset();
            setSelectedExercise(undefined);
            setSelectedWorkout(undefined);
            router.dismissTo("/sport");
          }}
        >
          <Text>
            <ArrowBigLeft />
          </Text>
        </TouchableOpacity>
      )}
      {startTimestamp !== undefined ? (
        <View className="flex-row gap-5">
          <Button
            onPress={() => {
              clearInterval(timingInterval);
              setTimingInterval(undefined);

              setStartTimestamp(undefined);
              setCurrentTimestamp(undefined);
              finishedSetStore.reset();
            }}
          >
            <Text>Cancle Workout</Text>
          </Button>
          <Button
            onPress={() => {
              clearInterval(timingInterval);
              setTimingInterval(undefined);
              props.onSuccess();
              // setShowSuccessScreen(true);
            }}
          >
            <Text>Finish Workout</Text>
            <Text className="text-sm">
              (
              {props.workoutResponse?.exercises.reduce(
                (acc, cur) => acc + cur.numberOfSets,
                0,
              ) - finishedSetStore.finishedSets.length}{" "}
              exercises left)
            </Text>
          </Button>
        </View>
      ) : (
        <Button
          onPress={() => {
            setStartTimestamp(Date.now());
            setCurrentTimestamp(Date.now());
            setTimingInterval(
              setInterval(() => {
                setCurrentTimestamp(Date.now());
              }, 500),
            );
          }}
        >
          <Text>Start Workout</Text>
        </Button>
      )}
    </View>
  );
}

// TODO: Fix time going on after success screen shown
