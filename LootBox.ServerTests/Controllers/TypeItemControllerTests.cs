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
    public class TypeItemControllerTests
    {
        private readonly Mock<ITypeItemService> _typeItemServiceMock;
        private readonly TypeItemController _controller;

        public TypeItemControllerTests()
        {
            _typeItemServiceMock = new Mock<ITypeItemService>();
            _controller = new TypeItemController(_typeItemServiceMock.Object);
        }
        [Fact]
        public async Task GetAllTypeItem_ShouldReturnOkWithTypeItems()
        {
            // Arrange
            var typeItems = new List<TypeItemDto>
            {
                new TypeItemDto { Id = 1, Name = "Weapon" },
                new TypeItemDto { Id = 2, Name = "Armor" }
            };
            _typeItemServiceMock.Setup(s => s.GetAllTypeItem()).ReturnsAsync(typeItems);

            // Act
            var result = await _controller.GetAllTypeItem();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var returnedTypeItems = Assert.IsType<List<TypeItemDto>>(actionResult.Value);
            Assert.Equal(typeItems.Count, returnedTypeItems.Count);
            Assert.Equal("Weapon", returnedTypeItems[0].Name);
        }

        [Fact]
        public async Task GetTypeItemById_ShouldReturnOkWithTypeItem()
        {
            // Arrange
            var typeId = 1;
            var typeItem = new TypeItemDto { Id = typeId, Name = "Weapon" };
            _typeItemServiceMock.Setup(s => s.GetTypeItemById(typeId)).ReturnsAsync(typeItem);

            // Act
            var result = await _controller.GetTypeItemById(typeId);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var returnedTypeItem = Assert.IsType<TypeItemDto>(actionResult.Value);
            Assert.Equal("Weapon", returnedTypeItem.Name);
        }

        [Fact]
        public async Task CreateTypeItem_ShouldReturnOk()
        {
            // Arrange
            var typeItemDto = new TypeItemDto { Name = "Accessory" };
            _typeItemServiceMock.Setup(s => s.Create(typeItemDto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.CreateTypeItem(typeItemDto);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

        [Fact]
        public async Task UpdateTypeItem_ShouldReturnOk()
        {
            // Arrange
            var typeId = 1;
            var typeItemDto = new TypeItemDto { Name = "Updated Name" };
            _typeItemServiceMock.Setup(s => s.Update(typeId, typeItemDto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.UpdateTypeItem(typeId, typeItemDto);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

        [Fact]
        public async Task DeleteTypeItem_ShouldReturnOk()
        {
            // Arrange
            var typeId = 1;
            _typeItemServiceMock.Setup(s => s.Delete(typeId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteTypeItem(typeId);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

    }
}