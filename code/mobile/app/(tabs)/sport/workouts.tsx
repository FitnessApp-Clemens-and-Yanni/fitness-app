import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { H1, H2, H3, H4 } from "@ui/Typography";
import { Card } from "@ui/Card";
import { Button } from "@ui/Button";
import { ArrowBigLeft, Check, Pen } from "lucide-react-native";
import { generateUUID } from "@/lib/utils";
import { api } from "@/utils/react";
import { useEffect, useState } from "react";
import { TimeDisplay } from "@comp/TimeDisplay";
import { EditSetModal } from "@comp/sport/EditSetModal";
import { Set, useExerciseSetStore } from "@/lib/stores/sport/fe-sets-store";
import { useFinishedSetsStore } from "@/lib/stores/sport/finished-fe-sets-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Skeleton } from "@ui/skeleton";
import { create } from "zustand";

const useWorkoutStore = create<{
  selectedWorkout: WorkoutPutRequest | undefined;
  setSelectedWorkout: (workout: WorkoutPutRequest | undefined) => void;
  selectedExercise: WorkoutExercisePutRequest | undefined;
  setSelectedExercise: (
    exercise: WorkoutExercisePutRequest | undefined,
  ) => void;
}>()((set) => ({
  selectedWorkout: undefined,
  setSelectedWorkout: (workout) =>
    set((state) => ({ ...state, selectedWorkout: workout })),
  selectedExercise: undefined,
  setSelectedExercise: (exercise) =>
    set((state) => ({ ...state, selectedExercise: exercise })),
}));

const useTimingStore = create<{
  startTimestamp: number | undefined;
  setStartTimestamp: (val: number | undefined) => void;
  currentTimestamp: number | undefined;
  setCurrentTimestamp: (val: number | undefined) => void;
  stopTimes: () => void;
}>()((set) => ({
  startTimestamp: undefined,
  setStartTimestamp: (timestamp) =>
    set((state) => ({ ...state, startTimestamp: timestamp })),
  currentTimestamp: undefined,
  setCurrentTimestamp: (timestamp) =>
    set((state) => ({ ...state, currentTimestamp: timestamp })),
  stopTimes: () =>
    set((state) => ({
      ...state,
      startTimestamp: undefined,
      currentTimestamp: undefined,
    })),
}));

type EditModalValues = {
  idx: number;
  weightsInKg: number;
  repetitions: number;
};
const useEditModalStore = create<{
  editModalValues: EditModalValues | undefined;
  setEditModalValues: (values: EditModalValues | undefined) => void;
}>()((set) => ({
  editModalValues: undefined,
  setEditModalValues: (values) =>
    set((state) => ({ ...state, editModalValues: values })),
}));

