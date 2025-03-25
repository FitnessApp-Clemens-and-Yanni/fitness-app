using WebApi.Routes.Exercises;

namespace WebApi.Routes.Plan;

public static partial class PlanRoutes
{
    public static IEndpointRouteBuilder MapPlanRoutes(this IEndpointRouteBuilder app)
    {
        app.MapGet("", GetOnlyPlan.GetOurOneSingelPlan);
        app.MapPut("workouts/{workoutId}", ChangePlanWorkoutExercises.PutPlanWorkout);
        app.MapDelete("workouts/{workoutId}", DeletePlanWorkout.DeletePlanFullWorkout);
        app.MapDelete("workouts/{workoutId}/{exerciseId}", DeletePlanWorkoutExercises.DeletePlanWorkoutExercise);
        
        return app;
    }
}