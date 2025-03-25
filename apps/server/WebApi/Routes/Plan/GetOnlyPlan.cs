using DataAccess;

namespace WebApi.Routes.Plan;

public class GetOnlyPlan
{
    public static IResult GetOurOneSingelPlan(HttpContext context)
    {
        return Results.Ok(Storage.OurOneSingelPlan);
    }
}