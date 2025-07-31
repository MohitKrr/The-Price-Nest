using MongoDB.Bson;
using MongoDB.Driver;
using UserProfileService.Data;
using UserProfileService.Models;
namespace UserProfileService.Infrastructur.Repository

{

    public class UserProfileRepository : IUserProfileRepository

    {

        private readonly IMongoCollection<UserProfile> _users;

        public UserProfileRepository(MongoDbService mongoDbService)

        {

            _users = mongoDbService.UserProfile;

        }

        public async Task<IEnumerable<UserProfile>> GetAllAsync()

        {

            return await _users.Find(FilterDefinition<UserProfile>.Empty).ToListAsync();

        }

        public async Task<UserProfile?> GetByIdAsync(string email)

        {

            var filter = Builders<UserProfile>.Filter.Eq(x => x.Email, email);

            return await _users.Find(filter).FirstOrDefaultAsync();


        }

        public bool EmailExists(string email)
        {
            var filter = Builders<UserProfile>.Filter.Eq(p => p.Email, email);
            return _users.Find(filter).Any();
        }

        // ✅ Add new profile
        public void AddProfile(UserProfile profile)
        {
            _users.InsertOne(profile);
        }

        public async Task CreateAsync(UserProfile userProfile)

        {

            // await _users.InsertOneAsync(userProfile);

            if (string.IsNullOrEmpty(userProfile.UserId))

            {

                userProfile.UserId = ObjectId.GenerateNewId().ToString();

            }

            await _users.InsertOneAsync(userProfile);

        }

        //public async Task<bool> UpdateAsync(UserProfile userProfile)

        //{

        //    var filter = Builders<UserProfile>.Filter.Eq(x => x.Email, userProfile.Email);

        //    var result = await _users.ReplaceOneAsync(filter, userProfile);

        //    return result.ModifiedCount > 0;

        //}

        public async Task<bool> UpdateAsync(UserProfile userProfile)
        {
            // Find existing profile by email
            var filter = Builders<UserProfile>.Filter.Eq(u => u.Email, userProfile.Email);
            var existingProfile = await _users.Find(filter).FirstOrDefaultAsync();

            if (existingProfile == null)
            {
                // Not found
                return false;
            }

            // Preserve the existing MongoDB _id (UserId)
            userProfile.UserId = existingProfile.UserId;

            // Replace the entire document with the new userProfile
            var result = await _users.ReplaceOneAsync(filter, userProfile);

            return result.ModifiedCount > 0;
        }


        public async Task<bool> DeleteAsync(string id)

        {

            var filter = Builders<UserProfile>.Filter.Eq(x => x.UserId, id);

            var result = await _users.DeleteOneAsync(filter);

            return result.DeletedCount > 0;

        }

    }

}

