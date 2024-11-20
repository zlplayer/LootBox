using Xunit;
using Assert=Xunit.Assert;
using LootBox.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LootBox.Domain.Entities;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace LootBox.Infrastructure.Repositories.Tests
{
    public class AccountRepositoryTests
    {
        private readonly DbContextOptions<LootBoxDbContext> _dbContextOptions;

        public AccountRepositoryTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<LootBoxDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        }

        [Fact]
        public async Task RegisterUser_ShouldAddNewUser()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new AccountRepository(dbContext);

            var user = new User
            {
                Id = 1,
                UserName = "testuser",
                Email = "test@example.com",
                PasswordHash = "hashed_password",
                RoleId = 1
            };

            // Act
            await repository.RegisterUser(user);

            // Assert
            var result = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == "test@example.com");
            Assert.NotNull(result);
            Assert.Equal("test@example.com", result.Email);
        }

        [Fact]
        public async Task GetAllUsers_ShouldReturnAllUsers()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new AccountRepository(dbContext);

            dbContext.Users.AddRange(
                new User { Id = 1, UserName="user1", Email = "user1@example.com", PasswordHash = "password", RoleId = 1 },
                new User { Id = 2, UserName="user2", Email = "user2@example.com", PasswordHash = "password2", RoleId = 2 }
            );
            await dbContext.SaveChangesAsync();

            // Act
            var result = await repository.GetAllUsers();

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task UpdateUser_ShouldModifyUser()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new AccountRepository(dbContext);

            var user = new User { Id = 1, UserName = "user", Email = "user@example.com", PasswordHash = "hashed_password", RoleId = 1 };
            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();

            // Act
            user.Email = "new@example.com";
            await repository.UpdateUser(user);

            // Assert
            var result = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == 1);
            Assert.NotNull(result);
            Assert.Equal("new@example.com", result.Email);
        }
    }
}