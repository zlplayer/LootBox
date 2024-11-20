using Xunit;
using Assert = Xunit.Assert;
using LootBox.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LootBox.Domain.Entities;

namespace LootBox.Infrastructure.Repositories.Tests
{
    public class RarityRepositoryTests
    {
        private readonly DbContextOptions<LootBoxDbContext> _dbContextOptions;
        public RarityRepositoryTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<LootBoxDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;
        }

        [Fact]
        public async Task GetAllRarity_ShouldReturnAllRarities()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new RarityRepository(dbContext);

            dbContext.Rarities.AddRange(
                new Rarity { Id = 1, Name = "Common", Color="Blue" },
                new Rarity { Id = 2, Name = "Rare", Color = "Purple" }
            );
            await dbContext.SaveChangesAsync();

            // Act
            var result = await repository.GetAllRarity();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetRarityById_ShouldReturnCorrectRarity()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new RarityRepository(dbContext);

            var rarityId = 1;
            dbContext.Rarities.Add(new Rarity { Id = rarityId, Name = "Epic", Color = "Pink" });
            await dbContext.SaveChangesAsync();

            // Act
            var result = await repository.GetRarityById(rarityId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(rarityId, result.Id);
            Assert.Equal("Epic", result.Name);
        }

        [Fact]
        public async Task Create_ShouldAddNewRarity()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new RarityRepository(dbContext);

            var rarity = new Rarity { Name = "Legendary", Color = "Yellow" };

            // Act
            await repository.Create(rarity);

            // Assert
            var result = await dbContext.Rarities.FirstOrDefaultAsync(r => r.Name == "Legendary");
            Assert.NotNull(result);
            Assert.Equal("Legendary", result.Name);
        }

        [Fact]
        public async Task Update_ShouldModifyExistingRarity()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new RarityRepository(dbContext);

            var rarity = new Rarity { Id = 1, Name = "Rare", Color = "Purple" };
            dbContext.Rarities.Add(rarity);
            await dbContext.SaveChangesAsync();

            // Act
            rarity.Name = "Super Rare";
            await repository.Update(rarity);

            // Assert
            var result = await dbContext.Rarities.FirstOrDefaultAsync(r => r.Id == 1);
            Assert.NotNull(result);
            Assert.Equal("Super Rare", result.Name);
        }

        [Fact]
        public async Task Delete_ShouldRemoveRarity()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new RarityRepository(dbContext);

            var rarity = new Rarity { Id = 1, Name = "Uncommon", Color="Blue" };
            dbContext.Rarities.Add(rarity);
            await dbContext.SaveChangesAsync();

            // Act
            await repository.Delete(rarity.Id);

            // Assert
            var result = await dbContext.Rarities.FirstOrDefaultAsync(r => r.Id == 1);
            Assert.Null(result);
        }

    }
}