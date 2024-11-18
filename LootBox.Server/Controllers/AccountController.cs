﻿using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDto registerDto)
        {
            await _accountService.RegisterUser(registerDto);
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var response = await _accountService.GenerateJwt(loginDto);
            if (response == null)
            {
                return Unauthorized();
            }
            return Ok(response);
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> ChangeRole([FromRoute] int userId, int roleId)
        {
            await _accountService.ChangeRole(userId, roleId);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto user)
        {
            await _accountService.UpdateUser(id, user);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] int id)
        {
            await _accountService.DeleteUser(id);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _accountService.GetAllUsers();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] int id)
        {
            var user = await _accountService.GetUserById(id);
            return Ok(user);
        }

        //[HttpGet("user")]
        //public async Task<IActionResult> GetUser()
        //{
        //    var user = await _accountService.GetUser();
        //    return Ok(user);
        //}
        //[HttpPut("user")]
        //public async Task<IActionResult> UpdateUser(UpdateUserDto updateUserDto)
        //{
        //    await _accountService.UpdateUser(updateUserDto);
        //    return Ok();
        //}
        //[HttpPut("change-password")]
        //public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        //{
        //    await _accountService.ChangePassword(changePasswordDto);
        //    return Ok();
        //}
    }
}
