using LootBox.Application.Interfaces;
using LootBox.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers
{
    [Route("api/contract")]
    [ApiController]
    [Authorize]
    public class ContractController : ControllerBase
    {
        private readonly IContractService _contractService;
        public ContractController(IContractService contractService)
        {
            _contractService = contractService;
        }

        [HttpPost("trade-up")]
        public async Task<IActionResult> ExecuteTradeUp([FromBody] List<int> equipmentIds, [FromQuery] int userId)
        {
            var result = await _contractService.ExecuteTradeUpContractAsync(equipmentIds, userId);
            return Ok(result);
        }
    }
}
