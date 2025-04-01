export async function getWorkouts() {
  const res = await fetch("http://localhost:3000/api/plans/workouts");
  const json = await res.json();
  return json as WorkoutResponse[];
  /*
  return await new Promise<WorkoutResponse[]>((resolve, _) => {
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
  });*/
}
