using Logistics_Country.Models;
using MongoDB.Driver;

namespace Logistics_Country.Data
{
    public class LogisticsCountryServices
    {
        private readonly IMongoCollection<CountryModels> _collection;

        public LogisticsCountryServices(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DbConnection");
            var mongoUrl = MongoUrl.Create(connectionString);
            var client = new MongoClient(mongoUrl);
            var database = client.GetDatabase(mongoUrl.DatabaseName);
            _collection = database.GetCollection<CountryModels>("Country");
        }

        public async Task<List<CountryModels>> GetAllAsync() =>
            await _collection.Find(_ => true).ToListAsync();

        public async Task<CountryModels?> GetByIdAsync(string id) =>
            await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<CountryModels> AddAsync(CountryModels model)
        {
            await _collection.InsertOneAsync(model);
            return model;
        }

    }
}
