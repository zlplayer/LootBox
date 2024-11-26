using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers
{
    [Route("api/typeItem")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class TypeItemController : ControllerBase
    {
        private readonly ITypeItemService _typeItemService;
        public TypeItemController(ITypeItemService typeItemService)
        {
            _typeItemService = typeItemService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTypeItem()
        {
            var typeItems = await _typeItemService.GetAllTypeItem();
            return Ok(typeItems);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTypeItemById(int id)
        {
            var typeItem = await _typeItemService.GetTypeItemById(id);
            return Ok(typeItem);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTypeItem([FromBody] TypeItemDto typeItem)
        {
            await _typeItemService.Create(typeItem);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTypeItem(int id, [FromBody] TypeItemDto typeItem)
        {
            await _typeItemService.Update(id,typeItem);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTypeItem(int id)
        {
            await _typeItemService.Delete(id);
            return Ok();
        }
    }
}
