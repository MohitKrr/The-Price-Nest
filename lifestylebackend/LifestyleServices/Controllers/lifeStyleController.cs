using LifeStyleLogistics.Models;
using LifestyleServices.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LifestyleServices.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LifestyleController : ControllerBase
    {
        private readonly lifeStyleServicesData _data;
        //private readonly ILogger<LifestyleController> _logger; 

        /*public LifestyleController(lifeStyleServicesData data, ILogger<LifestyleController> logger)
        {
            _data = data;
            _logger = logger;
        }
        */
        public LifestyleController(lifeStyleServicesData data)
        {
            _data = data;
        }
        [HttpGet]
        public async Task<ActionResult<List<LifestyleServices_Models>>> GetAll()
        {
            //_logger.LogInformation("Get Method is called at :" + DateTime.Now.ToString() + Request.Host.ToString());
            var list = await _data.GetAllAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LifestyleServices_Models>> GetById(string id)
        {
            var model = await _data.GetByIdAsync(id);
            if (model == null) return NotFound();
            return Ok(model);
        }
    [Authorize]
        [HttpPost]
        public async Task<ActionResult<LifestyleServices_Models>> Add(LifestyleServices_Models model)
        {
            model.Id = null;
            var createdModel = await _data.AddAsync(model);
            return CreatedAtAction(nameof(GetById), new { id = createdModel.Id }, createdModel);
        }

    }
}
