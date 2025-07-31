using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace UserProfileService.Models
{
    public class UserProfile
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)] 
        //[BsonElement("_id")]
        //[JsonPropertyName("id")]

        public string? UserId { get; set; }
        
        [BsonElement("name")]
        public string? Name { get; set; } 
        [BsonElement("email")]
        public string Email { get; set; }
        [BsonElement("password")]
        public string Password { get; set; }
        [BsonElement("gender")]
        public string? Gender { get; set; }
        [BsonElement("age")]
        public int? Age { get; set; }
        [BsonElement("salary")]
        public decimal? Salary { get; set; }
        [BsonElement("presentLivingCountry")]
        public string? PresentLivingCountry { get; set; }
    }
}
