namespace WebApi.Routes.Exercises;

public static class ExercisesRoutes
{
    public static IEndpointRouteBuilder MapExercisesRoutes(this IEndpointRouteBuilder app)
    {
        //app.MapGet("", Exercises.GetAllExercises);
        return app;
    }
}