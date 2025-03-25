using WebApi.Routes.Exercises;
using WebApi.Routes.ExercisesSnapshots;
using WebApi.Routes.FinishedWorkouts;
using WebApi.Routes.Plan;
using WebApi.Routes.Users;
using WebApi.Routes.UsersExercises;

namespace WebApi.Routes;

public static partial class Routes
{
    public static IEndpointRouteBuilder MapRoutes(this IEndpointRouteBuilder app)
    {
        app.MapGroup("users")
            .MapUsersRoutes();
        
        app.MapGroup("users-exercises")
            .MapUsersExercisesRoutes();
        
        app.MapGroup("exercises")
            .MapExercisesRoutes();
        
        app.MapGroup("finished-workouts")
            .MapFinishedWorkoutsRoutes();
        
        app.MapGroup("exercises-snapshots")
            .MapExercisesSnapshotsRoutes();
        
        app.MapGroup("plans")
            .MapPlanRoutes();
        
        return app;
    }
}