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
    public class EquipmentControllerTests
    {
        private readonly Mock<IEquipmentService> _equipmentServiceMock;
        private readonly EquipmentController _controller;

        public EquipmentControllerTests()
        {
            _equipmentServiceMock = new Mock<IEquipmentService>();
            _controller = new EquipmentController(_equipmentServiceMock.Object);
        }

        [Fact]
        public async Task GetAllEquipmentUser_ShouldReturnOkWithEquipment()
        {
            // Arrange
            var userId = 1;
            var equipment = new List<EquipmentDto>
        {
        new EquipmentDto
        {
            Name = "Sword",
            Image = "sword.jpg",
            Price = 100.0f,
            RarityColor = "Blue",
            WearRatingName = "Pristine",
            TypeItemName = "Weapon"
        },
        new EquipmentDto
        {
            Name = "Shield",
            Image = "shield.jpg",
            Price = 150.0f,
            RarityColor = "Purple",
            WearRatingName = "Used",
            TypeItemName = "Armor"
        }
        };
            _equipmentServiceMock.Setup(s => s.GetAllEquipmentUser(userId)).ReturnsAsync(equipment);

            // Act
            var result = await _controller.GetAllEquipmentUser(userId);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var returnedEquipment = Assert.IsType<List<EquipmentDto>>(actionResult.Value);
            Assert.Equal(equipment.Count, returnedEquipment.Count);
            Assert.Equal("Sword", returnedEquipment[0].Name);
            Assert.Equal("Pristine", returnedEquipment[0].WearRatingName);
        }

        [Fact]
        public async Task Create_ShouldReturnOk()
        {
            // Arrange
            var itemId = 1;
            var userId = 2;
            _equipmentServiceMock.Setup(s => s.Create(itemId, userId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Create(itemId, userId);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

        [Fact]
        public async Task Delete_ShouldReturnOk()
        {
            // Arrange
            var equipmentId = 1;
            _equipmentServiceMock.Setup(s => s.Delete(equipmentId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Delete(equipmentId);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

    }
}