using LifeStyleLogistics.Models;
using MongoDB.Driver;


namespace LifestyleServices.Data
{
    public class lifeStyleServicesData
    {
        private readonly IMongoCollection<LifestyleServices_Models> _collection;
        public lifeStyleServicesData(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DbConnection");

            var mongoUrl = MongoUrl.Create(connectionString);
            var client = new MongoClient(mongoUrl);
            var database = client.GetDatabase(mongoUrl.DatabaseName);
            _collection = database.GetCollection<LifestyleServices_Models>("life_styles");

        }
        public async Task<List<LifestyleServices_Models>> GetAllAsync() =>
           await _collection.Find(_ => true).ToListAsync();

        public async Task<LifestyleServices_Models?> GetByIdAsync(string id) =>
            await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();
        public async Task<LifestyleServices_Models> AddAsync(LifestyleServices_Models model)
        {
            await _collection.InsertOneAsync(model);
            return model;
        }

    }
}
