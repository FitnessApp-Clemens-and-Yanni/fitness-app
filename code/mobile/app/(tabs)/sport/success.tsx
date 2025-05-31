import { TimeDisplay } from "@comp/TimeDisplay";
import { Button } from "@ui/Button";
import { Card } from "@ui/Card";
import { useFinishedSetsStore } from "@/lib/stores/sport/finished-fe-sets-store";
import { useWorkoutTimingStore } from "@/lib/stores/sport/timing-store";
import { useWorkoutStore } from "@/lib/stores/sport/workout-store";
import { api } from "@/utils/react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useUserStore } from "@/lib/stores/user-store";

export default function SuccessScreen() {
  const { startTimestamp, currentTimestamp } = useWorkoutTimingStore();

  return (
    <View className="flex-1">
      <View className="flex-1 bg-gradient-to-br from-primary to-red-500 items-center justify-center">
        <Card className="gap-5 text-center p-5 max-w-72 shadow-primary">
          <Text className="text-lg">
            <Text className="font-bold italic">Congrats</Text>, you finished
            your workout and it took you
          </Text>
          <TimeDisplay
            className="text-5xl text-center"
            timeInMinutes={(currentTimestamp! - startTimestamp!) / 60_000}
          />
          <Text className="text-lg">minutes!</Text>
          <View className="justify-end">
            <DismissButton />
          </View>
        </Card>
      </View>
    </View>
  );
}

function DismissButton() {
  const finishedSetStore = useFinishedSetsStore();
  const { selectedWorkout } = useWorkoutStore();
  const router = useRouter();
  const { currentTimestamp, startTimestamp, stopTimes } =
    useWorkoutTimingStore();

  const userStore = useUserStore();

  const apiUtils = api.useUtils();

  const finishWorkoutMutation = api.workouts.finishWorkout.useMutation({
    onSuccess: () => {
      apiUtils.snapshots.getExerciseDefaultsForWorkout.invalidate();
    },
  });

  const onDismiss = async () => {
    router.dismiss();

    stopTimes();
    finishedSetStore.reset();

    if (selectedWorkout === undefined) {
      return;
    }

    await finishWorkoutMutation.mutateAsync({
      userId: userStore.currentUser,
      workoutId: selectedWorkout._id,
      workoutName: selectedWorkout.name,
      totalTimeInMinutes: (currentTimestamp! - startTimestamp!) / 60_000,
      exercises: Object.values(
        Object.groupBy(finishedSetStore.finishedSets, (x) => x.exerciseId),
      ).map((sets) => {
        return {
          id: sets![0].exerciseId,
          sets: finishedSetStore.finishedSets
            .filter((set) => set.exerciseId === sets![0].exerciseId)
            .map((finishedSet) => ({
              weightsInKg: finishedSet.weightsInKg,
              repetitions: finishedSet.repetitions,
            })),
        };
      }),
    });
  };

  return (
    <Button onPress={onDismiss}>
      <Text className="font-bold text-white">Yay! :D</Text>
    </Button>
  );
}
