using UserService.Models;

namespace UserService.Infrastructure.Repository
{
    public interface IUserRepository
    {
        bool EmailExists(string email);
        void AddUser(User user);
        bool ValidateUser(User user);
        void UpdatePasswordByEmail(User user);
    }
}