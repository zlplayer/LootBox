using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers
{
    [Route("api/wallet")]
    [ApiController]
    [Authorize]
    public class WalletController : ControllerBase
    {
        private readonly IWalletService _walletService;

        public WalletController(IWalletService walletService)
        {
            _walletService = walletService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateWallet([FromBody] WalletDto walletDto)
        {
            await _walletService.CreateWallet(walletDto);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetWalletByUserId(int userId)
        {
            var wallet = await _walletService.GetWalletByUserId(userId);
            return Ok(wallet);
        }

        [HttpPost("addMoney")]

        public async Task<IActionResult> AddMoney(int userId, float money)
        {
            await _walletService.AddMoney(userId, money);
            return Ok();
        }

        [HttpPost("sellItem")]
        public async Task<IActionResult> SellItem(int userId, int itemId)
        {
            await _walletService.SellItem(userId, itemId);
            return Ok();
        }
    }
}
