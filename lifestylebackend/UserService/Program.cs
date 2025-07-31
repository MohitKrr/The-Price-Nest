
using UserService.Helpers;
using UserService.Infrastructure.Repository;

namespace UserService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddSingleton<UserDbContext>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddHttpClient<UserProfileClient>();
            //builder.Services.AddSingleton<TokenHelper>();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngularDevClient",
                    policy => policy.WithOrigins("http://localhost:4200")
                                    .AllowAnyHeader()
                                    .AllowAnyMethod());
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseRouting();                // <-- Add UseRouting BEFORE UseCors and UseAuthorization

            app.UseCors("AllowAngularDevClient");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
