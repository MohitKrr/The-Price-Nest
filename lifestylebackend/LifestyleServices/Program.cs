using LifestyleServices.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;

namespace LifestyleServices
    {
        public class Program
        {
            public static void Main(string[] args)
            {
                var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer((options) =>
                {
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = "lifestylelogistics",//builder.Configuration["Jwt:issuer"],
                        ValidAudience = builder.Configuration["Jwt:audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                    };
                });

                builder.Services.AddCors();

                // Add services to the container.
                builder.Services.AddControllers();
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen();
            

                builder.Services.AddSingleton<lifeStyleServicesData>();
            var logger = new LoggerConfiguration()
                .WriteTo
                .File(@"C:\Users\i19-labuser221502\source\Project\Logger\logger.log", rollingInterval: RollingInterval.Day)
                .CreateLogger();
            builder.Services.AddSerilog(logger);

                var app = builder.Build();
                if (app.Environment.IsDevelopment())

                {

                    app.UseSwagger();

                    app.UseSwaggerUI();

                }
                app.UseCors(policy =>
                {
                    policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });

                // Configure the HTTP request pipeline.
                app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();

                app.MapControllers();



                app.Run();
            }
        }
    }
