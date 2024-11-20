using Xunit;
using Assert = Xunit.Assert;
using LootBox.Application.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using LootBox.Application.Dtos;
using LootBox.Domain.Entities;
using LootBox.Domain.Exceptions;
using LootBox.Domain.Interfaces;
using Moq;

namespace LootBox.Application.Services.Tests
{
    public class TypeItemServiceTests
    {
        private readonly Mock<ITypeItemRepository> _mockTypeItemRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly TypeItemService _typeItemService;

        public TypeItemServiceTests()
        {
            _mockTypeItemRepository = new Mock<ITypeItemRepository>();
            _mockMapper = new Mock<IMapper>();
            _typeItemService = new TypeItemService(_mockMapper.Object, _mockTypeItemRepository.Object);
        }

        [Fact]
        public async Task GetAllTypeItem_ShouldReturnListOfTypeItemDto()
        {
            // Arrange
            var typeItemList = new List<TypeItem>
            {
                new TypeItem { Id = 1, Name = "Weapon" },
                new TypeItem { Id = 2, Name = "Armor" }
            };

            var typeItemDtoList = new List<TypeItemDto>
            {
                new TypeItemDto { Id = 1, Name = "Weapon" },
                new TypeItemDto { Id = 2, Name = "Armor" }
            };

            _mockTypeItemRepository.Setup(r => r.GetAllTypeItem()).ReturnsAsync(typeItemList);
            _mockMapper.Setup(m => m.Map<IEnumerable<TypeItemDto>>(typeItemList)).Returns(typeItemDtoList);

            // Act
            var result = await _typeItemService.GetAllTypeItem();

            // Assert
            Assert.Equal(2, result.Count());  // Use Count() for IEnumerable
            Assert.Equal("Weapon", result.First().Name);
        }

        [Fact]
        public async Task GetTypeItemById_ShouldReturnTypeItemDto_WhenTypeItemExists()
        {
            // Arrange
            var typeItem = new TypeItem { Id = 1, Name = "Weapon" };
            var typeItemDto = new TypeItemDto { Id = 1, Name = "Weapon" };

            _mockTypeItemRepository.Setup(r => r.GetTypeItemById(1)).ReturnsAsync(typeItem);
            _mockMapper.Setup(m => m.Map<TypeItemDto>(typeItem)).Returns(typeItemDto);

            // Act
            var result = await _typeItemService.GetTypeItemById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Weapon", result.Name);
        }

        [Fact]
        public async Task GetTypeItemById_ShouldThrowNotFoundException_WhenTypeItemDoesNotExist()
        {
            // Arrange
            _mockTypeItemRepository.Setup(r => r.GetTypeItemById(1)).ReturnsAsync((TypeItem)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => _typeItemService.GetTypeItemById(1));
        }

        [Fact]
        public async Task Create_ShouldCallRepositoryCreateMethod()
        {
            // Arrange
            var typeItemDto = new TypeItemDto { Id = 1, Name = "Weapon" };
            var typeItem = new TypeItem { Id = 1, Name = "Weapon" };

            _mockMapper.Setup(m => m.Map<TypeItem>(typeItemDto)).Returns(typeItem);

            // Act
            await _typeItemService.Create(typeItemDto);

            // Assert
            _mockTypeItemRepository.Verify(r => r.Create(typeItem), Times.Once);
        }

        [Fact]
        public async Task Update_ShouldThrowNotFoundException_WhenTypeItemDoesNotExist()
        {
            // Arrange
            var typeItemDto = new TypeItemDto { Id = 1, Name = "Weapon" };
            _mockTypeItemRepository.Setup(r => r.GetTypeItemById(1)).ReturnsAsync((TypeItem)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => _typeItemService.Update(1, typeItemDto));
        }

        [Fact]
        public async Task Update_ShouldCallRepositoryUpdateMethod_WhenTypeItemExists()
        {
            // Arrange
            var existingTypeItem = new TypeItem { Id = 1, Name = "Weapon" };
            var typeItemDto = new TypeItemDto { Id = 1, Name = "Armor" };
            var updatedTypeItem = new TypeItem { Id = 1, Name = "Armor" };

            _mockTypeItemRepository.Setup(r => r.GetTypeItemById(1)).ReturnsAsync(existingTypeItem);
            _mockMapper.Setup(m => m.Map(typeItemDto, existingTypeItem)).Returns(updatedTypeItem);

            // Act
            await _typeItemService.Update(1, typeItemDto);

            // Assert
            _mockTypeItemRepository.Verify(r => r.Update(updatedTypeItem), Times.Once);
        }

        [Fact]
        public async Task Delete_ShouldThrowNotFoundException_WhenTypeItemDoesNotExist()
        {
            // Arrange
            _mockTypeItemRepository.Setup(r => r.GetTypeItemById(1)).ReturnsAsync((TypeItem)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => _typeItemService.Delete(1));
        }

        [Fact]
        public async Task Delete_ShouldCallRepositoryDeleteMethod_WhenTypeItemExists()
        {
            // Arrange
            var typeItem = new TypeItem { Id = 1, Name = "Weapon" };

            _mockTypeItemRepository.Setup(r => r.GetTypeItemById(1)).ReturnsAsync(typeItem);

            // Act
            await _typeItemService.Delete(1);

            // Assert
            _mockTypeItemRepository.Verify(r => r.Delete(typeItem.Id), Times.Once);
        }
    }
}
