import { Text } from "@/components/ui/Text";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, View } from "react-native";

export default function Index() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["workouts"],
    queryFn: async () => {
      return await new Promise<WorkoutResponse[]>((resolve, reject) => {
        setTimeout(() => {
          resolve([
            {
              _id: "507f191e310c19729de860ea",
              name: "Leg",
              exercises: [
                {
                  _id: "506f191e810c19729de860ea",
                  name: "Leg Extensions",
                  equipmentInfo: "Strength Machine",
                  involvedMuscles: ["Upper Legs"],
                  showcaseImage:
                    "http://localhost:4999/images/exercises/leg-extensions.jpg",
                  isUserExercise: false,
                  numberOfSets: 1,
                  noteText:
                    "Make sure the machine is cleaned probably this time!!",
                },
                {
                  _id: "506f191e810c19729de860eb",
                  name: "Machine Seated Leg Curl",
                  equipmentInfo: "Strength Machine",
                  involvedMuscles: ["Upper Legs"],
                  showcaseImage:
                    "http://localhost:4999/images/exercises/machine-seated-leg-curl.jpg",
                  isUserExercise: false,
                  numberOfSets: 2,
                  noteText: "",
                },
                {
                  _id: "506f191e810c19729de860ec",
                  name: "Machine Leg Press (Wide Stance)",
                  equipmentInfo: "Strength Machine",
                  involvedMuscles: ["Upper Legs"],
                  showcaseImage:
                    "http://localhost:4999/images/exercises/machine-leg-press-wide-stance.jpg",
                  isUserExercise: false,
                  numberOfSets: 1,
                  noteText:
                    'The "Wide Stance" thing is just because there is not an alternative exercise name.',
                },
                {
                  _id: "506f191e810c19729de860ed",
                  name: "Machine Hip Adduction",
                  equipmentInfo: "Strength Machine",
                  involvedMuscles: ["Upper Legs"],
                  showcaseImage:
                    "http://localhost:4999/images/exercises/machine-hip-adduction.jpg",
                  isUserExercise: false,
                  numberOfSets: 1,
                  noteText: "",
                },
              ],
            },
            {
              _id: "507f191f310c19729de860ea",
              name: "Back and Shoulders",
              exercises: [
                {
                  _id: "506f191e810c19729de860ef",
                  name: "Barbell Bench Press",
                  equipmentInfo: "Barbell",
                  involvedMuscles: ["Chest", "Triceps", "Shoulders"],
                  showcaseImage:
                    "http://localhost:4999/images/exercises/barbell-bench-press.jpg",
                  isUserExercise: false,
                  numberOfSets: 2,
                  noteText: "As described by Moritz.",
                },
                {
                  _id: "506f191e810c19729de860fb",
                  name: "Pull-Up",
                  equipmentInfo: "Pullup Bar",
                  involvedMuscles: ["Back", "Shoulders", "Abs"],
                  showcaseImage:
                    "http://localhost:4999/images/exercises/pull-up.jpg",
                  isUserExercise: false,
                  numberOfSets: 1,
                  noteText: "",
                },
              ],
            },
            {
              _id: "507f191f310c19729de860ea",
              name: "Back and Shoulders",
              exercises: [
                {
                  _id: "506f191e810c19729de860ef",
                  name: "Barbell Bench Press",
                  equipmentInfo: "Barbell",
                  involvedMuscles: ["Chest", "Triceps", "Shoulders"],
                  showcaseImage:
                    "http://localhost:4999/images/exercises/barbell-bench-press.jpg",
                  isUserExercise: false,
                  numberOfSets: 2,
                  noteText: "As described by Moritz.",
                },
                {
                  _id: "506f191e810c19729de860fb",
                  name: "Pull-Up",
                  equipmentInfo: "Pullup Bar",
                  involvedMuscles: ["Back", "Shoulders", "Abs"],
                  showcaseImage:
                    "http://localhost:4999/images/exercises/pull-up.jpg",
                  isUserExercise: false,
                  numberOfSets: 1,
                  noteText: "",
                },
              ],
            },
          ]);
        }, 200);
      });
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Sorry, an error occured... {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Workout workoutResponse={item} />}
      className="mt-5"
      contentContainerClassName="gap-5"
      columnWrapperClassName="justify-evenly"
      keyExtractor={(item) => item._id}
      numColumns={2}
    />
  );
}

function Workout({ workoutResponse }: { workoutResponse: WorkoutResponse }) {
  return (
    <View className="mt-2 w-5/12 ring-2 ring-primary bg-neutral-300 rounded aspect-square p-2">
      <Text className="text-xl">{workoutResponse.name}</Text>
    </View>
  );
}

type WorkoutResponse = {
  _id: string;
  name: string;
  exercises: WorkoutExerciseResponse[];
};

type WorkoutExerciseResponse = {
  _id: string;
  name: string;
  equipmentInfo: string;
  involvedMuscles: string[];
  showcaseImage: string;
  isUserExercise: boolean;
  numberOfSets: number;
  noteText: string;
};
