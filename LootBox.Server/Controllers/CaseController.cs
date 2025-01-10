using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers
{
    [ApiController]
    [Route("api/case")]
    public class CaseController : ControllerBase
    {
        private readonly ICaseService _caseService;

        public CaseController(ICaseService caseService)
        {
            _caseService= caseService;
        }

        [HttpPost]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create( [FromForm] CreateCaseDto caseDto)
        {
            if (string.IsNullOrEmpty(caseDto.Name))
                return BadRequest("Name is required.");

            await _caseService.Create(caseDto);
            return Ok();
        }


        [HttpGet]
        public async Task<IActionResult> GetAllCase()
        {
            var cases = await _caseService.GetAllCase();
            return Ok(cases);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCaseById([FromRoute]int id)
        {
            var @case = await _caseService.GetCaseById(id);
            return Ok(@case);
        }

        [HttpPut("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update([FromRoute]int id, [FromForm] CreateCaseDto caseDto)
        {
            await _caseService.Update(id,caseDto);
            return Ok();
        }

        [HttpDelete("{id}")]
        //[Authorize(Roles = "Admin")]

        public async Task<IActionResult> Delete([FromRoute]int id)
        {
            await _caseService.Delete(id);
            return Ok();
        }



        [HttpPost("{caseId}/item/{itemId}")]
        //[Authorize(Roles = "Admin")]

        public async Task<IActionResult> AddItemToCase([FromRoute] int caseId, [FromRoute] int itemId)
        {
            await _caseService.AddItemToCase(caseId, itemId);
            return Ok();
        }

        [HttpGet("{caseId}/items")]
        public async Task<IActionResult> GetItemsByCaseId([FromRoute] int caseId)
        {
            var items = await _caseService.GetItemsByCaseId(caseId);
            return Ok(items);
        }

        [HttpDelete("{caseId}/items/{itemId}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteItemInCase([FromRoute] int caseId, [FromRoute] int itemId)
        {
            await _caseService.DeleteItemInCase(caseId, itemId);
            return Ok();
        }

        [HttpPost("{caseId}/draw")]
        //[Authorize]
        public async Task<IActionResult> DrawItemFromCase([FromRoute] int caseId, [FromHeader] int userId)
        {
            var item = await _caseService.DrawItemFromCase(caseId, userId);
            return Ok(item);
        }
    }
}