export default function WorkoutsPage() {
  const { selectedWorkout, setSelectedWorkout, selectedExercise } =
    useWorkoutStore();

  const workoutResponse: WorkoutResponse = JSON.parse(
    useLocalSearchParams<{ workoutResponse: string }>().workoutResponse,
  );

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

  const [showSuccessScreen, setShowSuccessScreen] = useState<boolean>(false);
  const { editModalValues, setEditModalValues } = useEditModalStore();

  const frontendSetsStore = useExerciseSetStore();

  if (showSuccessScreen) {
    return <SuccessScreen setIsShown={setShowSuccessScreen} />;
  }

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
          onSuccess={() => setShowSuccessScreen(true)}
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

function SuccessScreen(props: { setIsShown: (val: boolean) => void }) {
  const finishedSetStore = useFinishedSetsStore();
  const { selectedWorkout } = useWorkoutStore();

  const { startTimestamp, currentTimestamp, stopTimes } = useTimingStore();

  const apiUtils = api.useUtils();

  const finishWorkoutMutation = api.workouts.finishWorkout.useMutation({
    onSuccess: () => {
      apiUtils.snapshots.getExerciseDefaultsForWorkout.invalidate();
    },
  });

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
            <Button
              onPress={async () => {
                props.setIsShown(false);
                stopTimes();
                finishedSetStore.reset();

                if (selectedWorkout === undefined) {
                  return;
                }

                await finishWorkoutMutation.mutateAsync({
                  userId: "gugi",
                  workoutId: selectedWorkout._id,
                  workoutName: selectedWorkout.name,
                  totalTimeInMinutes:
                    (currentTimestamp! - startTimestamp!) / 60_000,
                  exercises: Object.values(
                    Object.groupBy(
                      finishedSetStore.finishedSets,
                      (x) => x.exerciseId,
                    ),
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
              }}
            >
              <Text className="font-bold text-white">Yay! :D</Text>
            </Button>
          </View>
        </Card>
      </View>
    </View>
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
  } = useTimingStore();

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

function SetsView() {
  const { selectedExercise, selectedWorkout } = useWorkoutStore();

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

  useEffect(updateSetsEffect(snapshotData), [
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

function SetsScrollView() {
  const exerciseSetStore = useExerciseSetStore();
  const { selectedExercise } = useWorkoutStore();
  const finishedSetStore = useFinishedSetsStore();
  const { startTimestamp } = useTimingStore();
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

function updateSetsEffect(
  snapshotData:
    | {
        exerciseId: string;
        exerciseDefaults: {
          sets: { weightsInKg: number; repetitions: number }[];
        };
      }[]
    | undefined,
) {
  const { selectedExercise } = useWorkoutStore();
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
        .exerciseDefaults.sets!.map((set, idx) => ({ ...set, idx })); // TODO: When the selected exercise doesn't have that data anymore, make sure to fix this (remove the exclam and replace it with proper logic).

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

function FinishableEditableSetCard(props: {
  set: Set;
  numberOfSetsInExercise: number;
  isMarkedAsFinished: boolean;
  onPressEdit: () => void;
  onToggleFinished: () => void;
  editable: boolean;
}) {
  return (
    <Card className="mb-1">
      <View
        className={`flex-1 flex-row justify-evenly items-center py-2 ${
          props.isMarkedAsFinished ? "bg-green-300" : ""
        }`}
      >
        <Text className="text-md">{props.set.weightsInKg.toFixed(2)}</Text>
        <Text className="text-md">{props.set.repetitions}</Text>
        <Text className="text-md">
          {(
            props.numberOfSetsInExercise *
            props.set.repetitions *
            props.set.weightsInKg
          ).toFixed(2)}
        </Text>
        {props.editable ? (
          <TouchableOpacity onPress={props.onPressEdit}>
            <Pen />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={props.onToggleFinished}>
            <Check />
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
}

function PreviousSets(props: {
  snapshotData:
    | {
        exerciseId: string;
        exerciseDefaults: {
          sets: { weightsInKg: number; repetitions: number }[];
        };
      }[]
    | undefined;
}) {
  const { selectedExercise } = useWorkoutStore();

  return (
    <>
      <H4>Previous records</H4>
      <ScrollView>
        {props.snapshotData
          ?.filter((e) => e.exerciseId === selectedExercise?._id)
          .map((snapshot) => (
            <View key={generateUUID()}>
              {snapshot.exerciseDefaults.sets?.map((previousSet) => (
                <Card className="mb-1 bg-gray-200" key={generateUUID()}>
                  <View className="flex-1 flex-row justify-evenly items-center py-2">
                    <Text className="text-md">
                      {previousSet.weightsInKg.toFixed(2)}
                    </Text>
                    <Text className="text-md">{previousSet.repetitions}</Text>
                    <Text className="text-md">
                      {(
                        previousSet.weightsInKg *
                        previousSet.repetitions *
                        snapshot.exerciseDefaults.sets.length
                      ).toFixed(2)}
                    </Text>
                  </View>
                </Card>
              ))}
            </View>
          ))}
      </ScrollView>
    </>
  );
}

// TODO: Fix time going on after success screen shown
