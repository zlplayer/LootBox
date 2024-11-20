using Xunit;
using Assert =Xunit.Assert;
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
    public class TypeItemRepositoryTests
    {
        private readonly DbContextOptions<LootBoxDbContext> _dbContextOptions;
        public TypeItemRepositoryTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<LootBoxDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;
        }

        [Fact]
        public async Task GetAllTypeItem_ShouldReturnAllTypeItems()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new TypeItemRepository(dbContext);

            dbContext.TypeItems.AddRange(
                new TypeItem { Id = 1, Name = "Weapon" },
                new TypeItem { Id = 2, Name = "Armor" }
            );
            await dbContext.SaveChangesAsync();

            // Act
            var result = await repository.GetAllTypeItem();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetTypeItemById_ShouldReturnCorrectTypeItem()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new TypeItemRepository(dbContext);

            var typeItemId = 1;
            dbContext.TypeItems.Add(new TypeItem { Id = typeItemId, Name = "Consumable" });
            await dbContext.SaveChangesAsync();

            // Act
            var result = await repository.GetTypeItemById(typeItemId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(typeItemId, result.Id);
            Assert.Equal("Consumable", result.Name);
        }

        [Fact]
        public async Task Create_ShouldAddNewTypeItem()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new TypeItemRepository(dbContext);

            var typeItem = new TypeItem { Name = "Accessory" };

            // Act
            await repository.Create(typeItem);

            // Assert
            var result = await dbContext.TypeItems.FirstOrDefaultAsync(t => t.Name == "Accessory");
            Assert.NotNull(result);
            Assert.Equal("Accessory", result.Name);
        }

        [Fact]
        public async Task Update_ShouldModifyExistingTypeItem()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new TypeItemRepository(dbContext);

            var typeItem = new TypeItem { Id = 1, Name = "Material" };
            dbContext.TypeItems.Add(typeItem);
            await dbContext.SaveChangesAsync();

            // Act
            typeItem.Name = "Crafting Material";
            await repository.Update(typeItem);

            // Assert
            var result = await dbContext.TypeItems.FirstOrDefaultAsync(t => t.Id == 1);
            Assert.NotNull(result);
            Assert.Equal("Crafting Material", result.Name);
        }

        [Fact]
        public async Task Delete_ShouldRemoveTypeItem()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new TypeItemRepository(dbContext);

            var typeItem = new TypeItem { Id = 1, Name = "Miscellaneous" };
            dbContext.TypeItems.Add(typeItem);
            await dbContext.SaveChangesAsync();

            // Act
            await repository.Delete(typeItem.Id);

            // Assert
            var result = await dbContext.TypeItems.FirstOrDefaultAsync(t => t.Id == 1);
            Assert.Null(result);
        }

    }
}