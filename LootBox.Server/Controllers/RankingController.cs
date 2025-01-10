using LootBox.Application.Interfaces;
using LootBox.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers
{
    [Route("api/ranking")]
    [ApiController]
    public class RankingController : ControllerBase
    {
        private readonly IRankingService _rankingService;
        public RankingController(IRankingService rankingService)
        {
            _rankingService = rankingService;
        }

        [HttpGet("top-users")]
        public async Task<IActionResult> GetTopUsersWithBestItems()
        {
            var result = await _rankingService.GetTop10UsersWithBestItem();

            if (!result.Any())
            {
                return NotFound("No items found for users this month.");
            }

            return Ok(result);
        }
    }
}
