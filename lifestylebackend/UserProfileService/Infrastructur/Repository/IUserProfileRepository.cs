using UserProfileService.Models;

namespace UserProfileService.Infrastructur.Repository
{
    public interface IUserProfileRepository
    {
        Task<IEnumerable<UserProfile>> GetAllAsync();
        Task<UserProfile?> GetByIdAsync(string email);
        Task CreateAsync(UserProfile userProfile);
        Task<bool> UpdateAsync(UserProfile userProfile);
        Task<bool> DeleteAsync(string id);
        bool EmailExists(string email);
        void AddProfile(UserProfile profile);

    }
}
