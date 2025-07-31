using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using UserService.Models;

public class UserProfileClient
{
    private readonly HttpClient _httpClient;

    public UserProfileClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task CreateUserProfileAsync(User user)
    {
        var profile = new
        {
            email = user.Email,
            password = user.Password,
            name = (string?)null,
            gender = (string?)null,
            age = (int?)null,
            salary = (decimal?)null,
            presentLivingCountry = (string?)null
        };

        var content = new StringContent(
            JsonSerializer.Serialize(profile),
            Encoding.UTF8,
            "application/json");

        var response = await _httpClient.PostAsync("https://localhost:7101/api/UserProfile", content);

        response.EnsureSuccessStatusCode();
    }
}
