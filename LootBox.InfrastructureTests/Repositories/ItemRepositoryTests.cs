using Xunit;
using LootBox.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LootBox.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;

namespace LootBox.Infrastructure.Repositories.Tests
{
    public class ItemRepositoryTests
    {
        private readonly LootBoxDbContext _dbContext;
        private readonly ItemRepository _repository;

        public ItemRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<LootBoxDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _dbContext = new LootBoxDbContext(options);
            _repository = new ItemRepository(_dbContext);
        }

        private async Task SeedData()
        {
            var items = new List<Item>
        {
            new Item { Id = 1, Name = "Sword", Price = 100, Image="sword.png" , Rarity = new Rarity { Name = "Rare", Color="Blue" }, WearRating = new WearRating { Name = "New" }, TypeItem = new TypeItem { Name = "Weapon" },  },
            new Item { Id = 2, Name = "Shield", Price = 150, Image="shield.png", Rarity = new Rarity { Name = "Epic", Color= "Purple" }, WearRating = new WearRating { Name = "Used" }, TypeItem = new TypeItem { Name = "Armor" } }
        };

            await _dbContext.AddRangeAsync(items);
            await _dbContext.SaveChangesAsync();
        }

        [Fact]
        public async Task GetAllItem_ShouldReturnAllItemsWithIncludes()
        {
            // Arrange
            await SeedData();

            // Act
            var result = await _repository.GetAllItem();

            // Assert
            result.Should().HaveCount(2);
            result.First().Rarity.Name.Should().Be("Rare");
            result.First().WearRating.Name.Should().Be("New");
            result.First().TypeItem.Name.Should().Be("Weapon");
        }

        [Fact]
        public async Task GetItemById_ShouldReturnCorrectItem_WhenItemExists()
        {
            // Arrange
            await SeedData();

            // Act
            var result = await _repository.GetItemById(1);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be("Sword");
            result.Rarity.Name.Should().Be("Rare");
        }

        [Fact]
        public async Task Create_ShouldAddNewItem()
        {
            // Arrange
            var newItem = new Item
            {
                Name = "Helmet",
                Price = 50,
                Image = "helmet.png",
                Rarity = new Rarity { Name = "Common", Color= "Blue" },
                WearRating = new WearRating { Name = "New" },
                TypeItem = new TypeItem { Name = "Headgear" }
            };

            // Act
            await _repository.Create(newItem);
            var result = await _dbContext.Items.Include(i => i.Rarity).FirstOrDefaultAsync(i => i.Name == "Helmet");

            // Assert
            result.Should().NotBeNull();
            result.Price.Should().Be(50);
            result.Rarity.Name.Should().Be("Common");
        }

        [Fact]
        public async Task Update_ShouldModifyExistingItem()
        {
            // Arrange
            await SeedData();
            var itemToUpdate = await _repository.GetItemById(1);
            itemToUpdate.Name = "Updated Sword";

            // Act
            await _repository.Update(itemToUpdate);
            var result = await _repository.GetItemById(1);

            // Assert
            result.Name.Should().Be("Updated Sword");
        }

        [Fact]
        public async Task Delete_ShouldRemoveItem_WhenItemExists()
        {
            // Arrange
            await SeedData();

            // Act
            await _repository.Delete(1);
            var result = await _repository.GetItemById(1);

            // Assert
            result.Should().BeNull();
        }

    }
}