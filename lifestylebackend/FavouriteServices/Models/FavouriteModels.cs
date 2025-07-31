using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FavouriteServices.Models
{
    public class FavouriteModels
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? Countryname { get; set; }
        public string? UserName { get; set; }
    }
}
