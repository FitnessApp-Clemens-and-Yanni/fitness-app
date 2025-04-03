import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { H1, H2, H3, H4 } from "./ui/Typography";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { ArrowBigLeft, Check, Disc } from "lucide-react-native";
import { generateUUID } from "@/lib/utils";
import { api } from "@/utils/react";
import { useState } from "react";

export function StartWorkoutModal({
  workoutResponse,
  selectedWorkout,
  setSelectedWorkout,
  selectedExercise,
  setSelectedExercise,
}: {
  workoutResponse: WorkoutResponse;
  selectedWorkout: WorkoutPutRequest | undefined;
  setSelectedWorkout: React.Dispatch<
    React.SetStateAction<WorkoutPutRequest | undefined>
  >;
  selectedExercise: WorkoutExercisePutRequest | undefined;
  setSelectedExercise: React.Dispatch<
    React.SetStateAction<WorkoutExercisePutRequest | undefined>
  >;
}) {
  const {
    isLoading,
    error,
    data: snapshotData,
  } = api.snapshots.getExerciseDefaultsForWorkout.useQuery({
    _id: selectedExercise?._id ?? null,
  });

  const apiUtils = api.useUtils();

  const finishWorkoutMutation = api.workouts.finishWorkout.useMutation({
    onSuccess: () => {
      apiUtils.snapshots.getExerciseDefaultsForWorkout.invalidate();
    },
  });

  const [finishedSets, setFinishedSets] = useState<
    {
      exerciseId: string;
      setIndex: number;
      weightsInKg: number;
      repetitions: number;
    }[]
  >([]);
  const [timingInterval, setTimingInterval] = useState<
    NodeJS.Timeout | undefined
  >();
  const [startTimestamp, setStartTimestamp] = useState<number | undefined>();
  const [currentTimestamp, setCurrentTimestamp] = useState<
    number | undefined
  >();
  const [showSuccessScreen, setShowSuccessScreen] = useState<boolean>(false);

  if (showSuccessScreen) {
    return (
      <Modal visible={selectedWorkout !== undefined} className="flex-1">
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
                  setShowSuccessScreen(false);
                  setStartTimestamp(undefined);
                  setCurrentTimestamp(undefined);
                  setFinishedSets([]);

                  if (
                    selectedWorkout === undefined ||
                    snapshotData === undefined
                  ) {
                    console.error("selectedWorkout", selectedWorkout);
                    console.error("snapshotData", snapshotData);
                    return;
                  }

                  await finishWorkoutMutation.mutateAsync({
                    workoutId: selectedWorkout._id,
                    workoutName: selectedWorkout.name,
                    totalTimeInMinutes:
                      (currentTimestamp! - startTimestamp!) / 60_000,
                    exercises: Object.values(
                      Object.groupBy(finishedSets, (x) => x.exerciseId)
                    ).map((sets) => {
                      return {
                        id: sets![0].exerciseId,
                        sets: finishedSets
                          .filter(
                            (set) => set.exerciseId === sets![0].exerciseId
                          )
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
      </Modal>
    );
  }

  if (error || snapshotData instanceof Error) {
    console.error("Could not load snapshot, error:", error, snapshotData);

    return (
      <Modal
        visible={selectedWorkout !== undefined}
        className="text-white flex-1"
      >
        <H1>Sorry, something went wrong!</H1>
      </Modal>
    );
  }

  if (isLoading) {
    return (
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
                  <ActivityIndicator />
                </ScrollView>
                <View className="flex-1"></View>
                <H4>Previous records</H4>
                <ScrollView>
                  <ActivityIndicator />
                </ScrollView>
              </View>
            )}
          </ScrollView>
          <View className="flex-row justify-between p-5 items-center">
            <TouchableOpacity onPress={() => setSelectedWorkout(undefined)}>
              <Text>
                <ArrowBigLeft />
              </Text>
            </TouchableOpacity>
            <Button>
              <Text>Start Workout</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }

  let temporaryDefaultSets:
    | {
        weightsInKg: number;
        repetitions: number;
      }[]
    | undefined = undefined;

  if (
    selectedExercise !== undefined &&
    snapshotData?.some((s) => s.exerciseId === selectedExercise._id)
  ) {
    const snapshotExerciseSets = snapshotData?.find(
      (s) => s.exerciseId === selectedExercise._id
    )!.exerciseDefaults.sets!; // When the selected exercise doesn't have that data anymore, make sure to fix this (remove the exclam and replace it with proper logic).

    temporaryDefaultSets = [...snapshotExerciseSets.map((x) => ({ ...x }))];
    if (snapshotExerciseSets.length < selectedExercise.numberOfSets) {
      const countNew =
        selectedExercise.numberOfSets - snapshotExerciseSets!.length;

      temporaryDefaultSets.push(
        ...new Array(countNew)
          .fill(null)
          .map((_) => temporaryDefaultSets![temporaryDefaultSets!.length - 1])
      );
    }
    if (snapshotExerciseSets!.length > selectedExercise.numberOfSets) {
      temporaryDefaultSets.splice(selectedExercise.numberOfSets);
    }
  }

  return (
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
                {temporaryDefaultSets?.map(
                  (setFromSnapshot, currentSetIndex) => (
                    <Card className="mb-1" key={currentSetIndex}>
                      <View
                        className={`flex-1 flex-row justify-evenly items-center py-2 ${
                          finishedSets.some(
                            (setsAlreadyFinished) =>
                              setsAlreadyFinished.exerciseId ===
                                selectedExercise._id &&
                              setsAlreadyFinished.setIndex === currentSetIndex
                          )
                            ? "bg-green-300"
                            : ""
                        }`}
                      >
                        <Text className="text-md">
                          {setFromSnapshot.weightsInKg}
                        </Text>
                        <Text className="text-md">
                          {setFromSnapshot.repetitions}
                        </Text>
                        <Text className="text-md">
                          {temporaryDefaultSets.length *
                            setFromSnapshot.repetitions *
                            setFromSnapshot.weightsInKg}
                        </Text>
                        <TouchableOpacity
                          disabled={startTimestamp === undefined}
                          onPress={() => {
                            if (
                              finishedSets.some(
                                (x) =>
                                  x.exerciseId === selectedExercise._id &&
                                  x.setIndex === currentSetIndex
                              )
                            ) {
                              setFinishedSets(
                                finishedSets.filter(
                                  (x) =>
                                    x.exerciseId !== selectedExercise._id ||
                                    x.setIndex !== currentSetIndex
                                )
                              );
                              return;
                            }

                            setFinishedSets([
                              ...finishedSets,
                              {
                                exerciseId: selectedExercise._id,
                                setIndex: currentSetIndex,
                                ...setFromSnapshot,
                              },
                            ]);
                          }}
                        >
                          {startTimestamp === undefined ? <Disc /> : <Check />}
                        </TouchableOpacity>
                      </View>
                    </Card>
                  )
                )}
              </ScrollView>
              <View className="flex-1"></View>
              <H4>Previous records</H4>
              <ScrollView>
                {snapshotData
                  ?.filter((e) => e.exerciseId === selectedExercise?._id)
                  .map((snapshot) => (
                    <View key={generateUUID()}>
                      {snapshot.exerciseDefaults.sets?.map((previousSet) => (
                        <Card className="mb-1 bg-gray-200" key={generateUUID()}>
                          <View className="flex-1 flex-row justify-evenly items-center py-2">
                            <Text className="text-md">
                              {previousSet.weightsInKg}
                            </Text>
                            <Text className="text-md">
                              {previousSet.repetitions}
                            </Text>
                            <Text className="text-md">
                              {previousSet.weightsInKg *
                                previousSet.repetitions *
                                snapshot.exerciseDefaults.sets.length}
                            </Text>
                          </View>
                        </Card>
                      ))}
                    </View>
                  ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
        <View className="flex-row justify-between p-5 items-center">
          {startTimestamp !== undefined ? (
            <TimeDisplay
              timeInMinutes={(currentTimestamp! - startTimestamp) / 60_000}
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                setSelectedExercise(undefined);
                setSelectedWorkout(undefined);
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
                  setFinishedSets([]);
                }}
              >
                <Text>Cancle Workout</Text>
              </Button>
              <Button
                onPress={() => {
                  clearInterval(timingInterval);
                  setTimingInterval(undefined);
                  setShowSuccessScreen(true);
                }}
              >
                <Text>Finish Workout</Text>
                <Text className="text-sm">
                  (
                  {workoutResponse?.exercises.reduce(
                    (acc, cur) => acc + cur.numberOfSets,
                    0
                  ) - finishedSets.length}{" "}
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
                  }, 500)
                );
              }}
            >
              <Text>Start Workout</Text>
            </Button>
          )}
        </View>
      </View>
    </Modal>
  );
}

function TimeDisplay(props: { timeInMinutes: number; className?: string }) {
  return (
    <Text className={props.className ?? ""}>
      {Math.floor(props.timeInMinutes).toString().padStart(2, "0")}:
      {Math.floor(props.timeInMinutes * 60)
        .toString()
        .padStart(2, "0")}
    </Text>
  );
}
