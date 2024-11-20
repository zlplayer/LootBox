using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers
{
    [Route("api/")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class WearRatingController : ControllerBase
    {
        private readonly IWearRatingService _wearRatingService;
        public WearRatingController(IWearRatingService wearRatingService)
        {
            _wearRatingService=wearRatingService;
        }

        [HttpGet("WearRating")]
        public async Task<IActionResult> GetAllWearRating()
        {
            var wearRating = await _wearRatingService.GetAllWearRating();
            return Ok(wearRating);
        }
        [HttpGet("WearRating/{id}")]
        public async Task<IActionResult> GetWearRatingById(int id)
        {
            var wearRating = await _wearRatingService.GetWearRatingById(id);
            return Ok(wearRating);
        }

        [HttpPost("WearRating")]
        public async Task<IActionResult> CreateWearRating([FromBody] WearRatingDto wearRatingDto)
        {
            await _wearRatingService.Create(wearRatingDto);
            return Ok();
        }

        [HttpPut("WearRating/{id}")]
        public async Task<IActionResult> UpdateWearRating(int id, [FromBody] WearRatingDto wearRatingDto)
        {
            await _wearRatingService.Update(id, wearRatingDto);
            return Ok();
        }

        [HttpDelete("WearRating/{id}")]
        public async Task<IActionResult> DeleteWearRating(int id)
        {
            await _wearRatingService.Delete(id);
            return Ok();
        }
    }
}
