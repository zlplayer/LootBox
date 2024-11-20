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
    public class WearRatingServiceTests
    {
        private readonly Mock<IWearRatingRepository> _mockWearRatingRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly WearRatingService _wearRatingService;

        public WearRatingServiceTests()
        {
            _mockWearRatingRepository = new Mock<IWearRatingRepository>();
            _mockMapper = new Mock<IMapper>();
            _wearRatingService = new WearRatingService(_mockWearRatingRepository.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GetAllWearRating_ShouldReturnListOfWearRatingDto()
        {
            // Arrange
            var wearRatingList = new List<WearRating>
            {
                new WearRating { Id = 1, Name = "Low" },
                new WearRating { Id = 2, Name = "High" }
            };

            var wearRatingDtoList = new List<WearRatingDto>
            {
                new WearRatingDto { Id = 1, Name = "Low" },
                new WearRatingDto { Id = 2, Name = "High" }
            };

            _mockWearRatingRepository.Setup(r => r.GetAllWearRating()).ReturnsAsync(wearRatingList);
            _mockMapper.Setup(m => m.Map<IEnumerable<WearRatingDto>>(wearRatingList)).Returns(wearRatingDtoList);

            // Act
            var result = await _wearRatingService.GetAllWearRating();

            // Assert
            Assert.Equal(2, result.Count());  // Ensure the correct number of items are returned
            Assert.Equal("Low", result.First().Name);
        }

        [Fact]
        public async Task GetWearRatingById_ShouldReturnWearRatingDto_WhenWearRatingExists()
        {
            // Arrange
            var wearRating = new WearRating { Id = 1, Name = "Low" };
            var wearRatingDto = new WearRatingDto { Id = 1, Name = "Low" };

            _mockWearRatingRepository.Setup(r => r.GetWearRatingById(1)).ReturnsAsync(wearRating);
            _mockMapper.Setup(m => m.Map<WearRatingDto>(wearRating)).Returns(wearRatingDto);

            // Act
            var result = await _wearRatingService.GetWearRatingById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Low", result.Name);
        }

        [Fact]
        public async Task GetWearRatingById_ShouldThrowException_WhenWearRatingDoesNotExist()
        {
            // Arrange
            _mockWearRatingRepository.Setup(r => r.GetWearRatingById(1)).ReturnsAsync((WearRating)null);

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _wearRatingService.GetWearRatingById(1));
        }

        [Fact]
        public async Task Create_ShouldCallRepositoryCreateMethod()
        {
            // Arrange
            var wearRatingDto = new WearRatingDto { Id = 1, Name = "Low" };
            var wearRating = new WearRating { Id = 1, Name = "Low" };

            _mockMapper.Setup(m => m.Map<WearRating>(wearRatingDto)).Returns(wearRating);

            // Act
            await _wearRatingService.Create(wearRatingDto);

            // Assert
            _mockWearRatingRepository.Verify(r => r.Create(wearRating), Times.Once);
        }

        [Fact]
        public async Task Update_ShouldThrowException_WhenWearRatingDoesNotExist()
        {
            // Arrange
            var wearRatingDto = new WearRatingDto { Id = 1, Name = "Low" };
            _mockWearRatingRepository.Setup(r => r.GetWearRatingById(1)).ReturnsAsync((WearRating)null);

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _wearRatingService.Update(1, wearRatingDto));
        }

        [Fact]
        public async Task Update_ShouldCallRepositoryUpdateMethod_WhenWearRatingExists()
        {
            // Arrange
            var existingWearRating = new WearRating { Id = 1, Name = "Low" };
            var wearRatingDto = new WearRatingDto { Id = 1, Name = "High" };
            var updatedWearRating = new WearRating { Id = 1, Name = "High" };

            _mockWearRatingRepository.Setup(r => r.GetWearRatingById(1)).ReturnsAsync(existingWearRating);
            _mockMapper.Setup(m => m.Map(wearRatingDto, existingWearRating)).Returns(updatedWearRating);

            // Act
            await _wearRatingService.Update(1, wearRatingDto);

            // Assert
            _mockWearRatingRepository.Verify(r => r.Update(updatedWearRating), Times.Once);
        }

        [Fact]
        public async Task Delete_ShouldThrowNotFoundException_WhenWearRatingDoesNotExist()
        {
            // Arrange
            _mockWearRatingRepository.Setup(r => r.GetWearRatingById(1)).ReturnsAsync((WearRating)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => _wearRatingService.Delete(1));
        }

        [Fact]
        public async Task Delete_ShouldCallRepositoryDeleteMethod_WhenWearRatingExists()
        {
            // Arrange
            var wearRating = new WearRating { Id = 1, Name = "Low" };

            _mockWearRatingRepository.Setup(r => r.GetWearRatingById(1)).ReturnsAsync(wearRating);

            // Act
            await _wearRatingService.Delete(1);

            // Assert
            _mockWearRatingRepository.Verify(r => r.Delete(wearRating.Id), Times.Once);
        }
    }
}
