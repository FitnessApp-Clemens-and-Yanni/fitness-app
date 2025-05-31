import { useEditModalStore } from "@/lib/stores/sport/fe-set-edit-store";
import { useExerciseSetStore } from "@/lib/stores/sport/fe-sets-store";
import { useFinishedSetsStore } from "@/lib/stores/sport/finished-fe-sets-store";
import { useWorkoutTimingStore } from "@/lib/stores/sport/timing-store";
import { useSelectedWorkoutStore } from "@/lib/stores/sport/selected-workout-store";
import { ScrollView } from "react-native";
import { FinishableEditableSetCard } from "@comp/sport/sets-view/FinishableEditableSetCard";

export function SetsScrollView() {
  const exerciseSetStore = useExerciseSetStore();
  const { selectedExercise } = useSelectedWorkoutStore();
  const finishedSetStore = useFinishedSetsStore();
  const { startTimestamp } = useWorkoutTimingStore();
  const { setEditModalValues } = useEditModalStore();

  if (selectedExercise === undefined) {
    throw new Error(
      "There should never be a scenario where there is not a selected exercise here.",
    );
  }

  return (
    <ScrollView>
      {exerciseSetStore.setsPerExercise
        .get(selectedExercise!._id)
        ?.map((setFromSnapshot) => (
          <FinishableEditableSetCard
            set={setFromSnapshot}
            isMarkedAsFinished={finishedSetStore.finishedSets.some(
              (setsAlreadyFinished) =>
                setsAlreadyFinished.exerciseId === selectedExercise!._id &&
                setsAlreadyFinished.setIndex === setFromSnapshot.idx,
            )}
            numberOfSetsInExercise={
              exerciseSetStore.setsPerExercise.get(selectedExercise!._id)!
                .length
            }
            onPressEdit={() => {
              setEditModalValues({
                idx: setFromSnapshot.idx,
                weightsInKg: setFromSnapshot.weightsInKg,
                repetitions: setFromSnapshot.repetitions,
              });
            }}
            onToggleFinished={() => {
              if (
                finishedSetStore.finishedSets.some(
                  (x) =>
                    x.exerciseId === selectedExercise._id &&
                    x.setIndex === setFromSnapshot.idx,
                )
              ) {
                finishedSetStore.removeFinishedSet(
                  selectedExercise._id,
                  setFromSnapshot.idx,
                );

                return;
              }

              finishedSetStore.addFinishedSet({
                exerciseId: selectedExercise._id,
                setIndex: setFromSnapshot.idx,
                ...setFromSnapshot,
              });
            }}
            editable={
              startTimestamp === undefined ||
              finishedSetStore.finishedSets.some(
                (s) =>
                  s.exerciseId === selectedExercise._id &&
                  s.setIndex === setFromSnapshot.idx,
              )
            }
            key={setFromSnapshot.idx}
          />
        ))}
    </ScrollView>
  );
}
