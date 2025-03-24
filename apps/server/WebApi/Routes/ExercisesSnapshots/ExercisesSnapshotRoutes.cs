namespace WebApi.Routes.ExercisesSnapshots;

public static partial class ExercisesSnapshotRoutes
{
    public static IEndpointRouteBuilder MapExercisesSnapshotsRoutes(this IEndpointRouteBuilder app)
    {
        app.MapGet("{exercisesId}", GetAllExercisesSnapshots.GetSpecificExerciseSnapshots);
        
        return app;
    }
}