using MongoDB.Driver;
using UserService.Models;

namespace UserService.Infrastructure.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _users;

        public UserRepository(UserDbContext context)
        {
            _users = context.Users;
        }

        public bool EmailExists(string email)
        {
            var filter = Builders<User>.Filter.Eq(user => user.Email, email);
            return _users.Find(filter).Any();
        }

        public void AddUser(User user)
        {
            _users.InsertOne(user);
        }
        public bool ValidateUser(User user)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, user.Email);
            var users = _users.Find(filter).FirstOrDefault();

            if (users != null)
            {
                if(users.Password == user.Password)
                { 
                    return true; 
                }
            }
            return false;
        }

        public void UpdatePasswordByEmail(User user)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, user.Email);
            var update = Builders<User>.Update.Set(u => u.Password, user.Password);

            _users.UpdateOne(filter, update);
        }


    }

}


