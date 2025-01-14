using LootBox.Application.Interfaces;
using LootBox.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers
{
    [Route("api/ItemWithdrawal")]
    [ApiController]
    [Authorize]
    public class ItemWithdrawalController : ControllerBase
    {
        private readonly IItemWithdrawalService _itemWithdrawalService;
        public ItemWithdrawalController(IItemWithdrawalService itemWithdrawalService)
        {
            _itemWithdrawalService= itemWithdrawalService;
        }

        [HttpGet]
        [Authorize(Roles= "Admin")]
        public async Task<IActionResult> GetItemWithdrawals()
        {
            var itemWithdrawals = await _itemWithdrawalService.GetItemWithdrawalsAsync();
            return Ok(itemWithdrawals);
        }

        [HttpGet("ItemWithdrawalIsAcceptedTrue")]
        
        public async Task<IActionResult> GetItemWithdrawalIsAcceptedTrue(int userId)
        {
            var itemWithdrawal = await _itemWithdrawalService.GetItemWithdrawalByIsAcceptedTrue(userId);
            return Ok(itemWithdrawal);
        }
        [HttpGet("ItemWithdrawalIsAcceptedFalse")]
        public async Task<IActionResult> GetItemWithdrawalIsAcceptedFalse(int userId)
        {
            var itemWithdrawal = await _itemWithdrawalService.GetItemWithdrawalByIsAcceptedFalse(userId);
            return Ok(itemWithdrawal);
        }

        [HttpPost]
        public async Task<IActionResult> AddItemWithdrawal(int userId, int equipmentId)
        {
            await _itemWithdrawalService.AddItemWithdrawalAsync(userId, equipmentId);
            return Ok();
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateItemWithdrawal(int id)
        {
            await _itemWithdrawalService.UpdateItemWithdrawalAsync(id);
            return Ok();
        }
    }
}
