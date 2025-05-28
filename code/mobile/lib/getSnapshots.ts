export async function getSnapshots(
  selectedWorkout: WorkoutPutRequest | undefined,
) {
  const exerciseSnapshots: ExerciseSnapshot[] = [];

  for (const exercise of selectedWorkout?.exercises ?? []) {
    const res = await fetch(
      `http://localhost:3000/api/exercises-snapshots/${exercise._id}`,
    );

    if (!res.ok) {
      console.error("Could not fetch snapshot!!");
      return;
    }

    const json = await res.json();
    exerciseSnapshots.push(json as ExerciseSnapshot);
  }

  return exerciseSnapshots;
}
