import { Card } from "@ui/Card";
import { H4 } from "@ui/Typography";
import { useSelectedWorkoutStore } from "@/lib/stores/sport/selected-workout-store";
import { generateUUID } from "@/lib/utils";
import { ScrollView, Text, View } from "react-native";

export function PreviousSets(props: {
  snapshotData:
    | {
        exerciseId: string;
        exerciseDefaults: {
          sets: { weightsInKg: number; repetitions: number }[];
        };
      }[]
    | undefined;
}) {
  const { selectedExercise } = useSelectedWorkoutStore();

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
