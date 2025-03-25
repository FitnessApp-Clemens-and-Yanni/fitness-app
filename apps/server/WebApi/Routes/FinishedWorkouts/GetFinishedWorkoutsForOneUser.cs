using Microsoft.AspNetCore.Mvc;

namespace WebApi.Routes.FinishedWorkouts;

public static class GetFinishedWorkoutsForOneUser
{
    public static Task<IActionResult> GetFinishedWorkout([FromRoute] int id)
    {
        throw new NotImplementedException();
    }
}