using BCrypt.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using UserService.Filters;
using UserService.Helpers;
using UserService.Infrastructure.Repository;
using UserService.Models;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ExcpHandlingFilter]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _context;
        private readonly UserProfileClient _profileClient;


        public UserController(IUserRepository context, UserProfileClient profileClient)
        {
            _context = context;
            _profileClient = profileClient;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (_context.EmailExists(user.Email))
            {
                return BadRequest();
            }

            _context.AddUser(user);

            try
            {
                await _profileClient.CreateUserProfileAsync(user);
            }
            catch (Exception ex)
            {
                // Optional: Roll back user insert or log the error
                return StatusCode(500, "User created, but profile creation failed: " + ex.Message);
            }
            return Ok();
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] User u)
        {
            TokenResponse tr = new TokenResponse();

            if (_context.ValidateUser(u))
            {
                tr.Status = "success";
                tr.Token = new TokenHelper().GenerateToken(u);
                return Ok(tr);
            }

            tr.Status = "error";
            return BadRequest(tr);
        }

        [HttpPost("reset_password")]
        public IActionResult ResetPassword([FromBody] User user)
        {
            if (!_context.EmailExists(user.Email))
            {
                return BadRequest();
            }
           
            _context.UpdatePasswordByEmail(user);
            return Ok();
        }

    }
}
