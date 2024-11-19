using AutoMapper;
using LootBox.Application.Dtos;
using LootBox.Application.Services;
using LootBox.Domain.Entities;
using LootBox.Domain.Exceptions;
using LootBox.Domain.Interfaces;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;

namespace LootBox.Tests.Application.Services
{
    public class ItemServiceTests
    {
        private readonly Mock<IItemRepository> _itemRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly ItemService _itemService;

        public ItemServiceTests()
        {
            _itemRepositoryMock = new Mock<IItemRepository>();
            _mapperMock = new Mock<IMapper>();
            _itemService = new ItemService(_mapperMock.Object, _itemRepositoryMock.Object);
        }

        [Fact]
        public async Task GetAllItem_ShouldReturnListOfItemDtos_WhenItemsExist()
        {
            // Arrange
            var items = new List<Item> { new Item { Id = 1, Name = "Sword" } };
            var itemDtos = new List<ItemDto> { new ItemDto { Id = 1, Name = "Sword" } };

            _itemRepositoryMock.Setup(repo => repo.GetAllItem()).ReturnsAsync(items);
            _mapperMock.Setup(mapper => mapper.Map<IEnumerable<ItemDto>>(items)).Returns(itemDtos);

            // Act
            var result = await _itemService.GetAllItem();

            // Assert
            result.Should().BeEquivalentTo(itemDtos);
            _itemRepositoryMock.Verify(repo => repo.GetAllItem(), Times.Once);
        }

        [Fact]
        public async Task GetItemById_ShouldReturnItemDto_WhenItemExists()
        {
            // Arrange
            var item = new Item { Id = 1, Name = "Shield" };
            var itemDto = new ItemDto { Id = 1, Name = "Shield" };

            _itemRepositoryMock.Setup(repo => repo.GetItemById(1)).ReturnsAsync(item);
            _mapperMock.Setup(mapper => mapper.Map<ItemDto>(item)).Returns(itemDto);

            // Act
            var result = await _itemService.GetItemById(1);

            // Assert
            result.Should().BeEquivalentTo(itemDto);
        }

        [Fact]
        public async Task GetItemById_ShouldThrowNotFoundException_WhenItemDoesNotExist()
        {
            // Arrange
            _itemRepositoryMock.Setup(repo => repo.GetItemById(It.IsAny<int>())).ReturnsAsync((Item)null);

            // Act
            var act = async () => await _itemService.GetItemById(1);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>().WithMessage("Item not found");
        }

        [Fact]
        public async Task Create_ShouldCallRepositoryCreate_WhenCalled()
        {
            // Arrange
            var createItemDto = new CreateItemDto { Name = "Bow" };
            var item = new Item { Name = "Bow" };

            _mapperMock.Setup(mapper => mapper.Map<Item>(createItemDto)).Returns(item);
            _itemRepositoryMock.Setup(repo => repo.Create(item)).Returns(Task.CompletedTask);

            // Act
            await _itemService.Create(createItemDto);

            // Assert
            _itemRepositoryMock.Verify(repo => repo.Create(item), Times.Once);
        }

        [Fact]
        public async Task Update_ShouldCallRepositoryUpdate_WhenItemExists()
        {
            // Arrange
            var updateItemDto = new UpdateItemDto { Name = "Updated Sword" };
            var existingItem = new Item { Id = 1, Name = "Sword" };

            _itemRepositoryMock.Setup(repo => repo.GetItemByIdItem(1)).ReturnsAsync(existingItem);
            _mapperMock.Setup(mapper => mapper.Map(updateItemDto, existingItem)).Returns(existingItem);

            // Act
            await _itemService.Update(1, updateItemDto);

            // Assert
            _itemRepositoryMock.Verify(repo => repo.Update(existingItem), Times.Once);
        }

        [Fact]
        public async Task Update_ShouldThrowNotFoundException_WhenItemDoesNotExist()
        {
            // Arrange
            _itemRepositoryMock.Setup(repo => repo.GetItemByIdItem(It.IsAny<int>())).ReturnsAsync((Item)null);

            // Act
            var act = async () => await _itemService.Update(1, new UpdateItemDto { Name = "Invalid" });

            // Assert
            await act.Should().ThrowAsync<NotFoundException>().WithMessage("Item not found");
        }

        [Fact]
        public async Task Delete_ShouldCallRepositoryDelete_WhenCalled()
        {
            // Act
            await _itemService.Delete(1);

            // Assert
            _itemRepositoryMock.Verify(repo => repo.Delete(1), Times.Once);
        }
    }
}
