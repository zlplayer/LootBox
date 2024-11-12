using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers
{
    [ApiController]
    [Route("api")]
    public class ItemController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpPost("/Item")]
        public async Task<IActionResult> Create(CreateItemDto itemDto)
        {
            await _itemService.Create(itemDto);
            return Ok();

        }

        [HttpGet("/Item")]
        public async Task<IActionResult> GetAllItem()
        {
            var items = await _itemService.GetAllItem();
            return Ok(items);
        }

        [HttpGet("/Item/{id}")]
        public async Task<IActionResult> GetItemById([FromRoute]int id)
        {
            var item = await _itemService.GetItemById(id);
            return Ok(item);
        }

        [HttpPut("/Item/{id}")]
        public async Task<IActionResult> Update([FromRoute]int id, [FromBody] UpdateItemDto itemDto)
        {
            await _itemService.Update(id, itemDto);
            return Ok();
        }

        [HttpDelete("/Item/{id}")]
        public async Task<IActionResult> Delete([FromRoute]int id)
        {
            await _itemService.Delete(id);
            return Ok();
        }
    }
}

