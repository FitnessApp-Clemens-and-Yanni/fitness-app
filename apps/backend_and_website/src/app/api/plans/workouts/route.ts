import { workouts } from "./workoutData";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(workouts);
}

type WorkoutPutRequest = {
  _id: string;
  name: string;
  exercises: WorkoutPutExerciseRequest[];
};

type WorkoutPutExerciseRequest = {
  _id: string;
  sorting: number;
  numberOfSets: number;
  noteText: string;
};

export async function PUT(req: Request) {
  const workout = (await req.json()) as WorkoutPutRequest;

  const idx = workouts.findIndex((w) => w._id === workout._id);
  const newWorkout = {
    ...workout,
    sorting: workouts[idx]!.sorting,
    exercises: workout.exercises
      .map((e) => ({
        newE: e,
        oldE: workouts[idx]?.exercises.find((ex) => ex._id === e._id),
      }))
      .map(({ newE, oldE }) => ({
        ...newE,
        name: oldE!.name,
        equipmentInfo: oldE!.equipmentInfo,
        involvedMuscles: oldE!.involvedMuscles,
        showcaseImage: oldE!.showcaseImage,
        isUserExercise: oldE!.isUserExercise,
      })),
  };

  workouts[idx] = newWorkout;

  return NextResponse.json(newWorkout);
}
