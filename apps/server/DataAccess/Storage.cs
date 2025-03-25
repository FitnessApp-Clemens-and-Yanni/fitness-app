using DataAccess.Models;

namespace DataAccess;

public record PlanWorkoutDto(string _id, string name, int sorting, List<ExerciseDto> exercises);

public record ExerciseDto(
    string _id,
    string name,
    string sorting,
    string equipmentInfo,
    List<string> involvedMuscles,
    string showcaseImage,
    bool isUserExercise,
    int numberOfSets,
    string noteText);

public record ExerciseSnapshot(
    string ExerciseId,
    string UserId,
    ExerciseDefaults ExerciseDefaults
);

public record ExerciseDefaults(
    List<Set> Sets
);

public record Set(
    double WeightsInKg,
    int Repetitions
);

public static class Storage
{
    public static readonly List<PlanWorkoutDto> OurOneSingelPlan = new()
    {
        new PlanWorkoutDto(
            "507f191e310c19729de860ea",
            "Leg",
            1,
            new List<ExerciseDto>
            {
                new ExerciseDto(
                    "507f191e810c19729de860ea",
                    "Leg Extensions",
                    "5",
                    "Strength Machine",
                    new List<string> { "Upper Legs" },
                    "http://localhost:5000/images/exercises/leg-extensions.jpg",
                    false,
                    2,
                    "Make sure the machine is cleaned probably this time!!"
                ),
                new ExerciseDto(
                    "507f191e810c19729de860eb",
                    "Machine Seated Leg Curl",
                    "81",
                    "Strength Machine",
                    new List<string> { "Upper Legs" },
                    "http://localhost:5000/images/exercises/machine-seated-leg-curl.jpg",
                    false,
                    3,
                    ""
                ),
                new ExerciseDto(
                    "507f191e810c19729de860ec",
                    "Machine Leg Press (Wide Stance)",
                    "100",
                    "Strength Machine",
                    new List<string> { "Upper Legs" },
                    "http://localhost:5000/images/exercises/machine-leg-press-wide-stance.jpg",
                    false,
                    2,
                    "The \"Wide Stance\" thing is just because there is not an alternative exercise name."
                ),
                new ExerciseDto(
                    "507f191e810c19729de860ed",
                    "Machine Hip Adduction",
                    "101",
                    "Strength Machine",
                    new List<string> { "Upper Legs" },
                    "http://localhost:5000/images/exercises/machine-hip-adduction.jpg",
                    false,
                    2,
                    ""
                )
            }
        ),
        new PlanWorkoutDto(
            "507f191f310c19729de860ea",
            "Back and Shoulders",
            3,
            new List<ExerciseDto>
            {
                new ExerciseDto(
                    "507f191e810c19729de860ef",
                    "Barbell Bench Press",
                    "2",
                    "Barbell",
                    new List<string> { "Chest", "Triceps", "Shoulders" },
                    "http://localhost:5000/images/exercises/barbell-bench-press.jpg",
                    false,
                    3,
                    "As described by Moritz."
                ),
                new ExerciseDto(
                    "507f191e810c19729de860fb",
                    "Pull-Up",
                    "4",
                    "Pullup Bar",
                    new List<string> { "Back", "Shoulders", "Abs" },
                    "http://localhost:5000/images/exercises/pull-up.jpg",
                    false,
                    2,
                    ""
                )
            }
        )
    };
    
    public static readonly List<ExerciseSnapshot> ExercisesSnapshotsData = new()
    {
        new ExerciseSnapshot(
            "506f191e810c19729de860ea",
            null,
            new ExerciseDefaults(
                new List<Set>
                {
                    new Set(20, 10),
                    new Set(25, 8)
                }
            )
        ),
        new ExerciseSnapshot(
            "506f191e810c19729de860eb",
            null,
            new ExerciseDefaults(
                new List<Set>
                {
                    new Set(15, 10),
                    new Set(20, 8),
                    new Set(25, 6)
                }
            )
        ),
        new ExerciseSnapshot(
            "506f191e810c19729de860ec",
            null,
            new ExerciseDefaults(
                new List<Set>
                {
                    new Set(40, 10),
                    new Set(50, 8)
                }
            )
        ),
        new ExerciseSnapshot(
            "506f191e810c19729de860ed",
            null,
            new ExerciseDefaults(
                new List<Set>
                {
                    new Set(10, 10),
                    new Set(15, 8)
                }
            )
        ),
        new ExerciseSnapshot(
            "506f191e810c19729de860ef",
            null,
            new ExerciseDefaults(
                new List<Set>
                {
                    new Set(40, 10),
                    new Set(50, 8),
                    new Set(50, 8)
                }
            )
        ),
        new ExerciseSnapshot(
            "506f191e810c19729de860fb",
            null,
            new ExerciseDefaults(
                new List<Set>
                {
                    new Set(50, 10),
                    new Set(40, 8),
                    new Set(40, 6),
                    new Set(15, 4)
                }
            )
        )
    };
}
