//using Xunit;
//using LootBox.Application.Services;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using LootBox.Application.Dtos;
//using LootBox.Application.Interfaces;
//using Moq;
//using FluentAssertions;
//using LootBox.Domain.Entities;
//using LootBox.Domain.Exceptions;
//using AutoMapper;
//using LootBox.Domain.Interfaces;
//using Microsoft.AspNetCore.Identity;
//using Xunit;
//using Assert = Xunit.Assert;

//namespace LootBox.Application.Services.Tests
//{
//    public class AccountServiceTests
//    {
//        public Mock<IMapper> _mapperMock;
//        public Mock<IAccountRepository> _accountRepositoryMock;
//        public Mock<IPasswordHasher<User>> _passwordHasherMock;
//        public AccountService _accountService;

//        public AccountServiceTests()
//        {
//            _mapperMock = new Mock<IMapper>();
//            _accountRepositoryMock = new Mock<IAccountRepository>();
//            _passwordHasherMock = new Mock<IPasswordHasher<User>>();

//            var authenticationSettings = new AuthenticationSettings
//            {
//                JwtKey = "MySuperSecretTakToJEstKluczPrywatny",
//                JwtIssuer = "http://localhost:5000",
//                JwtExpireDays = 12
//            };

//            _accountService = new AccountService(
//                _mapperMock.Object,
//                _accountRepositoryMock.Object,
//                _passwordHasherMock.Object,
//                authenticationSettings
//            );

//        }

//        [Fact]
//        public async Task RegisterUser_ShouldHashPassword_AndSaveUser()
//        {
//            // Arrange
//            var registerUserDto = new RegisterUserDto
//            {
//                Email = "test@example.com",
//                Password = "password123",
//                ConfirmPassword = "password123"
//            };
//            var user = new User();

//            _mapperMock.Setup(m => m.Map<User>(registerUserDto)).Returns(user);
//            _passwordHasherMock.Setup(ph => ph.HashPassword(user, registerUserDto.Password)).Returns("hashed_password");
//            _accountRepositoryMock.Setup(repo => repo.RegisterUser(It.IsAny<User>())).Returns(Task.CompletedTask);

//            // Act
//            await _accountService.RegisterUser(registerUserDto);

//            // Assert
//            _mapperMock.Verify(m => m.Map<User>(registerUserDto), Times.Once);
//            _passwordHasherMock.Verify(ph => ph.HashPassword(user, registerUserDto.Password), Times.Once);
//            _accountRepositoryMock.Verify(repo => repo.RegisterUser(It.Is<User>(u => u.PasswordHash == "hashed_password")), Times.Once);
//        }
//        //[Fact]
//        //public async Task GenerateJwt_ShouldReturnToken_WhenCredentialsAreValid()
//        //{
//        //    // Arrange
//        //    var loginDto = new LoginDto
//        //    {
//        //        Email = "test@example.com",
//        //        Password = "password123"
//        //    };

//        //    var user = new User
//        //    {
//        //        Id = 1,
//        //        Email = loginDto.Email,
//        //        PasswordHash = "hashed_password",
//        //        Role = new Role { Name = "User" }
//        //    };

//        //    _accountRepositoryMock.Setup(repo => repo.GetUserByEmail(loginDto.Email)).ReturnsAsync(user);
//        //    _passwordHasherMock.Setup(ph => ph.VerifyHashedPassword(user, user.PasswordHash, loginDto.Password))
//        //                       .Returns(PasswordVerificationResult.Success);

//        //    var jwtKey = "MySuperSecretTakToJEstKluczPrywatny";
//        //    var authenticationSettings = new AuthenticationSettings
//        //    {
//        //        JwtKey = "MySuperSecretTakToJEstKluczPrywatny",
//        //        JwtIssuer = "http://localhost:5000",
//        //        JwtExpireDays = 12
//        //    };

//        //    var accountService = new AccountService(_mapperMock.Object, _accountRepositoryMock.Object,
//        //                                             _passwordHasherMock.Object, authenticationSettings);

//        //    // Act
//        //    var token = await accountService.GenerateJwt(loginDto);

//        //    // Assert
//        //    token.Should().NotBeNullOrEmpty();
//        //    _accountRepositoryMock.Verify(repo => repo.GetUserByEmail(loginDto.Email), Times.Once);
//        //    _passwordHasherMock.Verify(ph => ph.VerifyHashedPassword(user, user.PasswordHash, loginDto.Password), Times.Once);
//        //}
//        [Fact]
//        public async Task ChangeRole_ShouldCallRepository_WithCorrectParameters()
//        {
//            // Arrange
//            var userId = 1;
//            var roleId = 2;

//            _accountRepositoryMock.Setup(repo => repo.ChangeRole(userId, roleId)).Returns(Task.CompletedTask);

//            // Act
//            await _accountService.ChangeRole(userId, roleId);

//            // Assert
//            _accountRepositoryMock.Verify(repo => repo.ChangeRole(userId, roleId), Times.Once);
//        }

//        [Fact]
//        public async Task GenerateJwt_ShouldThrowBadRequestException_WhenUserNotFound()
//        {
//            // Arrange
//            var loginDto = new LoginDto { Email = "invalid@example.com", Password = "password123" };

//            _accountRepositoryMock.Setup(repo => repo.GetUserByEmail(loginDto.Email)).ReturnsAsync((User)null);

//            // Act & Assert
//            await Assert.ThrowsAsync<BadRequestException>(() => _accountService.GenerateJwt(loginDto));
//        }

//    }
//}