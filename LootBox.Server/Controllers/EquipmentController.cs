﻿using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LootBox.Server.Controllers
{
    [Route("api/equipment")]
    [ApiController]
    [Authorize]
    public class EquipmentController : ControllerBase
    {
        private readonly IEquipmentService _equipmentService;

        public EquipmentController(IEquipmentService equipmentService)
        {
            _equipmentService = equipmentService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAllEquipmentUser([FromRoute]int id)
        {
            var equipment= await _equipmentService.GetAllEquipmentUser(id);
            return Ok(equipment);
        }

        [HttpPost]
        public async Task<IActionResult> Create(int itemId, int userId)
        {
            await _equipmentService.Create(itemId,userId);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute]int id)
        {
            await _equipmentService.Delete(id);
            return Ok();
        }

        [HttpPost("sellItem")]
        public async Task<IActionResult> SellItem(int userId, int equipentId)
        {
            await _equipmentService.SellItem(userId, equipentId);
            return Ok();
        }

    }
}
