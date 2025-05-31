import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { H1, H3 } from "@ui/Typography";
import { Card } from "@ui/Card";
import { useEffect, useState } from "react";
import { EditSetModal } from "@comp/sport/EditSetModal";
import { useExerciseSetStore } from "@/lib/stores/sport/fe-sets-store";
import { useFinishedSetsStore } from "@/lib/stores/sport/finished-fe-sets-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelectedWorkoutStore } from "@/lib/stores/sport/selected-workout-store";
import { useEditModalStore } from "@/lib/stores/sport/fe-set-edit-store";
import { WorkoutResponse } from "@/lib/types";
import { SetsView } from "@comp/sport/sets-view/SetsView";
import { WorkoutsFooterNavigation } from "@comp/sport/WorkoutsFooterNavigation";
import { useUserStore } from "@/lib/stores/user-store";

export default function WorkoutsPage() {
  const { selectedWorkout, setSelectedWorkout, selectedExercise } =
    useSelectedWorkoutStore();

  const workoutResponse: WorkoutResponse = JSON.parse(
    useLocalSearchParams<{ workoutResponse: string }>().workoutResponse,
  );
  const finishedSetStore = useFinishedSetsStore();
  const { editModalValues, setEditModalValues } = useEditModalStore();
  const frontendSetsStore = useExerciseSetStore();

  const userStore = useUserStore();
  const [userAtBegin] = useState(userStore.currentUser);

  const router = useRouter();

  useEffect(() => {
    if (userStore.currentUser != userAtBegin) {
      router.dismissTo("/sport");
    }
  }, [userStore.currentUser]);

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

      <View className="h-36">
        <ExercisesScrollView />
      </View>

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
  const { selectedWorkout, setSelectedExercise } = useSelectedWorkoutStore();

  return (
    <ScrollView
      horizontal={true}
      className="flex-1 py-5 px-4"
      contentContainerClassName="gap-4"
    >
      {selectedWorkout?.exercises.map((exercise) => (
        <Card key={exercise._id} className="w-28 h-28 break-words text-pretty">
          {/* Aspect Square not working on Safari on IOS here, FSR => w-28 h-28 */}
          <TouchableOpacity
            className="p-2 flex-1 bg-primary rounded"
            onPress={() => setSelectedExercise(exercise)}
          >
            <Text className="text-sm text-pink-100 font-bold">
              {exercise.name}
            </Text>
          </TouchableOpacity>
        </Card>
      ))}
    </ScrollView>
  );
}
