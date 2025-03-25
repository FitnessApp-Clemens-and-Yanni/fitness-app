using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DataAccess.Models;

public class Exercise
{
    
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("equipmentInfo")]
    public string EquipmentInfo { get; set; } = string.Empty;

    [BsonElement("involvedMuscles")]
    public List<string> InvolvedMuscles { get; set; } = new List<string>();

    [BsonElement("showcaseImage")]
    public string ShowcaseImage { get; set; } = string.Empty;
}