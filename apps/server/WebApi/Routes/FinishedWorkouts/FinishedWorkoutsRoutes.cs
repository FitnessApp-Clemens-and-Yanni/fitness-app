namespace WebApi.Routes.FinishedWorkouts;

public static partial class FinishedWorkoutsRoutes
{
    public static IEndpointRouteBuilder MapFinishedWorkoutsRoutes(this IEndpointRouteBuilder app)
    {
        //app.MapPost("new", WorkoutFinishHandler.HandleFinishedWorkout);
        //app.MapGet(":id", GetFinishedWorkoutsForOneUser.GetFinishedWorkout);
        
        return app;
    }
}