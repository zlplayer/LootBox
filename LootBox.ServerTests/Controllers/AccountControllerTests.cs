using Xunit;
using Assert = Xunit.Assert;
using LootBox.Server.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LootBox.Application.Interfaces;
using Moq;
using LootBox.Application.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers.Tests
{
    public class AccountControllerTests
    {
        private readonly Mock<IAccountService> _accountServiceMock;
        private readonly AccountController _controller;

        public AccountControllerTests()
        {
            _accountServiceMock = new Mock<IAccountService>();
            _controller = new AccountController(_accountServiceMock.Object);
        }

        [Fact]
        public async Task Register_ShouldReturnOk()
        {
            // Arrange
            var registerDto = new RegisterUserDto {UserName="user", Email = "user@example.com", Password = "password" };
            _accountServiceMock.Setup(s => s.RegisterUser(registerDto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Register(registerDto);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

        [Fact]
        public async Task Login_ShouldReturnOkWithToken()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "user@example.com", Password = "password" };
            var token = "jwt_token";
            _accountServiceMock.Setup(s => s.GenerateJwt(loginDto)).ReturnsAsync(token);

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            Assert.Equal(token, actionResult.Value);
        }

        [Fact]
        public async Task Login_ShouldReturnUnauthorized_WhenTokenIsNull()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "user@example.com", Password = "password" };
            _accountServiceMock.Setup(s => s.GenerateJwt(loginDto)).ReturnsAsync((string)null);

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            var actionResult = Assert.IsType<UnauthorizedResult>(result);
            Assert.Equal(401, actionResult.StatusCode);
        }

        [Fact]
        public async Task ChangeRole_ShouldReturnOk()
        {
            // Arrange
            var userId = 1;
            var roleId = 2;
            _accountServiceMock.Setup(s => s.ChangeRole(userId, roleId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.ChangeRole(userId, roleId);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

        [Fact]
        public async Task UpdateUser_ShouldReturnOk()
        {
            // Arrange
            var userId = 1;
            var updateUserDto = new UpdateUserDto { UserName = "new_user", Email = "new@example.com" };
            _accountServiceMock.Setup(s => s.UpdateUser(userId, updateUserDto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.UpdateUser(userId, updateUserDto);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

        [Fact]
        public async Task DeleteUser_ShouldReturnOk()
        {
            // Arrange
            var userId = 1;
            _accountServiceMock.Setup(s => s.DeleteUser(userId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteUser(userId);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

        [Fact]
        public async Task GetAllUsers_ShouldReturnOkWithUsers()
        {
            // Arrange
            var users = new List<UserDto>
            {
                new UserDto { UserName = "user1", Email = "user1@example.com" },
                new UserDto {UserName = "user2", Email = "user2@example.com" }
            };
            _accountServiceMock.Setup(s => s.GetAllUsers()).ReturnsAsync(users);

            // Act
            var result = await _controller.GetAllUsers();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            Assert.Equal(users, actionResult.Value);
        }

        [Fact]
        public async Task GetUserById_ShouldReturnOkWithUser()
        {
            // Arrange
            var userId = 1;
            var user = new UserDto {UserName = "user", Email = "user@example.com" };
            _accountServiceMock.Setup(s => s.GetUserById(userId)).ReturnsAsync(user);

            // Act
            var result = await _controller.GetUserById(userId);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            Assert.Equal(user, actionResult.Value);
        }

        [Fact]
        public async Task ChangePassword_ShouldReturnOk()
        {
            // Arrange
            var userId = 1;
            var changePasswordDto = new ChangePasswordUserDto { NewPassword = "new_password" };
            _accountServiceMock.Setup(s => s.ChangePassword(userId, changePasswordDto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.ChangePassword(userId, changePasswordDto);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

    }
}