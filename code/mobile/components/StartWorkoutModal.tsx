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
import { ArrowBigLeft, Check } from "lucide-react-native";
import { generateUUID } from "@/lib/utils";
import { api } from "@/utils/react";

export function StartWorkoutModal({
  selectedWorkout,
  setSelectedWorkout,
  selectedExercise,
  setSelectedExercise,
}: {
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
    )!.exerciseDefaults.sets!;

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
                {temporaryDefaultSets?.map((previousSet) => (
                  <Card className="mb-1" key={generateUUID()}>
                    <View className="flex-1 flex-row justify-evenly items-center py-2">
                      <Text className="text-md">{previousSet.weightsInKg}</Text>
                      <Text className="text-md">{previousSet.repetitions}</Text>
                      <Text className="text-md">
                        {temporaryDefaultSets.length *
                          previousSet.repetitions *
                          previousSet.weightsInKg}
                      </Text>
                      <TouchableOpacity>
                        <Check />
                      </TouchableOpacity>
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
          <Button>
            <Text>Start Workout</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
