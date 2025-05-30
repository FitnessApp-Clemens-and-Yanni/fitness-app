import { EditWorkoutModal } from "@comp/sport/EditWorkoutModal";
import { api } from "@/utils/react";
import { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import {
  WorkoutExercisePutRequest,
  WorkoutPutRequest,
  WorkoutResponse,
} from "@/lib/types";
import { Skeleton } from "@ui/skeleton";
import { Icon } from "@rneui/themed";
import { IconColors } from "@/lib/icon-colors";

export default function Index() {
  const {
    isLoading,
    error,
    data: workoutsData,
  } = api.workouts.getAll.useQuery();

  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {isLoading || error ? (
        isLoading ? (
          <FlatList
            data={new Array(5).fill(null).map((_, idx) => idx + 1)}
            renderItem={() => (
              <Skeleton className="mt-2 rounded aspect-square p-2 flex flex-col justify-end w-5/12"></Skeleton>
            )}
            className="mt-5 flex-1"
            contentContainerClassName="gap-5"
            columnWrapperClassName="justify-evenly"
            numColumns={2}
          />
        ) : (
          <Text>Sorry, an error occured... {error!.message}</Text>
        )
      ) : (
        <>
          <FlatList
            data={workoutsData ?? []}
            renderItem={({ item }) => (
              <SingleWorkout workoutResponse={item} isInEditMode={isEditing} />
            )}
            className="mt-5"
            contentContainerClassName="gap-5"
            columnWrapperClassName="justify-evenly"
            keyExtractor={(item) => item._id}
            numColumns={2}
          />
          <View className="flex-row justify-end p-5">
            <View className="bg-primary rounded-full p-3">
              {isEditing ? (
                <TouchableOpacity onPress={() => setIsEditing(false)}>
                  <Icon
                    name="check"
                    type="font-awesome-5"
                    color={IconColors.WHITE}
                    solid
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Icon
                    name="pen"
                    type="font-awesome-5"
                    color={IconColors.WHITE}
                    solid
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      )}
    </>
  );
}

function SingleWorkout(props: {
  workoutResponse: WorkoutResponse;
  isInEditMode: boolean;
}) {
  const [workoutModel, setWorkoutModel] = useState<
    WorkoutPutRequest | undefined
  >();

  const [rotationObj, setRotationObj] = useState({ rotation: 0, direction: 1 });
  const MAX_ANGLE = 2;

  useEffect(() => {
    let animationInterval: NodeJS.Timeout | undefined = undefined;

    if (props.isInEditMode) {
      animationInterval = setInterval(() => {
        setRotationObj((r) => ({
          rotation: r.rotation + 0.3 * r.direction,
          direction:
            r.rotation > MAX_ANGLE
              ? -2
              : r.rotation < -MAX_ANGLE
                ? 2
                : r.direction,
        }));
      }, 25);
    } else {
      setRotationObj({ rotation: 0, direction: 1 });
      clearInterval(animationInterval);
    }
    return () => clearInterval(animationInterval);
  }, [props.isInEditMode]);

  const startUpdatingWorkout = () => {
    setWorkoutModel({
      _id: props.workoutResponse._id,
      name: props.workoutResponse.name,
      exercises: props.workoutResponse.exercises.map((exercise) => ({
        _id: exercise._id,
        name: exercise.name,
        noteText: exercise.noteText,
        sorting: exercise.sorting,
        numberOfSets: exercise.numberOfSets,
      })),
    });
  };

  const setExerciseSetCount = (
    text: string,
    exercise: WorkoutExercisePutRequest,
  ) => {
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
  };

  const _WorkoutDisplay = () => (
    <>
      <Text className="flex-1 text-xl p-3">{props.workoutResponse.name}</Text>
      <View className="flex-[3] flex flex-col justify-end items-between">
        <View className="flex-1 flex flex-row items-end">
          <View className="flex-[5] flex flex-row justify-end items-center"></View>
        </View>
      </View>
    </>
  );

  return (
    <>
      <EditWorkoutModal
        workoutModel={workoutModel}
        setWorkoutModel={setWorkoutModel}
        setExerciseSetCount={setExerciseSetCount}
      />
      <View
        className="mt-2 w-5/12 ring-2 ring-primary bg-primary rounded aspect-square p-2 flex flex-col justify-end"
        style={{ transform: [{ rotate: `${rotationObj.rotation}deg` }] }}
      >
        {props.isInEditMode ? (
          <TouchableOpacity className="flex-1" onPress={startUpdatingWorkout}>
            <_WorkoutDisplay />
          </TouchableOpacity>
        ) : (
          <Link
            href={{
              pathname: "/sport/workouts",
              params: {
                workoutResponse: JSON.stringify(props.workoutResponse),
              },
            }}
            asChild
            className="flex-1"
          >
            <TouchableOpacity>
              <_WorkoutDisplay />
            </TouchableOpacity>
          </Link>
        )}
      </View>
    </>
  );
}
