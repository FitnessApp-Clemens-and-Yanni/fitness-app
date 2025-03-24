using DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Routes.ExercisesSnapshots;

public class GetAllExercisesSnapshots
{
    public static IResult GetSpecificExerciseSnapshots([FromRoute] string exercisesId)
    {
        var exercisesSnapshots = Storage.ExercisesSnapshotsData;

        var exerciseSnapshot = exercisesSnapshots.Find(e => e.ExerciseId == exercisesId);
        if (exerciseSnapshot == null)
        {
            return Results.NotFound("Exercise snapshot not found.");
        }
        
        return Results.Ok(exerciseSnapshot);
    }
}