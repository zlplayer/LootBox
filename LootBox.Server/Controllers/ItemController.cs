using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers
{
    [ApiController]
    [Route("api/item")]
    public class ItemController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpPost]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromForm]CreateItemDto itemDto)
        {
            await _itemService.Create(itemDto);
            return Ok();

        }

        [HttpGet]
        public async Task<IActionResult> GetAllItem()
        {
            var items = await _itemService.GetAllItem();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetItemById([FromRoute]int id)
        {
            var item = await _itemService.GetItemById(id);
            return Ok(item);
        }

        [HttpPut("{id}")]
       // [Authorize(Roles = "Admin")]

        public async Task<IActionResult> Update([FromRoute]int id, [FromForm] UpdateItemDto itemDto)
        {
            await _itemService.Update(id, itemDto);
            return Ok();
        }

        [HttpDelete("{id}")]
       // [Authorize(Roles = "Admin")]

        public async Task<IActionResult> Delete([FromRoute]int id)
        {
            await _itemService.Delete(id);
            return Ok();
        }

        [HttpGet("case/{id}")]
        public async Task<IActionResult> GetCasesByItemId(int id)
        {
            var casesItem= await _itemService.GetCasesByItemId(id);
            return Ok(casesItem);
        }
    }
}

