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
using System.Linq;

namespace LootBox.Application.Services.Tests
{
    public class RarityServiceTests
    {
        private readonly Mock<IRarityRepository> _mockRarityRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly RarityService _rarityService;

        public RarityServiceTests()
        {
            _mockRarityRepository = new Mock<IRarityRepository>();
            _mockMapper = new Mock<IMapper>();
            _rarityService = new RarityService(_mockMapper.Object, _mockRarityRepository.Object);
        }

        [Fact]
        public async Task GetAllRarity_ShouldReturnListOfRarityDto()
        {
            // Arrange
            var rarityList = new List<Rarity> { new Rarity { Id = 1, Name = "Common" }, new Rarity { Id = 2, Name = "Rare" } };
            var rarityDtoList = new List<RarityDto> { new RarityDto { Id = 1, Name = "Common" }, new RarityDto { Id = 2, Name = "Rare" } };

            _mockRarityRepository.Setup(r => r.GetAllRarity()).ReturnsAsync(rarityList);
            _mockMapper.Setup(m => m.Map<IEnumerable<RarityDto>>(rarityList)).Returns(rarityDtoList);

            // Act
            var result = await _rarityService.GetAllRarity();

            // Assert
            Assert.Equal(2, result.Count()); // Assuming the result is IEnumerable<RarityDto>
            Assert.Equal("Common", result.First().Name);
        }

        [Fact]
        public async Task GetRarityById_ShouldReturnRarityDto_WhenRarityExists()
        {
            // Arrange
            var rarity = new Rarity { Id = 1, Name = "Common" };
            var rarityDto = new RarityDto { Id = 1, Name = "Common" };

            _mockRarityRepository.Setup(r => r.GetRarityById(1)).ReturnsAsync(rarity);
            _mockMapper.Setup(m => m.Map<RarityDto>(rarity)).Returns(rarityDto);

            // Act
            var result = await _rarityService.GetRarityById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Common", result.Name);
        }

        [Fact]
        public async Task GetRarityById_ShouldThrowNotFoundException_WhenRarityDoesNotExist()
        {
            // Arrange
            _mockRarityRepository.Setup(r => r.GetRarityById(1)).ReturnsAsync((Rarity)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => _rarityService.GetRarityById(1));
        }

        [Fact]
        public async Task Create_ShouldCallRepositoryCreateMethod()
        {
            // Arrange
            var rarityDto = new RarityDto { Id = 1, Name = "Common" };
            var rarity = new Rarity { Id = 1, Name = "Common" };

            _mockMapper.Setup(m => m.Map<Rarity>(rarityDto)).Returns(rarity);

            // Act
            await _rarityService.Create(rarityDto);

            // Assert
            _mockRarityRepository.Verify(r => r.Create(rarity), Times.Once);
        }

        [Fact]
        public async Task Update_ShouldThrowNotFoundException_WhenRarityDoesNotExist()
        {
            // Arrange
            var rarityDto = new RarityDto { Id = 1, Name = "Common" };
            _mockRarityRepository.Setup(r => r.GetRarityById(1)).ReturnsAsync((Rarity)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => _rarityService.Update(1, rarityDto));
        }

        [Fact]
        public async Task Update_ShouldCallRepositoryUpdateMethod_WhenRarityExists()
        {
            // Arrange
            var existingRarity = new Rarity { Id = 1, Name = "Common" };
            var rarityDto = new RarityDto { Id = 1, Name = "Rare" };
            var updatedRarity = new Rarity { Id = 1, Name = "Rare" };

            _mockRarityRepository.Setup(r => r.GetRarityById(1)).ReturnsAsync(existingRarity);
            _mockMapper.Setup(m => m.Map(rarityDto, existingRarity)).Returns(updatedRarity);

            // Act
            await _rarityService.Update(1, rarityDto);

            // Assert
            _mockRarityRepository.Verify(r => r.Update(updatedRarity), Times.Once);
        }

        [Fact]
        public async Task Delete_ShouldThrowNotFoundException_WhenRarityDoesNotExist()
        {
            // Arrange
            _mockRarityRepository.Setup(r => r.GetRarityById(1)).ReturnsAsync((Rarity)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => _rarityService.Delete(1));
        }

        [Fact]
        public async Task Delete_ShouldCallRepositoryDeleteMethod_WhenRarityExists()
        {
            // Arrange
            var rarity = new Rarity { Id = 1, Name = "Common" };

            _mockRarityRepository.Setup(r => r.GetRarityById(1)).ReturnsAsync(rarity);

            // Act
            await _rarityService.Delete(1);

            // Assert
            _mockRarityRepository.Verify(r => r.Delete(1), Times.Once);
        }
    }
}
