using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers
{
    [ApiController]
    [Route("api")]
    public class RarityController : ControllerBase
    {
        private readonly IRarityService _rarityService;
        public RarityController(IRarityService rarityService)
        {
            _rarityService=rarityService;
        }

        [HttpGet("/rarity")]
        public async Task<IActionResult> GetAllRarity()
        {
            var rarity = await _rarityService.GetAllRarity();
            return Ok(rarity);
        }

        [HttpGet("/rarity/{id}")]
        public async Task<IActionResult> GetRarityById(int id)
        {
            var rarity = await _rarityService.GetRarityById(id);
            return Ok(rarity);
        }

        [HttpPost("/rarity")]
        public async Task<IActionResult> CreateRarity([FromBody] RarityDto rarityDto)
        {
            await _rarityService.Create(rarityDto);
            return Ok();
        }

        [HttpPut("/rarity/{id}")]
        public async Task<IActionResult> UpdateRarity(int id, [FromBody] RarityDto rarityDto)
        {
            await _rarityService.Update(id, rarityDto);
            return Ok();
        }

        [HttpDelete("/rarity/{id}")]
        public async Task<IActionResult> DeleteRarity(int id)
        {
            await _rarityService.Delete(id);
            return Ok();
        }

    }
}
