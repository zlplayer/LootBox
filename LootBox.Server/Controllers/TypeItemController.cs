using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers
{
    [Route("api")]
    [ApiController]
    public class TypeItemController : ControllerBase
    {
        private readonly ITypeItemService _typeItemService;
        public TypeItemController(ITypeItemService typeItemService)
        {
            _typeItemService = typeItemService;
        }

        [HttpGet("typeitem")]
        public async Task<IActionResult> GetAllTypeItem()
        {
            var typeItems = await _typeItemService.GetAllTypeItem();
            return Ok(typeItems);
        }

        [HttpGet("typeitem/{id}")]
        public async Task<IActionResult> GetTypeItemById(int id)
        {
            var typeItem = await _typeItemService.GetTypeItemById(id);
            return Ok(typeItem);
        }

        [HttpPost("typeitem")]
        public async Task<IActionResult> CreateTypeItem([FromBody] TypeItemDto typeItem)
        {
            await _typeItemService.Create(typeItem);
            return Ok();
        }

        [HttpPut("typeitem/{id}")]
        public async Task<IActionResult> UpdateTypeItem(int id, [FromBody] TypeItemDto typeItem)
        {
            await _typeItemService.Update(id,typeItem);
            return Ok();
        }

        [HttpDelete("typeitem/{id}")]
        public async Task<IActionResult> DeleteTypeItem(int id)
        {
            await _typeItemService.Delete(id);
            return Ok();
        }
    }
}
