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
import { useExerciseSetStore } from "@/lib/stores/sport/fe-sets-store";
import { useFinishedSetsStore } from "@/lib/stores/sport/finished-fe-sets-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Skeleton } from "@ui/skeleton";

export default function WorkoutsPage() {
  const router = useRouter();

  const [selectedWorkout, setSelectedWorkout] = useState<
    WorkoutPutRequest | undefined
  >();
  const [selectedExercise, setSelectedExercise] = useState<
    WorkoutExercisePutRequest | undefined
  >();

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

  const {
    isLoading,
    error,
    data: snapshotData,
  } = api.snapshots.getExerciseDefaultsForWorkout.useQuery({
    _id: selectedExercise?._id ?? null,
  });

  const finishedSetStore = useFinishedSetsStore();

  const [timingInterval, setTimingInterval] = useState<
    NodeJS.Timeout | undefined
  >();
  const [startTimestamp, setStartTimestamp] = useState<number | undefined>();
  const [currentTimestamp, setCurrentTimestamp] = useState<
    number | undefined
  >();
  const [showSuccessScreen, setShowSuccessScreen] = useState<boolean>(false);
  const [editModalValues, setEditModalValues] = useState<
    { idx: number; weightsInKg: number; repetitions: number } | undefined
  >();

  const frontendSetsStore = useExerciseSetStore();

  useEffect(() => {
    if (
      selectedExercise !== undefined &&
      frontendSetsStore.setsPerExercise.get(selectedExercise._id) ===
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
        frontendSetsStore.upsertSetForExercise(selectedExercise._id, set);
      }
    }
  }, [snapshotData, selectedExercise, selectedWorkout]);

  if (showSuccessScreen) {
    return (
      <SuccessScreen
        currentTimestamp={currentTimestamp!}
        setCurrentTimestamp={setCurrentTimestamp}
        startTimestamp={startTimestamp!}
        setStartTimestamp={setStartTimestamp}
        selectedWorkout={selectedWorkout}
        setShowSuccessScreen={setShowSuccessScreen}
        snapshotData={snapshotData}
      />
    );
  }

  if (error || snapshotData instanceof Error) {
    console.error("Could not load snapshot, error:", error, snapshotData);
    return <H1 className="text-center">Sorry, something went wrong!</H1>;
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
          {isLoading ? (
            <View className="gap-5">
              <Skeleton className="flex-1 w-full p-20" />
              <Skeleton className="flex-1 w-full p-20" />
              <Skeleton className="flex-1 w-full p-20" />
            </View>
          ) : selectedExercise === undefined ? (
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
                {frontendSetsStore.setsPerExercise
                  .get(selectedExercise._id)
                  ?.map((setFromSnapshot) => (
                    <Card className="mb-1" key={setFromSnapshot.idx}>
                      <View
                        className={`flex-1 flex-row justify-evenly items-center py-2 ${
                          finishedSetStore.finishedSets.some(
                            (setsAlreadyFinished) =>
                              setsAlreadyFinished.exerciseId ===
                                selectedExercise._id &&
                              setsAlreadyFinished.setIndex ===
                                setFromSnapshot.idx,
                          )
                            ? "bg-green-300"
                            : ""
                        }`}
                      >
                        <Text className="text-md">
                          {setFromSnapshot.weightsInKg.toFixed(2)}
                        </Text>
                        <Text className="text-md">
                          {setFromSnapshot.repetitions}
                        </Text>
                        <Text className="text-md">
                          {(
                            frontendSetsStore.setsPerExercise.get(
                              selectedExercise._id,
                            )!.length *
                            setFromSnapshot.repetitions *
                            setFromSnapshot.weightsInKg
                          ).toFixed(2)}
                        </Text>
                        {startTimestamp === undefined ||
                        finishedSetStore.finishedSets.some(
                          (s) =>
                            s.exerciseId === selectedExercise._id &&
                            s.setIndex === setFromSnapshot.idx,
                        ) ? (
                          <TouchableOpacity
                            onPress={() => {
                              setEditModalValues({
                                idx: setFromSnapshot.idx,
                                weightsInKg: setFromSnapshot.weightsInKg,
                                repetitions: setFromSnapshot.repetitions,
                              });
                            }}
                          >
                            <Pen />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
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
                          >
                            <Check />
                          </TouchableOpacity>
                        )}
                      </View>
                    </Card>
                  ))}
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
                              {previousSet.weightsInKg.toFixed(2)}
                            </Text>
                            <Text className="text-md">
                              {previousSet.repetitions}
                            </Text>
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
                frontendSetsStore.reset();
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
                  setShowSuccessScreen(true);
                }}
              >
                <Text>Finish Workout</Text>
                <Text className="text-sm">
                  (
                  {workoutResponse?.exercises.reduce(
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
      </View>
    </View>
  );

  // if (isLoading) {
  //   return (
  //     <View className="text-white flex-1 relative">
  //       <H1 className="m-5">{selectedWorkout?.name}</H1>
  //       <ScrollView horizontal={true} className="flex-1 py-5 px-4">
  //         {selectedWorkout?.exercises.map((exercise) => (
  //           <Card key={exercise._id} className="aspect-square mr-5">
  //             <TouchableOpacity
  //               className="p-2 aspect-square"
  //               onPress={() => setSelectedExercise(exercise)}
  //             >
  //               <Text className="text-[.75em]">{exercise.name}</Text>
  //             </TouchableOpacity>
  //           </Card>
  //         ))}
  //       </ScrollView>
  //       <View className="flex-[8]">
  //         <ScrollView className="flex-1 p-5">
  //           {selectedExercise === undefined ? (
  //             <H3>Select an exercise!</H3>
  //           ) : (
  //             <View className="gap-5">
  //               <H2 className="m-2">{selectedExercise?.name}</H2>
  //               <View className="flex-1 flex-row justify-evenly">
  //                 <Card className="py-3 px-2 justify-center">
  //                   <Text>kg</Text>
  //                 </Card>
  //                 <Card className="py-3 px-2 justify-center">
  //                   <Text>reps</Text>
  //                 </Card>
  //                 <Card className="py-3 px-2 justify-center">
  //                   <Text>vol</Text>
  //                 </Card>
  //                 <View className="px-7"></View>
  //               </View>
  //               <ScrollView>
  //                 <ActivityIndicator />
  //               </ScrollView>
  //               <View className="flex-1"></View>
  //               <H4>Previous records</H4>
  //               <ScrollView>
  //                 <ActivityIndicator />
  //               </ScrollView>
  //             </View>
  //           )}
  //         </ScrollView>
  //         <View className="flex-row justify-between p-5 items-center">
  //           <TouchableOpacity
  //             onPress={() => {
  //               frontendSetsStore.reset();
  //               setSelectedWorkout(undefined);
  //             }}
  //           >
  //             <Text>
  //               <ArrowBigLeft />
  //             </Text>
  //           </TouchableOpacity>
  //           <Button>
  //             <Text>Start Workout</Text>
  //           </Button>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // }

  // return (
  // <View className="flex-1">
  //   <H1 className="m-5">{selectedWorkout?.name}</H1>

  //   <ScrollView horizontal={true} className="flex-1 py-5 px-4">
  //     {selectedWorkout?.exercises.map((exercise) => (
  //       <Card key={exercise._id} className="aspect-square mr-5">
  //         <TouchableOpacity
  //           className="p-2 aspect-square"
  //           onPress={() => setSelectedExercise(exercise)}
  //         >
  //           <Text className="text-[.75em]">{exercise.name}</Text>
  //         </TouchableOpacity>
  //       </Card>
  //     ))}
  //   </ScrollView>
  //   <View className="flex-[8]">
  //     <ScrollView className="flex-1 p-5">
  //       {selectedExercise === undefined ? (
  //         <H3>Select an exercise!</H3>
  //       ) : (
  //         <View className="gap-5">
  //           <H2 className="m-2">{selectedExercise?.name}</H2>
  //           <View className="flex-1 flex-row justify-evenly">
  //             <Card className="py-3 px-2 justify-center">
  //               <Text>kg</Text>
  //             </Card>
  //             <Card className="py-3 px-2 justify-center">
  //               <Text>reps</Text>
  //             </Card>
  //             <Card className="py-3 px-2 justify-center">
  //               <Text>vol</Text>
  //             </Card>
  //             <View className="px-7"></View>
  //           </View>
  //           <ScrollView>
  //             {frontendSetsStore.setsPerExercise
  //               .get(selectedExercise._id)
  //               ?.map((setFromSnapshot) => (
  //                 <Card className="mb-1" key={setFromSnapshot.idx}>
  //                   <View
  //                     className={`flex-1 flex-row justify-evenly items-center py-2 ${
  //                       finishedSetStore.finishedSets.some(
  //                         (setsAlreadyFinished) =>
  //                           setsAlreadyFinished.exerciseId ===
  //                             selectedExercise._id &&
  //                           setsAlreadyFinished.setIndex ===
  //                             setFromSnapshot.idx,
  //                       )
  //                         ? "bg-green-300"
  //                         : ""
  //                     }`}
  //                   >
  //                     <Text className="text-md">
  //                       {setFromSnapshot.weightsInKg.toFixed(2)}
  //                     </Text>
  //                     <Text className="text-md">
  //                       {setFromSnapshot.repetitions}
  //                     </Text>
  //                     <Text className="text-md">
  //                       {(
  //                         frontendSetsStore.setsPerExercise.get(
  //                           selectedExercise._id,
  //                         )!.length *
  //                         setFromSnapshot.repetitions *
  //                         setFromSnapshot.weightsInKg
  //                       ).toFixed(2)}
  //                     </Text>
  //                     {startTimestamp === undefined ||
  //                     finishedSetStore.finishedSets.some(
  //                       (s) =>
  //                         s.exerciseId === selectedExercise._id &&
  //                         s.setIndex === setFromSnapshot.idx,
  //                     ) ? (
  //                       <TouchableOpacity
  //                         onPress={() => {
  //                           setEditModalValues({
  //                             idx: setFromSnapshot.idx,
  //                             weightsInKg: setFromSnapshot.weightsInKg,
  //                             repetitions: setFromSnapshot.repetitions,
  //                           });
  //                         }}
  //                       >
  //                         <Pen />
  //                       </TouchableOpacity>
  //                     ) : (
  //                       <TouchableOpacity
  //                         onPress={() => {
  //                           if (
  //                             finishedSetStore.finishedSets.some(
  //                               (x) =>
  //                                 x.exerciseId === selectedExercise._id &&
  //                                 x.setIndex === setFromSnapshot.idx,
  //                             )
  //                           ) {
  //                             finishedSetStore.removeFinishedSet(
  //                               selectedExercise._id,
  //                               setFromSnapshot.idx,
  //                             );

  //                             return;
  //                           }

  //                           finishedSetStore.addFinishedSet({
  //                             exerciseId: selectedExercise._id,
  //                             setIndex: setFromSnapshot.idx,
  //                             ...setFromSnapshot,
  //                           });
  //                         }}
  //                       >
  //                         <Check />
  //                       </TouchableOpacity>
  //                     )}
  //                   </View>
  //                 </Card>
  //               ))}
  //           </ScrollView>
  //           <View className="flex-1"></View>
  //           <H4>Previous records</H4>
  //           <ScrollView>
  //             {snapshotData
  //               ?.filter((e) => e.exerciseId === selectedExercise?._id)
  //               .map((snapshot) => (
  //                 <View key={generateUUID()}>
  //                   {snapshot.exerciseDefaults.sets?.map((previousSet) => (
  //                     <Card className="mb-1 bg-gray-200" key={generateUUID()}>
  //                       <View className="flex-1 flex-row justify-evenly items-center py-2">
  //                         <Text className="text-md">
  //                           {previousSet.weightsInKg.toFixed(2)}
  //                         </Text>
  //                         <Text className="text-md">
  //                           {previousSet.repetitions}
  //                         </Text>
  //                         <Text className="text-md">
  //                           {(
  //                             previousSet.weightsInKg *
  //                             previousSet.repetitions *
  //                             snapshot.exerciseDefaults.sets.length
  //                           ).toFixed(2)}
  //                         </Text>
  //                       </View>
  //                     </Card>
  //                   ))}
  //                 </View>
  //               ))}
  //           </ScrollView>
  //         </View>
  //       )}
  //     </ScrollView>
  //     <View className="flex-row justify-between p-5 items-center">
  //       {startTimestamp !== undefined ? (
  //         <TimeDisplay
  //           timeInMinutes={(currentTimestamp! - startTimestamp) / 60_000}
  //         />
  //       ) : (
  //         <TouchableOpacity
  //           onPress={() => {
  //             frontendSetsStore.reset();
  //             setSelectedExercise(undefined);
  //             setSelectedWorkout(undefined);
  //             router.dismiss();
  //           }}
  //         >
  //           <Text>
  //             <ArrowBigLeft />
  //           </Text>
  //         </TouchableOpacity>
  //       )}
  //       {startTimestamp !== undefined ? (
  //         <View className="flex-row gap-5">
  //           <Button
  //             onPress={() => {
  //               clearInterval(timingInterval);
  //               setTimingInterval(undefined);

  //               setStartTimestamp(undefined);
  //               setCurrentTimestamp(undefined);
  //               finishedSetStore.reset();
  //             }}
  //           >
  //             <Text>Cancle Workout</Text>
  //           </Button>
  //           <Button
  //             onPress={() => {
  //               clearInterval(timingInterval);
  //               setTimingInterval(undefined);
  //               setShowSuccessScreen(true);
  //             }}
  //           >
  //             <Text>Finish Workout</Text>
  //             <Text className="text-sm">
  //               (
  //               {workoutResponse?.exercises.reduce(
  //                 (acc, cur) => acc + cur.numberOfSets,
  //                 0,
  //               ) - finishedSetStore.finishedSets.length}{" "}
  //               exercises left)
  //             </Text>
  //           </Button>
  //         </View>
  //       ) : (
  //         <Button
  //           onPress={() => {
  //             setStartTimestamp(Date.now());
  //             setCurrentTimestamp(Date.now());
  //             setTimingInterval(
  //               setInterval(() => {
  //                 setCurrentTimestamp(Date.now());
  //               }, 500),
  //             );
  //           }}
  //         >
  //           <Text>Start Workout</Text>
  //         </Button>
  //       )}
  //     </View>
  //   </View>
  // </View>
  // );
}

function SuccessScreen(props: {
  currentTimestamp: number;
  setCurrentTimestamp: (val: number | undefined) => void;

  startTimestamp: number;
  setStartTimestamp: (val: number | undefined) => void;

  setShowSuccessScreen: (val: boolean) => void;

  selectedWorkout: WorkoutPutRequest | undefined;
  snapshotData:
    | {
        _id: string;
        userId: null;
        exerciseId: string;
        exerciseDefaults: {
          sets: {
            weightsInKg: number;
            repetitions: number;
          }[];
        };
      }[]
    | undefined;
}) {
  const finishedSetStore = useFinishedSetsStore();
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
            timeInMinutes={
              (props.currentTimestamp - props.startTimestamp!) / 60_000
            }
          />
          <Text className="text-lg">minutes!</Text>
          <View className="justify-end">
            <Button
              onPress={async () => {
                props.setShowSuccessScreen(false);
                props.setStartTimestamp(undefined);
                props.setCurrentTimestamp(undefined);
                finishedSetStore.reset();

                if (
                  props.selectedWorkout === undefined ||
                  props.snapshotData === undefined
                ) {
                  console.error("selectedWorkout", props.selectedWorkout);
                  console.error("snapshotData", props.snapshotData);
                  return;
                }

                await finishWorkoutMutation.mutateAsync({
                  userId: "gugi",
                  workoutId: props.selectedWorkout._id,
                  workoutName: props.selectedWorkout.name,
                  totalTimeInMinutes:
                    (props.currentTimestamp! - props.startTimestamp!) / 60_000,
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
