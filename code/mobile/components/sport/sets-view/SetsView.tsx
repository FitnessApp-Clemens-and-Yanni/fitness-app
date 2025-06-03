import { Card } from "@ui/Card";
import { Skeleton } from "@ui/skeleton";
import { H1, H2 } from "@ui/Typography";
import { useExerciseSetStore } from "@/lib/stores/sport/fe-sets-store";
import { useSelectedWorkoutStore } from "@/lib/stores/sport/selected-workout-store";
import { api } from "@/utils/react";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SetsScrollView } from "@comp/sport/sets-view/SetsScrollView";
import { PreviousSets } from "@comp/sport/sets-view/PreviousSets";

export function SetsView() {
  const { selectedExercise, selectedWorkout } = useSelectedWorkoutStore();

  const {
    isLoading,
    error,
    data: snapshotData,
  } = api.snapshots.getExerciseDefaultsForWorkout.useQuery({
    _id: selectedExercise?._id ?? null,
  });

  if (error || snapshotData instanceof Error) {
    console.error("Could not load snapshot, error:", error, snapshotData);
    return <H1 className="text-center">Sorry, something went wrong!</H1>;
  }

  useEffect(adjustSetsEffect(snapshotData), [
    snapshotData,
    selectedExercise,
    selectedWorkout,
  ]);

  return isLoading ? (
    <View className="gap-5">
      <Skeleton className="flex-1 w-full p-20" />
      <Skeleton className="flex-1 w-full p-20" />
      <Skeleton className="flex-1 w-full p-20" />
    </View>
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
      <SetsScrollView />
      <View className="flex-1"></View>
      <PreviousSets snapshotData={snapshotData} />
    </View>
  );
}

function adjustSetsEffect(
  snapshotData:
    | {
        exerciseId: string;
        exerciseDefaults: {
          sets: { weightsInKg: number; repetitions: number }[];
        };
      }[]
    | undefined,
) {
  const { selectedExercise } = useSelectedWorkoutStore();
  const exerciseSetStore = useExerciseSetStore();

  return () => {
    if (
      selectedExercise !== undefined &&
      exerciseSetStore.setsPerExercise.get(selectedExercise._id) ===
        undefined &&
      (snapshotData?.some((s) => s.exerciseId === selectedExercise._id) ??
        false)
    ) {
      const snapshotExerciseSets = snapshotData
        ?.find((s) => s.exerciseId === selectedExercise._id)!
        .exerciseDefaults.sets!.map((set, idx) => ({ ...set, idx }));

      let temporarySets = [...snapshotExerciseSets!.map((x) => ({ ...x }))];

      if (snapshotExerciseSets!.length < selectedExercise.numberOfSets) {
        const countNew =
          selectedExercise.numberOfSets - snapshotExerciseSets!.length;

        temporarySets = [
          ...temporarySets,
          ...new Array(countNew)
            .fill(null)
            .map((_) => temporarySets![temporarySets!.length - 1]),
        ].map((set, i) => ({ ...set, idx: i }));
      }

      if (snapshotExerciseSets!.length > selectedExercise.numberOfSets) {
        temporarySets = temporarySets.slice(0, selectedExercise.numberOfSets);
      }

      for (const set of temporarySets) {
        exerciseSetStore.upsertSetForExercise(selectedExercise._id, set);
      }
    }
  };
}
