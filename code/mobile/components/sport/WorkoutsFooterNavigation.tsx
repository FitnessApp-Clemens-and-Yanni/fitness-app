import { useExerciseSetStore } from "@/lib/stores/sport/fe-sets-store";
import { useFinishedSetsStore } from "@/lib/stores/sport/finished-fe-sets-store";
import { useWorkoutTimingStore } from "@/lib/stores/sport/timing-store";
import { useSelectedWorkoutStore } from "@/lib/stores/sport/selected-workout-store";
import { WorkoutResponse } from "@/lib/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TimeDisplay } from "@comp/TimeDisplay";
import { Text, TouchableOpacity, View } from "react-native";
import { AppColors } from "@/lib/app-colors";
import { FontAwesomeIcon } from "../font-awesome-icon";
import { CTA } from "@comp/CTA";

export function WorkoutsFooterNavigation(props: {
  workoutResponse: WorkoutResponse;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const { setSelectedExercise, setSelectedWorkout } = useSelectedWorkoutStore();
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
          <FontAwesomeIcon
            name="angle-double-left"
            color={AppColors.PRIMARY}
            className="scale-60"
          />
        </TouchableOpacity>
      )}
      {startTimestamp !== undefined ? (
        <View className="flex-row gap-5">
          <CTA
            onPress={() => {
              clearInterval(timingInterval);
              setTimingInterval(undefined);

              setStartTimestamp(undefined);
              setCurrentTimestamp(undefined);
              finishedSetStore.reset();
            }}
            text="Cancle Workout"
          />
          <CTA
            onPress={() => {
              clearInterval(timingInterval);
              setTimingInterval(undefined);
              props.onSuccess();
            }}
          >
            <Text className="text-primary-foreground">Finish Workout</Text>
            <Text className="text-primary-foreground text-sm">
              (
              {props.workoutResponse?.exercises.reduce(
                (acc, cur) => acc + cur.numberOfSets,
                0,
              ) - finishedSetStore.finishedSets.length}{" "}
              exercises left)
            </Text>
          </CTA>
        </View>
      ) : (
        <CTA
          onPress={() => {
            setStartTimestamp(Date.now());
            setCurrentTimestamp(Date.now());
            setTimingInterval(
              setInterval(() => {
                setCurrentTimestamp(Date.now());
              }, 500),
            );
          }}
          text="Start Workout"
        />
      )}
    </View>
  );
}
