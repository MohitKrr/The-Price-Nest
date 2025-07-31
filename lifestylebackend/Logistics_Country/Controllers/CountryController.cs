using Logistics_Country.Models;
using Logistics_Country.Data;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Logistics_Country.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController : ControllerBase
    {
            private readonly LogisticsCountryServices _data;

            public CountryController(LogisticsCountryServices data)
            {
                _data = data;
            }

            [HttpGet]
            public async Task<ActionResult<List<CountryModels>>> GetAll()
            {
                var list = await _data.GetAllAsync();
                return Ok(list);
            }

            [HttpGet("{id}")]
            public async Task<ActionResult<CountryModels>> GetById(string id)
            {
                var model = await _data.GetByIdAsync(id);
                if (model == null) return NotFound();
                return Ok(model);
            }

           
        [HttpPost]

        public async Task<ActionResult<CountryModels>> Add(CountryModels model)

        {

            model.Id = null;

            var createdModel = await _data.AddAsync(model);

            return CreatedAtAction(nameof(GetById), new { id = createdModel.Id }, createdModel);

        }



    }
}
