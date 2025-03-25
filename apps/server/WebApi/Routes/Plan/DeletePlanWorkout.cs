using DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Routes.Plan;

public class DeletePlanWorkout
{
    public static IResult DeletePlanFullWorkout(HttpContext context, [FromRoute] string workoutId)
    {
        var plan = Storage.OurOneSingelPlan;

        var workout = plan.FirstOrDefault(w => w._id == workoutId);
        if (workout == null)
        {
            return Results.NotFound("Workout not found.");
        }

        plan.Remove(workout);
        return Results.Ok("Workout deleted successfully.");
    }
}