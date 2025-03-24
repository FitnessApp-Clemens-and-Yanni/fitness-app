using DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Routes.Plan;

public class DeletePlanWorkoutExercises
{
    public static IResult DeletePlanWorkoutExercise(HttpContext context, [FromRoute] string workoutId, [FromRoute] string exerciseId, [FromQuery] bool isUserExercise)
    {
        var plan = Storage.OurOneSingelPlan;

        var workout = plan.FirstOrDefault(w => w._id == workoutId);
        if (workout == null)
        {
            return Results.NotFound("Workout not found.");
        }

        var exercise = workout.exercises.FirstOrDefault(e => e._id == exerciseId);
        if (exercise == null)
        {
            return Results.NotFound("Exercise not found.");
        }

        workout.exercises.Remove(exercise);
        return Results.Ok("Exercise deleted successfully.");
    }
}