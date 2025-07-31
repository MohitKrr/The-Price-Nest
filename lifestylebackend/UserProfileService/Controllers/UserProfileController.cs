using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.Mvc;

using MongoDB.Bson;

using MongoDB.Driver;

using UserProfileService.Data;
using UserProfileService.Filters;
using UserProfileService.Infrastructur.Repository;
using UserProfileService.Models;
namespace UserProfileService.Controllers

{

    [Route("api/[controller]")]

    [ApiController]
    [ExcpHandlingFilter]

    public class UserProfileController : ControllerBase

    {

        private readonly IUserProfileRepository _repository;

        public UserProfileController(IUserProfileRepository repository)

        {

            _repository = repository;

        }

        [HttpGet]

        public async Task<IEnumerable<UserProfile>> Get()

        {

            return await _repository.GetAllAsync();

        }

        [HttpGet("byEmail/{email}")]

        public async Task<ActionResult<UserProfile?>> GetById(string email)

        {

            var user = await _repository.GetByIdAsync(email);

            return user is not null ? Ok(user) : NotFound();

        }

        //[HttpPost]
        //public async Task<ActionResult> Create(UserProfile userProfile)

        //{

        //    await _repository.CreateAsync(userProfile);

        //    //return CreatedAtAction(nameof(GetById), new { id = userProfile.UserId }, userProfile);

        //    return CreatedAtAction("GetById", new { id = userProfile.UserId }, userProfile);

        //}

        [HttpPost]
        public IActionResult CreateProfile([FromBody] UserProfile profile)
        {
            if (_repository.EmailExists(profile.Email))
            {
                return BadRequest("Profile already exists");
            }

            _repository.AddProfile(profile);
            return Ok("Profile created");
        }

        [HttpPut("{email}")]
        [Authorize]
        public async Task<ActionResult> Update(string email, [FromBody] UserProfile userProfile)

        {

            userProfile.Email = email;

            var updated = await _repository.UpdateAsync(userProfile);

            return updated ? Ok() : NotFound();

        }




        [HttpDelete("{id}")]

        public async Task<ActionResult> Delete(string id)

        {

            var deleted = await _repository.DeleteAsync(id);

            return deleted ? Ok() : NotFound();

        }

    }

}

