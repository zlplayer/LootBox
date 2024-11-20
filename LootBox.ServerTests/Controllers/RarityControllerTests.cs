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
    public class RarityControllerTests
    {
        private readonly Mock<IRarityService> _rarityServiceMock;
        private readonly RarityController _controller;

        public RarityControllerTests()
        {
            _rarityServiceMock = new Mock<IRarityService>();
            _controller = new RarityController(_rarityServiceMock.Object);
        }

        [Fact]
        public async Task GetAllRarity_ShouldReturnOkWithRarities()
        {
            // Arrange
            var rarities = new List<RarityDto>
            {
                new RarityDto { Id = 1, Name = "Common", Color = "Gray" },
                new RarityDto { Id = 2, Name = "Rare", Color = "Blue" }
            };
            _rarityServiceMock.Setup(s => s.GetAllRarity()).ReturnsAsync(rarities);

            // Act
            var result = await _controller.GetAllRarity();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var returnedRarities = Assert.IsType<List<RarityDto>>(actionResult.Value);
            Assert.Equal(rarities.Count, returnedRarities.Count);
            Assert.Equal("Common", returnedRarities[0].Name);
        }

        [Fact]
        public async Task GetRarityById_ShouldReturnOkWithRarity()
        {
            // Arrange
            var rarityId = 1;
            var rarity = new RarityDto { Id = rarityId, Name = "Epic", Color = "Purple" };
            _rarityServiceMock.Setup(s => s.GetRarityById(rarityId)).ReturnsAsync(rarity);

            // Act
            var result = await _controller.GetRarityById(rarityId);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var returnedRarity = Assert.IsType<RarityDto>(actionResult.Value);
            Assert.Equal("Epic", returnedRarity.Name);
            Assert.Equal("Purple", returnedRarity.Color);
        }

        [Fact]
        public async Task CreateRarity_ShouldReturnOk()
        {
            // Arrange
            var rarityDto = new RarityDto { Name = "Legendary", Color = "Gold" };
            _rarityServiceMock.Setup(s => s.Create(rarityDto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.CreateRarity(rarityDto);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

        [Fact]
        public async Task UpdateRarity_ShouldReturnOk()
        {
            // Arrange
            var rarityId = 1;
            var rarityDto = new RarityDto { Name = "Updated Rarity", Color = "Updated Color" };
            _rarityServiceMock.Setup(s => s.Update(rarityId, rarityDto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.UpdateRarity(rarityId, rarityDto);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

        [Fact]
        public async Task DeleteRarity_ShouldReturnOk()
        {
            // Arrange
            var rarityId = 1;
            _rarityServiceMock.Setup(s => s.Delete(rarityId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteRarity(rarityId);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

    }
}