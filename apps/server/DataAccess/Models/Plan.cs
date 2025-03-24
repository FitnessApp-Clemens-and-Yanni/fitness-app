using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DataAccess.Models;

public class Plan
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("workouts")]
    public List<Workout> Workouts { get; set; } = new List<Workout>();
}

public class Workout
{
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("sorting")]
    public int Sorting { get; set; }

    [BsonElement("exercises")]
    public List<Exercise> Exercises { get; set; } = new List<Exercise>();
}