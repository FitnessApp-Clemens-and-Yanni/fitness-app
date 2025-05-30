import { useExerciseSetStore } from "@/lib/stores/sport/fe-sets-store";
import { useFinishedSetsStore } from "@/lib/stores/sport/finished-fe-sets-store";
import { useWorkoutTimingStore } from "@/lib/stores/sport/timing-store";
import { useWorkoutStore } from "@/lib/stores/sport/workout-store";
import { WorkoutResponse } from "@/lib/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TimeDisplay } from "@comp/TimeDisplay";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "@ui/Button";
import { Icon } from "@rneui/themed";
import { IconColors } from "@/lib/icon-colors";

export function WorkoutsFooterNavigation(props: {
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
          <Icon
            name="angle-double-left"
            type="font-awesome-5"
            color={IconColors.PRIMARY}
            className="scale-60"
            solid
          />
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
