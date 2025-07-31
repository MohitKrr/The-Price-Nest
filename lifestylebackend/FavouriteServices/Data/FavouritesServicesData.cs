using FavouriteServices.Models;
using MongoDB.Driver;

namespace FavouriteServices.Data
{
    public class FavouritesServicesData
    {
        private readonly IMongoCollection<FavouriteModels> _collection;
        public FavouritesServicesData(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DbConnection");

            var mongoUrl = MongoUrl.Create(connectionString);
            var client = new MongoClient(mongoUrl);
            var database = client.GetDatabase(mongoUrl.DatabaseName);
            _collection = database.GetCollection<FavouriteModels>("Favourites");

        }
        public async Task<List<FavouriteModels>> GetAllAsync() =>
           await _collection.Find(_ => true).ToListAsync();

        public async Task<FavouriteModels?> GetByIdAsync(string id) =>
            await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<List<FavouriteModels>> GetByUsernameAsync(string username) =>
            await _collection.Find(x => x.UserName == username).ToListAsync();

        public async Task<FavouriteModels> AddAsync(FavouriteModels model)
        {
            await _collection.InsertOneAsync(model);
            return model;
        }

        public async Task<bool> DeleteAsync(string username, string countryName)
        {
            var result = await _collection.DeleteOneAsync(x => x.UserName == username && x.Countryname == countryName);
            return result.DeletedCount > 0;
        }

    }
}
