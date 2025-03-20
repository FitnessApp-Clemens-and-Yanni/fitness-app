import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useQuery } from "@tanstack/react-query";
import { GripVertical, Move, Pen, Plus, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";

export default function Index() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["workouts"],
    queryFn: getWorkouts,
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
  const [workoutModel, setWorkoutModel] = useState<Workout | undefined>(
    undefined
  );

  function startUpdatingWorkout() {
    setWorkoutModel({
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
  }

  function setExerciseSetCount(text: string, exercise: WorkoutExercise) {
    if (text === "") {
      const idx = workoutModel!.exercises.indexOf(exercise);
      setWorkoutModel({
        ...workoutModel!,
        exercises: workoutModel!.exercises.with(idx, {
          ...workoutModel!.exercises[idx],
          numberOfSets: 0,
        }),
      });
      return;
    }

    if (!/^\d{1,2}$/.test(text)) {
      return;
    }

    const idx = workoutModel!.exercises.indexOf(exercise);
    setWorkoutModel({
      ...workoutModel!,
      exercises: workoutModel!.exercises.with(idx, {
        ...workoutModel!.exercises[idx],
        numberOfSets: +text,
      }),
    });
  }

  return (
    <>
      <Modal transparent={true} visible={workoutModel !== undefined}>
        <View className="flex-1 py-7 px-5">
          <View className="flex-1 bg-gray-200/95 ring-1 ring-primary">
            <View className="flex flex-row justify-between bg-primary/90 p-5">
              <Text className="text-2xl font-thin">{workoutModel?.name}</Text>
              <TouchableOpacity onPress={() => setWorkoutModel(undefined)}>
                <X />
              </TouchableOpacity>
            </View>
            <ScrollView className="p-5 flex-1">
              {workoutModel?.exercises
                .toSorted((e) => e.sorting)
                .map((exercise) => (
                  <Card className="flex-row py-5 gap-5 mb-2 pr-5 items-center">
                    <GripVertical />
                    <View className="flex-1 flex-row items-center">
                      <Text>{exercise.name}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text>Sets:</Text>
                      <TextInput
                        className="w-7 ring-1 ring-primary rounded py-2 text-center"
                        value={exercise.numberOfSets.toString()}
                        onChangeText={(text) =>
                          setExerciseSetCount(text, exercise)
                        }
                      />
                    </View>
                  </Card>
                ))}
            </ScrollView>
            <View className="flex-row justify-end gap-5 p-5">
              <Button>
                <Plus />
              </Button>
              <Button>
                <Text>Save</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <View className="mt-2 w-5/12 ring-2 ring-primary bg-neutral-300 rounded aspect-square p-2 flex flex-col justify-end">
        <Text className="flex-1 text-xl p-3">{workoutResponse.name}</Text>
        <View className="flex-[3] flex flex-col justify-end items-between">
          <View className="flex-1 flex flex-row items-end">
            <TouchableOpacity
              onPress={startUpdatingWorkout}
              className="flex-[2] flex flex-row justify-center items-center h-10"
            >
              <Pen />
            </TouchableOpacity>
            <View className="flex-[5] flex flex-row justify-end items-center">
              <Button>
                <Text>Start</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

type WorkoutResponse = {
  _id: string;
  name: string;
  sorting: number;
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
  sorting: number;
};

type Workout = {
  _id: string;
  name: string;
  exercises: WorkoutExercise[];
};

type WorkoutExercise = {
  _id: string;
  name: string;
  numberOfSets: number;
  noteText: string;
  sorting: number;
};

async function getWorkouts() {
  return await new Promise<WorkoutResponse[]>((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          _id: "507f191e310c19729de860ea",
          name: "Leg",
          sorting: 1,
          exercises: [
            {
              _id: "506f191e810c19729de860ea",
              name: "Leg Extensions",
              sorting: 5,
              equipmentInfo: "Strength Machine",
              involvedMuscles: ["Upper Legs"],
              showcaseImage:
                "http://localhost:4999/images/exercises/leg-extensions.jpg",
              isUserExercise: false,
              numberOfSets: 1,
              noteText: "Make sure the machine is cleaned probably this time!!",
            },
            {
              _id: "506f191e810c19729de860eb",
              name: "Machine Seated Leg Curl",
              sorting: 81,
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
              sorting: 100,
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
              sorting: 101,
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
          sorting: 3,
          exercises: [
            {
              _id: "506f191e810c19729de860ef",
              name: "Barbell Bench Press",
              sorting: 2,
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
              sorting: 4,
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
          sorting: 3,
          exercises: [
            {
              _id: "506f191e810c19729de860ef",
              name: "Barbell Bench Press",
              sorting: 2,
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
              sorting: 4,
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
    }, 0);
  });
}
