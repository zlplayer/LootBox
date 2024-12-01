using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers
{
    [ApiController]
    [Route("api/rarity")]
    //[Authorize(Roles ="Admin")]
    public class RarityController : ControllerBase
    {
        private readonly IRarityService _rarityService;
        public RarityController(IRarityService rarityService)
        {
            _rarityService=rarityService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRarity()
        {
            var rarity = await _rarityService.GetAllRarity();
            return Ok(rarity);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRarityById(int id)
        {
            var rarity = await _rarityService.GetRarityById(id);
            return Ok(rarity);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRarity([FromBody] RarityDto rarityDto)
        {
            await _rarityService.Create(rarityDto);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRarity(int id, [FromBody] RarityDto rarityDto)
        {
            await _rarityService.Update(id, rarityDto);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRarity(int id)
        {
            await _rarityService.Delete(id);
            return Ok();
        }

    }
}
