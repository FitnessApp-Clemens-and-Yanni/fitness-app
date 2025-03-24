using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DataAccess.Models;

public class FinishedWorkout
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("workoutName")]
    public string WorkoutName { get; set; } = string.Empty;

    [BsonElement("exercises")]
    public List<ExerciseEntry> Exercises { get; set; } = new List<ExerciseEntry>();
}

public class ExerciseEntry
{
    [BsonElement("id")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("objectSnapshot")]
    public BsonDocument ObjectSnapshot { get; set; } = new BsonDocument();

    [BsonElement("sets")]
    public List<SetEntry> Sets { get; set; } = new List<SetEntry>();
}

public class SetEntry
{
    [BsonElement("weightsInKg")]
    public double WeightsInKg { get; set; }

    [BsonElement("repetitions")]
    public int Repetitions { get; set; }
}