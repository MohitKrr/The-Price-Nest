using FavouriteServices.Data;
using FavouriteServices.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FavouriteServices.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavouriteController : ControllerBase
    {
        private readonly FavouritesServicesData _data;

        public FavouriteController(FavouritesServicesData data)
        {
            _data = data;
        }

        [HttpGet]
        public async Task<ActionResult<List<FavouriteModels>>> GetAll()
        {
            var list = await _data.GetAllAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FavouriteModels>> GetById(string id)
        {
            var model = await _data.GetByIdAsync(id);
            if (model == null) return NotFound();
            return Ok(model);
        }

        [HttpGet("user/{username}")]
        public async Task<ActionResult<List<FavouriteModels>>> GetByUsername(string username)
        {
            var list = await _data.GetByUsernameAsync(username);
            return Ok(list);
        }

        [HttpPost]
        public async Task<ActionResult<FavouriteModels>> Add(FavouriteModels model)
        {
            // Extract username from JWT token
            var username = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(username))
            {
                return BadRequest("Username not found in token");
            }

            model.Id = null;
            model.UserName = username; // Ensure username is set from token
            
            var createdModel = await _data.AddAsync(model);
            return CreatedAtAction(nameof(GetById), new { id = createdModel.Id }, createdModel);
        }

        [HttpDelete("{countryName}")]
        public async Task<ActionResult> Delete(string countryName)
        {
            // Extract username from JWT token
            var username = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(username))
            {
                return BadRequest("Username not found in token");
            }

            var deleted = await _data.DeleteAsync(username, countryName);
            if (!deleted)
            {
                return NotFound("Favourite not found");
            }

            return NoContent();
        }
    }
}
