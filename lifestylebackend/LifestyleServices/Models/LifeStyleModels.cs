using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LifeStyleLogistics.Models
{
    public class LifestyleServices_Models
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string CountryName { get; set; } = string.Empty;
        public double TaxCost { get; set; }
        public int GlobalRank { get; set; }
        public double RentCost { get; set; }
        public double GroceriesCost { get; set; }
        public double RestrauntCost { get; set; }
        public double HealthcareCost { get; set; }
        public double EducationCost { get; set; }
        public double TransportationCost { get; set; } 
        public int WomenSafetyRank { get; set; }
        public double WeatherRank { get; set; }
        public double EnvironmentalIndex { get; set; }
        public double CrimeRate { get; set; }
        public double AverageCostOfLiving { get; set; }
    }
}
