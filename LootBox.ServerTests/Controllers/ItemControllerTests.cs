using Xunit;
using LootBox.Server.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace LootBox.Server.Controllers.Tests
{
    public class ItemControllerTests
    {
        private readonly Mock<IItemService> _itemServiceMock;
        private readonly ItemController _controller;

        public ItemControllerTests()
        {
            _itemServiceMock = new Mock<IItemService>();
            _controller = new ItemController(_itemServiceMock.Object);
        }

        [Fact]
        public async Task Create_ShouldReturnOk_WhenCalled()
        {
            // Arrange
            var createItemDto = new CreateItemDto { Name = "Sword", Price = 100 };

            _itemServiceMock
                .Setup(service => service.Create(It.IsAny<CreateItemDto>()))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Create(createItemDto);

            // Assert
            result.Should().BeOfType<OkResult>();
            _itemServiceMock.Verify(service => service.Create(createItemDto), Times.Once);
        }

        [Fact]
        public async Task GetAllItem_ShouldReturnOkWithItems()
        {
            // Arrange
            var items = new List<ItemDto>
        {
            new ItemDto { Name = "Sword", Price = 100 },
            new ItemDto { Name = "Shield", Price = 150 }
        };

            _itemServiceMock
                .Setup(service => service.GetAllItem())
                .ReturnsAsync(items);

            // Act
            var result = await _controller.GetAllItem();

            // Assert
            result.Should().BeOfType<OkObjectResult>();

            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(items);

            _itemServiceMock.Verify(service => service.GetAllItem(), Times.Once);
        }

        [Fact]
        public async Task GetItemById_ShouldReturnOkWithItem_WhenItemExists()
        {
            // Arrange
            var itemId = 1;
            var item = new ItemDto { Name = "Sword", Price = 100 };

            _itemServiceMock
                .Setup(service => service.GetItemById(itemId))
                .ReturnsAsync(item);

            // Act
            var result = await _controller.GetItemById(itemId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();

            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(item);

            _itemServiceMock.Verify(service => service.GetItemById(itemId), Times.Once);
        }

        [Fact]
        public async Task Update_ShouldReturnOk_WhenCalled()
        {
            // Arrange
            var itemId = 1;
            var updateItemDto = new UpdateItemDto { Name = "Updated Sword", Price = 120 };

            _itemServiceMock
                .Setup(service => service.Update(itemId, updateItemDto))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Update(itemId, updateItemDto);

            // Assert
            result.Should().BeOfType<OkResult>();
            _itemServiceMock.Verify(service => service.Update(itemId, updateItemDto), Times.Once);
        }

        [Fact]
        public async Task Delete_ShouldReturnOk_WhenCalled()
        {
            // Arrange
            var itemId = 1;

            _itemServiceMock
                .Setup(service => service.Delete(itemId))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Delete(itemId);

            // Assert
            result.Should().BeOfType<OkResult>();
            _itemServiceMock.Verify(service => service.Delete(itemId), Times.Once);
        }
    }
}