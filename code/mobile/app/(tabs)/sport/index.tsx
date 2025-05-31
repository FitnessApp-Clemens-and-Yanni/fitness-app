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
import { AppColors } from "@/lib/app-colors";
import { FontAwesomeIcon } from "@comp/font-awesome-icon";
import { useUserStore } from "@/lib/stores/user-store";
import { useWorkoutEditStore } from "@/lib/stores/sport/workout-edit-store";

export default function Index() {
  const userStore = useUserStore();

  const {
    isLoading,
    error,
    data: workoutsData,
  } = api.workouts.getAll.useQuery({ userId: userStore.currentUser });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {isLoading ? (
        <FlatList
          data={new Array(5)}
          renderItem={() => (
            <Skeleton className="mt-2 rounded aspect-square p-2 flex flex-col justify-end w-5/12"></Skeleton>
          )}
          className="mt-5 flex-1"
          contentContainerClassName="gap-5"
          columnWrapperClassName="justify-evenly"
          numColumns={2}
        />
      ) : error ? (
        <Text>Sorry, an error occured... {error!.message}</Text>
      ) : (
        <>
          <FlatList
            data={workoutsData ?? []}
            renderItem={({ item }) => (
              <SingleWorkout
                workoutResponse={item}
                isInEditMode={isEditing}
                key={item._id}
              />
            )}
            className="mt-5"
            contentContainerClassName="gap-5"
            columnWrapperClassName="justify-evenly"
            keyExtractor={(item) => item._id}
            numColumns={2}
          />
          <View className="flex-row justify-end p-5">
            <View className="bg-primary rounded-full p-3">
              <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                <FontAwesomeIcon
                  name={isEditing ? "check" : "pen"}
                  color={AppColors.WHITE}
                />
              </TouchableOpacity>
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
  const workoutEditStore = useWorkoutEditStore();

  const [rotationObj, setRotationObj] = useState({ rotation: 0, direction: 1 });

  useEffect(wiggleAnimationEffect(props.isInEditMode, 1, setRotationObj), [
    props.isInEditMode,
  ]);

  const startUpdatingWorkout = () => {
    workoutEditStore.setWorkoutBeingEdited({
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

  return (
    <>
      <EditWorkoutModal />
      <View
        className="mt-2 w-5/12 ring-2 ring-primary bg-primary rounded aspect-square p-2 flex flex-col justify-end shadow-black shadow-md"
        style={{ transform: [{ rotate: `${rotationObj.rotation}deg` }] }}
      >
        {props.isInEditMode ? (
          <TouchableOpacity className="flex-1" onPress={startUpdatingWorkout}>
            <Text className="flex-1 text-xl p-3 text-pink-50 font-bold">
              {props.workoutResponse.name}
            </Text>
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
              <Text className="flex-1 text-xl p-3 text-pink-50 font-bold">
                {props.workoutResponse.name}
              </Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>
    </>
  );
}

function wiggleAnimationEffect(
  isInEditMode: boolean,
  maxAngle: number,
  setRotationObj: (
    callback: ((r: RotationObj) => RotationObj) | RotationObj,
  ) => void,
) {
  return () => {
    let animationInterval: NodeJS.Timeout | undefined = undefined;

    if (isInEditMode) {
      animationInterval = setInterval(() => {
        setRotationObj((r) => ({
          rotation: r.rotation + 0.3 * r.direction,
          direction:
            r.rotation > maxAngle
              ? -2
              : r.rotation < -maxAngle
                ? 2
                : r.direction,
        }));
      }, 25);
    } else {
      setRotationObj({ rotation: 0, direction: 1 });
      clearInterval(animationInterval);
    }
    return () => clearInterval(animationInterval);
  };
}

type RotationObj = { rotation: number; direction: number };
