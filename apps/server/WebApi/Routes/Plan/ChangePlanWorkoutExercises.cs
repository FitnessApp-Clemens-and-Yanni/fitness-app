using DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Routes.Plan;

public class ChangePlanWorkoutExercises
{
    public static IResult PutPlanWorkout([FromBody] PlanWorkoutDto workoutUpdate, [FromRoute] string workoutId)
    {
        var plan = Storage.OurOneSingelPlan;

        var workoutIndex = plan.FindIndex(w => w._id == workoutUpdate._id);
        if (workoutIndex == -1)
            return Results.NotFound("Workout not found");

        var oldWorkout = plan[workoutIndex];

        var updatedExercises = workoutUpdate.exercises
            .Select(e =>
            {
                var oldExercise = oldWorkout.exercises.FirstOrDefault(ex => ex._id == e._id);
                return new ExerciseDto(
                    e._id,
                    oldExercise?.name ?? e._id,
                    oldExercise?.sorting ?? e.sorting,
                    oldExercise?.equipmentInfo ?? "",
                    oldExercise?.involvedMuscles ?? new List<string>(),
                    oldExercise?.showcaseImage ?? "",
                    oldExercise?.isUserExercise ?? false,
                    e.numberOfSets,
                    e.noteText
                );
            })
            .ToList();

        var updatedWorkout = workoutUpdate with { sorting = oldWorkout.sorting, exercises = updatedExercises };

        plan[workoutIndex] = updatedWorkout;

        return Results.Ok(updatedWorkout);
    }
}