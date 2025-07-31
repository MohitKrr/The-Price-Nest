using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using UserService.Models;

namespace UserService.Infrastructure.Repository
{
    public class UserDbContext //: DbContext
    {
        private readonly IConfiguration _configuration;
        private readonly IMongoDatabase _database;
        public UserDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
            var connectionString = _configuration.GetConnectionString("DbConnection");
            var mongoUrl = MongoUrl.Create(connectionString);
            var mongoClient = new MongoClient(mongoUrl);
            _database = mongoClient.GetDatabase(mongoUrl.DatabaseName);
        }
        public IMongoCollection<User> Users => _database.GetCollection<User>("user");


    }
}
