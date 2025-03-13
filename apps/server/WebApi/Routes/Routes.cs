using WebApi.Routes.Exercises;
using WebApi.Routes.FinishedWorkouts;
using WebApi.Routes.Plan;

namespace WebApi.Routes;

public static partial class Routes
{
    public static IEndpointRouteBuilder MapRoutes(this IEndpointRouteBuilder app)
    {
        app.MapGroup("exercises")
            .MapExercisesRoutes();
        
        app.MapGroup("journal")
            .MapFinishedWorkoutsRoutes();
        
        app.MapGroup("plan")
            .MapPlanRoutes();
        
        return app;
    }
}